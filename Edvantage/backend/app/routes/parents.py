from flask import Blueprint, request, jsonify
from app.models.parent import Parent
from app.models.student import Student
from app.models.user import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

parents_bp = Blueprint('parents', __name__)

@parents_bp.route('/students', methods=['GET'])
@jwt_required()
def get_parent_students():
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"msg": "Parent profile not found"}), 404
    
    return jsonify([s.to_dict() for s in parent.students]), 200

@parents_bp.route('/interventions', methods=['GET'])
@jwt_required()
def get_parent_interventions():
    """Get active interventions for all children of this parent"""
    current_user_id = get_jwt_identity()
    parent = Parent.query.filter_by(user_id=current_user_id).first()
    if not parent:
        return jsonify({"msg": "Parent profile not found"}), 404
    
    all_interventions = []
    for student in parent.students:
        # Sort by creation date
        for intervention in sorted(student.interventions, key=lambda x: x.created_at, reverse=True):
            all_interventions.append({
                "id": intervention.id,
                "student_name": student.user.full_name,
                "type": intervention.type,
                "status": intervention.status,
                "notes": intervention.notes,
                "due_date": intervention.due_date.isoformat() if intervention.due_date else None,
                "created_at": intervention.created_at.isoformat(),
                "recommendation": {
                    "urgency": intervention.recommendation.urgency_score if intervention.recommendation else 0.5
                } if intervention.recommendation else None
            })
            
    return jsonify(all_interventions), 200

@parents_bp.route('/link-student', methods=['POST'])
@jwt_required()
def link_student():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized. Admin access required."}), 403
        
    data = request.get_json()
    parent_id = data.get('parent_id')
    student_id = data.get('student_id')
    
    if not parent_id or not student_id:
        return jsonify({"msg": "parent_id and student_id are required"}), 400
        
    parent = Parent.query.get(parent_id)
    student = Student.query.get(student_id)
    
    if not parent or not student:
        return jsonify({"msg": "Parent or Student not found"}), 404
        
    if student not in parent.students:
        parent.students.append(student)
        db.session.commit()
        return jsonify({"msg": "Student linked to parent successfully"}), 200
    
    return jsonify({"msg": "Student already linked to parent"}), 200
