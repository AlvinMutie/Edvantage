from flask import Blueprint, jsonify
from app.models.badge import StudentBadge
from app.models.student import Student
from flask_jwt_extended import jwt_required, get_jwt_identity

gamification_bp = Blueprint('gamification', __name__)

@gamification_bp.route('/my-badges', methods=['GET'])
@jwt_required()
def get_my_badges():
    current_user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=current_user_id).first()
    if not student:
        return jsonify({"msg": "Student profile not found"}), 404
    
    badges = StudentBadge.query.filter_by(student_id=student.id).all()
    return jsonify([b.to_dict() for b in badges]), 200

@gamification_bp.route('/student/<student_id>/badges', methods=['GET'])
@jwt_required()
def get_student_badges(student_id):
    badges = StudentBadge.query.filter_by(student_id=student_id).all()
    return jsonify([b.to_dict() for b in badges]), 200
