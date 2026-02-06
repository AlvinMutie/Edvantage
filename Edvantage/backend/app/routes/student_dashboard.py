from flask import Blueprint, jsonify
from app.models.student import Student
from app.models.assignment import Assignment
from app.services.ai_service import ai_service
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from sqlalchemy import func

student_dashboard_bp = Blueprint('student_dashboard', __name__)

def get_or_create_student_profile(user_id):
    """Get existing student profile or create one if missing"""
    # Try to find existing profile
    student = Student.query.filter_by(user_id=user_id).first()
    
    if student:
        return student
        
    # Check if user exists and is a student
    from app.models.user import User
    user = User.query.get(int(user_id))
    
    if not user or user.role != 'student':
        return None
    
    # Generate unique student ID
    max_student = db.session.query(func.max(Student.id)).scalar()
    next_id = (max_student or 0) + 1
    
    # Create new profile
    student = Student(
        user_id=user.id,
        student_id=f'ST{next_id:04d}',
        full_name=user.username,
        department='Unassigned',
        current_semester=1,
        gpa=0.0,
        attendance=100.0,
        risk_status='Safe'
    )
    db.session.add(student)
    db.session.commit()
    
    return student

@student_dashboard_bp.route('/overview', methods=['GET'])
@jwt_required()
def get_overview():
    """Get student's personal performance overview"""
    current_user_id = get_jwt_identity()
    
    student = get_or_create_student_profile(current_user_id)
    if not student:
        return jsonify({"msg": "Student profile not found"}), 404
    
    # Get assignment statistics
    total_assignments = Assignment.query.filter_by(student_id=student.id).count()
    graded_assignments = Assignment.query.filter_by(student_id=student.id, status='graded').all()
    avg_assignment_score = sum([a.score for a in graded_assignments]) / len(graded_assignments) if graded_assignments else 0
    
    return jsonify({
        'student': student.to_dict(),
        'stats': {
            'gpa': student.gpa,
            'attendance': student.attendance,
            'total_assignments': total_assignments,
            'graded_assignments': len(graded_assignments),
            'avg_assignment_score': round(avg_assignment_score, 1),
            'risk_status': student.risk_status
        }
    }), 200

@student_dashboard_bp.route('/risk', methods=['GET'])
@jwt_required()
def get_risk_assessment():
    """Get AI-powered risk assessment for current student"""
    current_user_id = get_jwt_identity()
    
    student = get_or_create_student_profile(current_user_id)
    if not student:
        return jsonify({"msg": "Student profile not found"}), 404
    
    # Get missed deadlines count
    from datetime import datetime
    missed = Assignment.query.filter(
        Assignment.student_id == student.id,
        Assignment.status == 'pending',
        Assignment.due_date < datetime.now()
    ).count()
    
    # Get AI prediction
    risk_score = ai_service.predict_risk(
        student.gpa if student.gpa else 2.5,
        student.attendance if student.attendance else 85.0,
        missed
    )
    
    risk_level = "Low"
    if risk_score > 75:
        risk_level = "High"
    elif risk_score > 40:
        risk_level = "Medium"
    
    return jsonify({
        'risk_score': risk_score,
        'risk_level': risk_level,
        'factors': {
            'gpa': student.gpa,
            'attendance': student.attendance,
            'missed_deadlines': missed
        }
    }), 200

@student_dashboard_bp.route('/suggestions', methods=['GET'])
@jwt_required()
def get_suggestions():
    """Get personalized improvement suggestions"""
    current_user_id = get_jwt_identity()
    
    student = get_or_create_student_profile(current_user_id)
    if not student:
        return jsonify({"msg": "Student profile not found"}), 404
    
    suggestions = []
    
    # GPA-based suggestions
    if student.gpa < 2.0:
        suggestions.append({
            'category': 'Academic',
            'priority': 'high',
            'message': 'Your GPA is below 2.0. Consider meeting with your academic advisor or joining study groups.',
            'action': 'Schedule advisor meeting'
        })
    elif student.gpa < 3.0:
        suggestions.append({
            'category': 'Academic',
            'priority': 'medium',
            'message': 'Focus on improving your GPA. Attend office hours and seek tutoring for difficult subjects.',
            'action': 'Find tutoring resources'
        })
    
    # Attendance suggestions
    if student.attendance < 70:
        suggestions.append({
            'category': 'Attendance',
            'priority': 'high',
            'message': 'Your attendance is critically low. Regular class attendance is crucial for success.',
            'action': 'Review class schedule'
        })
    elif student.attendance < 85:
        suggestions.append({
            'category': 'Attendance',
            'priority': 'medium',
            'message': 'Try to improve your class attendance. Missing classes can impact your understanding.',
            'action': 'Set attendance goals'
        })
    
    # Assignment suggestions
    pending = Assignment.query.filter_by(student_id=student.id, status='pending').count()
    if pending > 3:
        suggestions.append({
            'category': 'Assignments',
            'priority': 'high',
            'message': f'You have {pending} pending assignments. Prioritize completing them on time.',
            'action': 'View pending assignments'
        })
    
    return jsonify({'suggestions': suggestions}), 200
