from flask import Blueprint, jsonify, request
from app.models.student import Student
from app.models.user import User
from app.models.risk import InterventionRecommendation, InterventionTemplate
from app.services.ai_service import ai_service
from app.services.intervention_service import intervention_service
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

interventions_bp = Blueprint('interventions_auto', __name__)

@interventions_bp.route('/check-risks', methods=['POST'])
@jwt_required()
def check_risk_levels():
    """Manually trigger risk check for all students"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin', 'supervisor']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    students = Student.query.all()
    count = 0
    for student in students:
        ai_service.predict_student_risk(student.id)
        count += 1
    
    return jsonify({
        "msg": f"Risk check completed for {count} students",
        "recommendations_generated": "Check /recommendations for pending actions"
    }), 200

@interventions_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """List all pending intervention recommendations for supervisors"""
    recs = intervention_service.get_pending_recommendations()
    return jsonify([{
        "id": r.id,
        "student_id": r.student_id,
        "student_name": r.student.user.full_name,
        "risk_level": r.prediction.risk_level if r.prediction else "Unknown",
        "template_id": r.template_id,
        "template_name": r.template.name if r.template else "Custom",
        "intervention_type": r.template.intervention_type if r.template else "General",
        "confidence_score": r.confidence_score,
        "urgency_score": r.urgency_score,
        "predicted_effectiveness": r.predicted_effectiveness,
        "evidence": [{
            "metric": e.metric_name,
            "value": e.current_value,
            "threshold": e.threshold_value,
            "trend": e.trend
        } for e in r.evidence],
        "created_at": r.created_at.isoformat()
    } for r in recs]), 200

@interventions_bp.route('/recommendations/<recommendation_id>/approve', methods=['POST'])
@jwt_required()
def approve_recommendation(recommendation_id):
    """Approve a recommendation and create an intervention"""
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    intervention = intervention_service.approve_recommendation(
        recommendation_id, 
        current_user_id, 
        modifications=data
    )
    
    if not intervention:
        return jsonify({"msg": "Recommendation not found, unauthorized, or already processed"}), 404
        
    return jsonify({
        "msg": "Intervention approved and created",
        "intervention_id": intervention.id
    }), 200

@interventions_bp.route('/recommendations/<recommendation_id>/reject', methods=['POST'])
@jwt_required()
def reject_recommendation(recommendation_id):
    """Reject a recommendation with notes"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'notes' not in data:
        return jsonify({"msg": "Rejection notes are required"}), 400
        
    rec = intervention_service.reject_recommendation(
        recommendation_id, 
        current_user_id, 
        data['notes']
    )
    
    if not rec:
        return jsonify({"msg": "Recommendation not found or already processed"}), 404
        
    return jsonify({"msg": "Recommendation rejected"}), 200

@interventions_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_templates():
    """List active intervention templates"""
    templates = InterventionTemplate.query.filter_by(is_active=True).all()
    return jsonify([{
        "id": t.id,
        "name": t.name,
        "description": t.description,
        "intervention_type": t.intervention_type,
        "priority": t.priority,
        "responsible_role": t.responsible_role,
        "suggested_duration": t.suggested_duration_days
    } for t in templates]), 200

@interventions_bp.route('/outcomes', methods=['POST'])
@jwt_required()
def record_outcome():
    """Record the outcome of an intervention and calculate effectiveness"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'intervention_id' not in data:
        return jsonify({"msg": "intervention_id is required"}), 400
        
    outcome = analytics_service.record_outcome(
        data['intervention_id'],
        data,
        current_user_id
    )
    
    if not outcome:
        return jsonify({"msg": "Intervention not found"}), 404
        
    return jsonify({
        "msg": "Outcome recorded successfully",
        "effectiveness_score": outcome.effectiveness_score
    }), 200

@interventions_bp.route('/analytics/effectiveness', methods=['GET'])
@jwt_required()
def get_effectiveness_analytics():
    """Get institution-wide intervention effectiveness statistics"""
    stats = analytics_service.get_summary_stats()
    return jsonify(stats), 200

@interventions_bp.route('/assigned', methods=['GET'])
@jwt_required()
def get_assigned_interventions():
    """Get interventions assigned to the current user"""
    current_user_id = get_jwt_identity()
    interventions = Intervention.query.filter_by(assigned_to_id=current_user_id).all()
    return jsonify([{
        "id": i.id,
        "student_name": i.student.user.full_name,
        "student_id": i.student.admission_number,
        "type": i.type,
        "status": i.status,
        "notes": i.notes,
        "due_date": i.due_date.isoformat() if i.due_date else None,
        "created_at": i.created_at.isoformat(),
        "risk_status": i.student.risk_status
    } for i in interventions]), 200
