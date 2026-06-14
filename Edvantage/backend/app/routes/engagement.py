from flask import Blueprint, request, jsonify
from app.models.engagement import StudentEngagement
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

engagement_bp = Blueprint('engagement', __name__)

@engagement_bp.route('/track', methods=['POST'])
@jwt_required()
def track_activity():
    """Track student LMS activity (resource access, participation)"""
    data = request.get_json()
    student_id = data.get('student_id')
    activity_type = data.get('activity_type') # 'resource_access', 'participation'
    
    if not student_id or not activity_type:
        return jsonify({"msg": "student_id and activity_type are required"}), 400
        
    engagement = StudentEngagement.query.filter_by(student_id=student_id).first()
    if not engagement:
        engagement = StudentEngagement(student_id=student_id)
        db.session.add(engagement)
        
    if activity_type == 'resource_access':
        engagement.resource_access_count += 1
    elif activity_type == 'participation':
        engagement.participation_score += 1.0 # Simple increment for now
        
    engagement.last_activity = datetime.utcnow()
    db.session.commit()
    
    return jsonify(engagement.to_dict()), 200

@engagement_bp.route('/student/<student_id>', methods=['GET'])
@jwt_required()
def get_student_engagement(student_id):
    engagement = StudentEngagement.query.filter_by(student_id=student_id).first()
    if not engagement:
        return jsonify({"msg": "Engagement record not found"}), 404
    return jsonify(engagement.to_dict()), 200
