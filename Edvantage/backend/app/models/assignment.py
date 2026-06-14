import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Assignment(db.Model):
    __tablename__ = 'assignments'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    due_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    subject = db.relationship('Subject', backref=db.backref('assignments', lazy=True))

class Submission(db.Model):
    __tablename__ = 'submissions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    assignment_id = db.Column(db.String(36), db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    score = db.Column(db.Float)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='on_time')  # on_time, late, missing
    
    assignment = db.relationship('Assignment', backref=db.backref('submissions', lazy=True))
    student = db.relationship('Student', backref=db.backref('submissions', lazy=True))
