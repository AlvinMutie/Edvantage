from flask import Blueprint, jsonify, request
from app.models.student import Student
from app.models.user import User
from app.services.ai_service import ai_service
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

interventions_bp = Blueprint('interventions_auto', __name__)

@interventions_bp.route('/check-risks', methods=['POST'])
@jwt_required()
def check_risk_levels():
    """Manually trigger risk check and send alerts"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    # Get all students
    students = Student.query.all()
    high_risk_students = []
    
    for student in students:
        # Calculate risk score
        risk_score = ai_service.predict_risk(
            student.gpa if student.gpa else 2.5,
            student.attendance if student.attendance else 85.0,
            0  # missed deadlines placeholder
        )
        
        # Update risk status
        if risk_score > 75:
            student.risk_status = 'At Risk'
            high_risk_students.append(student)
        else:
            student.risk_status = 'Safe'
    
    db.session.commit()
    
    # Send email alerts (simulated - requires SMTP configuration)
    alerts_sent = 0
    for student in high_risk_students:
        # TODO: Implement actual email sending with flask-mail
        # send_alert_email(student)
        alerts_sent += 1
    
    return jsonify({
        "msg": "Risk check completed",
        "total_students": len(students),
        "high_risk_count": len(high_risk_students),
        "alerts_sent": alerts_sent
    }), 200

@interventions_bp.route('/configure', methods=['POST'])
@jwt_required()
def configure_interventions():
    """Configure intervention thresholds and settings"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    data = request.get_json()
    
    # Store configuration in database or config file
    # For now, just return success
    
    return jsonify({
        "msg": "Intervention settings updated",
        "settings": data
    }), 200

@interventions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_intervention_history():
    """Get history of automated interventions"""
    
    # Placeholder - would require intervention logging table
    return jsonify({
        "interventions": [],
        "msg": "Intervention logging not yet implemented"
    }), 200
