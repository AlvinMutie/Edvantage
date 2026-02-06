from flask import Blueprint, jsonify, request
from app.services.ai_service import ai_service
from flask_jwt_extended import jwt_required

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict_student_risk():
    data = request.get_json()
    
    gpa = data.get('gpa')
    attendance = data.get('attendance')
    missed_deadlines = data.get('missed_deadlines', 0)

    if gpa is None or attendance is None:
        return jsonify({"msg": "GPA and Attendance are required fields"}), 400

    risk_score = ai_service.predict_risk(float(gpa), float(attendance), int(missed_deadlines))
    
    risk_level = "Low"
    if risk_score > 75:
        risk_level = "High"
    elif risk_score > 40:
        risk_level = "Medium"

    return jsonify({
        "risk_score": risk_score,
        "risk_level": risk_level,
        "factors": {
            "gpa": gpa,
            "attendance": attendance,
            "missed_deadlines": missed_deadlines
        },
        "model_type": "RandomForestClassifier v1.0 (Trained on Real Data)"
    }), 200

@ai_bp.route('/retrain', methods=['POST'])
@jwt_required()
def retrain_model():
    """Endpoint to manually retrain the model with latest student data"""
    try:
        # Force delete old model to trigger retraining
        import os
        if os.path.exists('student_risk_model.pkl'):
            os.remove('student_risk_model.pkl')
        
        ai_service._initialize_model()
        return jsonify({"msg": "Model retrained successfully on latest student data"}), 200
    except Exception as e:
        return jsonify({"msg": f"Retraining failed: {str(e)}"}), 500
