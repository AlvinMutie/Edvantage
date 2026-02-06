from flask import Blueprint, jsonify, request
from app.models.student import Student
from app.models.user import User
from app.models.saved_filter import SavedFilter
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_

search_bp = Blueprint('search', __name__)

@search_bp.route('/students', methods=['POST'])
@jwt_required()
def advanced_search():
    """Advanced student search with multiple filters"""
    data = request.get_json()
    
    # Build query
    query = Student.query
    
    # GPA filter
    if 'gpa_min' in data:
        query = query.filter(Student.gpa >= float(data['gpa_min']))
    if 'gpa_max' in data:
        query = query.filter(Student.gpa <= float(data['gpa_max']))
    
    # Attendance filter
    if 'attendance_min' in data:
        query = query.filter(Student.attendance >= float(data['attendance_min']))
    if 'attendance_max' in data:
        query = query.filter(Student.attendance <= float(data['attendance_max']))
    
    # Department filter
    if 'department' in data and data['department']:
        query = query.filter(Student.department == data['department'])
    
    # Semester filter
    if 'semester' in data and data['semester']:
        query = query.filter(Student.current_semester == int(data['semester']))
    
    # Risk status filter
    if 'risk_status' in data and data['risk_status']:
        query = query.filter(Student.risk_status == data['risk_status'])
    
    # Name search
    if 'name' in data and data['name']:
        query = query.filter(Student.full_name.ilike(f"%{data['name']}%"))
    
    students = query.all()
    
    return jsonify({
        'students': [s.to_dict() for s in students],
        'total': len(students)
    }), 200

@search_bp.route('/filters/save', methods=['POST'])
@jwt_required()
def save_filter():
    """Save a custom search filter"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    saved_filter = SavedFilter(
        user_id=current_user_id,
        name=data['name'],
        criteria=data['criteria']
    )
    
    db.session.add(saved_filter)
    db.session.commit()
    
    return jsonify(saved_filter.to_dict()), 201

@search_bp.route('/filters/mine', methods=['GET'])
@jwt_required()
def get_my_filters():
    """Get user's saved filters"""
    current_user_id = get_jwt_identity()
    filters = SavedFilter.query.filter_by(user_id=current_user_id).all()
    
    return jsonify({'filters': [f.to_dict() for f in filters]}), 200

@search_bp.route('/filters/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_filter(id):
    """Delete a saved filter"""
    current_user_id = get_jwt_identity()
    saved_filter = SavedFilter.query.filter_by(id=id, user_id=current_user_id).first_or_404()
    
    db.session.delete(saved_filter)
    db.session.commit()
    
    return jsonify({"msg": "Filter deleted"}), 200

@search_bp.route('/bulk-action', methods=['POST'])
@jwt_required()
def bulk_action():
    """Perform bulk actions on students"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    data = request.get_json()
    student_ids = data.get('student_ids', [])
    action = data.get('action')  # update_risk, assign_supervisor, delete
    
    if not student_ids or not action:
        return jsonify({"msg": "Missing required fields"}), 400
    
    success_count = 0
    
    if action == 'update_risk':
        new_status = data.get('new_status', 'Safe')
        for student_id in student_ids:
            student = Student.query.get(student_id)
            if student:
                student.risk_status = new_status
                success_count += 1
    
    elif action == 'delete':
        for student_id in student_ids:
            student = Student.query.get(student_id)
            if student:
                db.session.delete(student)
                success_count += 1
    
    db.session.commit()
    
    return jsonify({
        "msg": f"Bulk action completed successfully",
        "success_count": success_count
    }), 200
