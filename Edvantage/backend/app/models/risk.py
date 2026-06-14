import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class RiskPrediction(db.Model):
    __tablename__ = 'risk_predictions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    risk_level = db.Column(db.String(20), nullable=False) # Low, Medium, High, Critical
    probability_score = db.Column(db.Float, nullable=False)
    model_version = db.Column(db.String(50))
    reasons = db.Column(db.JSON) # JSON reasons for prediction
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('risk_predictions', lazy=True))

class Intervention(db.Model):
    __tablename__ = 'interventions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    supervisor_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(100), nullable=False) # mentorship, counseling, tutoring, warning
    status = db.Column(db.String(20), default='open') # open, closed
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('interventions', lazy=True))
    supervisor = db.relationship('User', backref=db.backref('supervised_interventions', lazy=True))

class InterventionOutcome(db.Model):
    __tablename__ = 'intervention_outcomes'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    intervention_id = db.Column(db.String(36), db.ForeignKey('interventions.id'), nullable=False)
    outcome_notes = db.Column(db.Text)
    success_rating = db.Column(db.Integer) # 1-5
    follow_up_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

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
