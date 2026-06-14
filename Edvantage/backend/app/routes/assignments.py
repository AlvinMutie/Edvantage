from flask import Blueprint, jsonify, request
from app.models.assignment import Assignment
from app.models.student import Student
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.services.audit_service import log_audit

assignments_bp = Blueprint('assignments', __name__)

@assignments_bp.route('/student/<student_id>', methods=['GET'])
@jwt_required()
def get_student_assignments(student_id):
    """Get all assignments for a specific student"""
    student = Student.query.get_or_404(student_id)
    assignments = Assignment.query.filter_by(student_id=student_id).all()
    
    return jsonify({
        'assignments': [a.to_dict() for a in assignments],
        'total': len(assignments),
        'avg_score': sum([a.score for a in assignments if a.score]) / len([a for a in assignments if a.score]) if any(a.score for a in assignments) else 0
    }), 200

@assignments_bp.route('/', methods=['POST'])
@jwt_required()
def create_assignment():
    """Create a new assignment"""
    data = request.get_json()
    
    assignment = Assignment(
        student_id=data['student_id'],
        course_name=data['course_name'],
        title=data['title'],
        max_score=data.get('max_score', 100.0),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        status=data.get('status', 'pending')
    )
    
    db.session.add(assignment)
    db.session.commit()
    
    return jsonify(assignment.to_dict()), 201

@assignments_bp.route('/<id>', methods=['PUT'])
@jwt_required()
def update_assignment(id):
    """Update assignment (usually to add grade)"""
    assignment = Assignment.query.get_or_404(id)
    data = request.get_json()
    
    old_score = assignment.score
    if 'score' in data:
        assignment.score = data['score']
        assignment.status = 'graded'
    if 'submitted_date' in data:
        assignment.submitted_date = datetime.fromisoformat(data['submitted_date'])
        assignment.status = 'submitted'
    if 'status' in data:
        assignment.status = data['status']
    
    db.session.commit()
    
    current_user_id = get_jwt_identity()
    log_audit(
        action="Update Assignment",
        user_id=current_user_id,
        target_type="Assignment",
        target_id=id,
        details=f"Updated assignment {id}. Score: {old_score} -> {assignment.score}, Status: {assignment.status}"
    )
    
    return jsonify(assignment.to_dict()), 200

@assignments_bp.route('/<id>', methods=['DELETE'])
@jwt_required()
def delete_assignment(id):
    """Delete an assignment"""
    assignment = Assignment.query.get_or_404(id)
    db.session.delete(assignment)
    db.session.commit()
    return jsonify({"msg": "Assignment deleted"}), 200
