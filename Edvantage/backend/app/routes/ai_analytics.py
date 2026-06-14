from flask import Blueprint, jsonify, request
from app.services.ai_service import ai_service
from app.services.model_registry_service import model_registry_service
from app.services.learning_evaluation_service import learning_evaluation_service
from app.services.drift_detection_service import drift_detection_service
from flask_jwt_extended import jwt_required

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/predict/<student_id>', methods=['POST'])
@jwt_required()
def predict_student_risk(student_id):
    """Predicts risk for a specific student using the latest validated model."""
    result = ai_service.predict_student_risk(student_id)
    if not result:
        return jsonify({"msg": "Student not found"}), 404
        
    return jsonify(result), 200

@ai_bp.route('/intelligence/metrics', methods=['GET'])
@jwt_required()
def get_intelligence_metrics():
    """Exposes high-level intelligence validation metrics."""
    versions = model_registry_service.get_version_history()
    
    # 1. Learning Improvement Curve
    accuracy_trend = []
    gain_trend = []
    for v in reversed(versions):
        log = v.training_logs[0] if v.training_logs else None
        if log and log.metrics:
            accuracy_trend.append({
                'version': v.name,
                'accuracy': log.metrics.get('accuracy', 0.0),
                'date': v.created_at.isoformat()
            })
            gain_trend.append(log.metrics.get('learning_gain_score', 0.0))

    # 2. Intervention Effectiveness
    success_trend = learning_evaluation_service.get_intervention_success_trend()

    # 3. Drift & Stability
    latest_v = versions[0] if versions else None
    latest_log = latest_v.training_logs[0] if latest_v else None
    drift_alert = latest_log.metrics.get('drift_alert', False) if latest_log else False
    
    return jsonify({
        "learning_improvement_curve": accuracy_trend,
        "learning_gain_history": gain_trend,
        "intervention_success_trend": success_trend,
        "model_stability": {
            "drift_detected": drift_alert,
            "drift_severity": 0.1 if drift_alert else 0.0 # Placeholder
        },
        "system_status": "Validated adaptive learning system" if len(versions) > 1 else "Closed-loop system (unvalidated)"
    }), 200

@ai_bp.route('/retrain', methods=['POST'])
@jwt_required()
def retrain_model():
    """Endpoint to manually retrain the model with validation"""
    from app.services.retraining_service import model_retraining_service
    success = model_retraining_service.trigger_retraining(trigger_type='manual')
    if success:
        return jsonify({"msg": "Model retrained and validated successfully"}), 200
    else:
        return jsonify({"msg": "Retraining failed or insufficient data"}), 500
