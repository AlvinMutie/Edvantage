from flask import Blueprint, request, jsonify
from app.services.evaluation_engine import EvaluationEngine
from app.models.risk import RiskRule, Intervention
from app.schemas import RiskRuleSchema, InterventionSchema
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

evaluation_bp = Blueprint('evaluation', __name__)
risk_rule_schema = RiskRuleSchema()
risk_rules_schema = RiskRuleSchema(many=True)
intervention_schema = InterventionSchema()
interventions_schema = InterventionSchema(many=True)

@evaluation_bp.route('/rules', methods=['GET', 'POST'])
@jwt_required()
def manage_rules():
    if request.method == 'POST':
        data = request.get_json()
        rule = RiskRule(
            name=data['name'],
            condition_type=data['condition_type'],
            threshold=data['threshold'],
            risk_level=data['risk_level']
        )
        db.session.add(rule)
        db.session.commit()
        return jsonify(risk_rule_schema.dump(rule)), 201
    
    rules = RiskRule.query.all()
    return jsonify(risk_rules_schema.dump(rules)), 200

@evaluation_bp.route('/evaluate/<int:student_id>', methods=['POST'])
@jwt_required()
def evaluate_student(student_id):
    results = EvaluationEngine.evaluate_student(student_id)
    if not results:
        return jsonify({"msg": "Student not found"}), 404
    return jsonify(results), 200

@evaluation_bp.route('/interventions', methods=['GET', 'POST'])
@jwt_required()
def manage_interventions():
    if request.method == 'POST':
        data = request.get_json()
        supervisor_id = get_jwt_identity()
        intervention = Intervention(
            student_id=data['student_id'],
            supervisor_id=supervisor_id,
            type=data['type'],
            description=data.get('description'),
            status='Pending'
        )
        db.session.add(intervention)
        db.session.commit()
        return jsonify(intervention_schema.dump(intervention)), 201
    
    interventions = Intervention.query.all()
    return jsonify(interventions_schema.dump(interventions)), 200
