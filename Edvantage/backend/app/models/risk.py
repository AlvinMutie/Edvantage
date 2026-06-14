import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class ModelVersion(db.Model):
    __tablename__ = 'model_versions'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    accuracy = db.Column(db.Float)
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ModelTrainingLog(db.Model):
    __tablename__ = 'model_training_logs'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    model_version_id = db.Column(db.String(36), db.ForeignKey('model_versions.id'), nullable=False)
    dataset_info = db.Column(db.Text)
    metrics = db.Column(db.JSON)
    trained_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    version = db.relationship('ModelVersion', backref=db.backref('training_logs', lazy=True))

class FeatureImportance(db.Model):
    __tablename__ = 'feature_importance'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    model_version_id = db.Column(db.String(36), db.ForeignKey('model_versions.id'), nullable=False)
    feature_name = db.Column(db.String(100), nullable=False)
    importance_score = db.Column(db.Float, nullable=False)
    
    version = db.relationship('ModelVersion', backref=db.backref('features', lazy=True))

class RiskPrediction(db.Model):
    __tablename__ = 'risk_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    risk_level = db.Column(db.String(20), nullable=False) # Low, Medium, High, Critical
    probability_score = db.Column(db.Float, nullable=False)
    model_version_id = db.Column(db.String(36), db.ForeignKey('model_versions.id'))
    reasons = db.Column(db.JSON) # JSON reasons for prediction
    trace_id = db.Column(db.String(36), nullable=True, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('risk_predictions', lazy=True))
    model_version = db.relationship('ModelVersion', backref=db.backref('predictions', lazy=True))

class Intervention(db.Model):
    __tablename__ = 'interventions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    supervisor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    recommendation_id = db.Column(db.String(36), db.ForeignKey('intervention_recommendations.id'), nullable=True)
    assigned_to_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True)
    type = db.Column(db.String(100), nullable=False) # mentorship, counseling, tutoring, warning
    status = db.Column(db.String(20), default='open') # open, closed
    notes = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('interventions', lazy=True))
    supervisor = db.relationship('User', foreign_keys=[supervisor_id], backref=db.backref('supervised_interventions', lazy=True))
    assigned_to = db.relationship('User', foreign_keys=[assigned_to_id], backref=db.backref('assigned_interventions', lazy=True))
    recommendation = db.relationship('InterventionRecommendation', backref=db.backref('linked_intervention', uselist=False))

class InterventionOutcome(db.Model):
    __tablename__ = 'intervention_outcomes'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    intervention_id = db.Column(db.String(36), db.ForeignKey('interventions.id'), nullable=False)
    outcome_notes = db.Column(db.Text)
    success_rating = db.Column(db.Integer) # 1-5
    
    # Before vs After Snapshots
    risk_level_before = db.Column(db.String(20))
    risk_level_after = db.Column(db.String(20))
    gpa_before = db.Column(db.Float)
    gpa_after = db.Column(db.Float)
    attendance_before = db.Column(db.Float)
    attendance_after = db.Column(db.Float)
    engagement_before = db.Column(db.Float)
    engagement_after = db.Column(db.Float)
    
    effectiveness_score = db.Column(db.Float)
    completed_by_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    follow_up_date = db.Column(db.DateTime)
    completion_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    intervention = db.relationship('Intervention', backref=db.backref('outcome', uselist=False))
    completed_by = db.relationship('User', backref=db.backref('completed_intervention_outcomes', lazy=True))

class InterventionTemplate(db.Model):
    __tablename__ = 'intervention_templates'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    intervention_type = db.Column(db.String(50), nullable=False) # mentorship, counseling, tutoring, warning, financial
    priority = db.Column(db.String(20), default='Medium') # Low, Medium, High, Critical
    suggested_duration_days = db.Column(db.Integer, default=30)
    responsible_role = db.Column(db.String(50)) # supervisor, counselor, teacher, finance
    is_active = db.Column(db.Boolean, default=True)
    version = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class InterventionRecommendation(db.Model):
    __tablename__ = 'intervention_recommendations'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    risk_prediction_id = db.Column(db.String(36), db.ForeignKey('risk_predictions.id'), nullable=False)
    template_id = db.Column(db.String(36), db.ForeignKey('intervention_templates.id'))
    status = db.Column(db.String(20), default='pending') # pending, approved, modified, rejected
    supervisor_id = db.Column(db.String(36), db.ForeignKey('users.id')) # supervisor who reviewed it
    supervisor_notes = db.Column(db.Text)
    confidence_score = db.Column(db.Float)
    urgency_score = db.Column(db.Float)
    predicted_effectiveness = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('recommendations', lazy=True))
    prediction = db.relationship('RiskPrediction', backref=db.backref('recommendations', lazy=True))
    template = db.relationship('InterventionTemplate', backref=db.backref('recommendations', lazy=True))
    supervisor = db.relationship('User', backref=db.backref('reviewed_recommendations', lazy=True))

class RecommendationEvidence(db.Model):
    __tablename__ = 'recommendation_evidence'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    recommendation_id = db.Column(db.String(36), db.ForeignKey('intervention_recommendations.id'), nullable=False)
    metric_name = db.Column(db.String(100), nullable=False) # attendance, gpa, incidents, finance, engagement
    current_value = db.Column(db.Float)
    threshold_value = db.Column(db.Float)
    trend = db.Column(db.String(50)) # declining, stable, improving
    details = db.Column(db.JSON)
    
    recommendation = db.relationship('InterventionRecommendation', backref=db.backref('evidence', lazy=True))

class Referral(db.Model):
    __tablename__ = 'referrals'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    counselor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    reason = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, accepted, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CounselingSession(db.Model):
    __tablename__ = 'counseling_sessions'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    counselor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    session_notes = db.Column(db.Text)
    session_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class RiskRule(db.Model):
    __tablename__ = 'risk_rules'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    condition_type = db.Column(db.String(50), nullable=False) # 'attendance_low', 'gpa_low'
    threshold = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False) # Low, Medium, High
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class InterventionEffectiveness(db.Model):
    __tablename__ = 'intervention_effectiveness'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    intervention_type = db.Column(db.String(50), nullable=False, unique=True)
    avg_effectiveness_score = db.Column(db.Float, default=0.0)
    success_count = db.Column(db.Integer, default=0)
    total_count = db.Column(db.Integer, default=0)
    risk_reduction_avg = db.Column(db.Float, default=0.0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
