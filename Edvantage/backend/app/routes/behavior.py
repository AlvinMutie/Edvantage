from flask import Blueprint, request, jsonify
from app.models.behavior import BehavioralIncident
from app.models.student import Student
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.audit_service import log_audit

behavior_bp = Blueprint('behavior', __name__)

@behavior_bp.route('/incident', methods=['POST'])
@jwt_required()
def record_incident():
    data = request.get_json()
    current_user_id = get_jwt_identity()
    
    student_id = data.get('student_id')
    incident_type = data.get('incident_type')
    severity = data.get('severity', 1)
    description = data.get('description')
    
    if not student_id or not incident_type:
        return jsonify({"msg": "student_id and incident_type are required"}), 400
        
    incident = BehavioralIncident(
        student_id=student_id,
        incident_type=incident_type,
        severity=severity,
        description=description,
        recorded_by=current_user_id
    )
    
    db.session.add(incident)
    db.session.commit()
    
    log_audit("Record Behavioral Incident", user_id=current_user_id, target_type="Student", target_id=student_id, details=f"Recorded {incident_type} incident with severity {severity}")
    
    return jsonify(incident.to_dict()), 201

@behavior_bp.route('/student/<student_id>', methods=['GET'])
@jwt_required()
def get_student_incidents(student_id):
    incidents = BehavioralIncident.query.filter_by(student_id=student_id).order_by(BehavioralIncident.incident_date.desc()).all()
    return jsonify([i.to_dict() for i in incidents]), 200
