import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Badge(db.Model):
    __tablename__ = 'badges'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class StudentBadge(db.Model):
    __tablename__ = 'student_badges'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    badge_id = db.Column(db.String(36), db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    student = db.relationship('Student', backref=db.backref('badges', lazy=True))
    badge = db.relationship('Badge', backref=db.backref('awarded_to', lazy=True))

class Achievement(db.Model):
    __tablename__ = 'achievements'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Leaderboard(db.Model):
    __tablename__ = 'leaderboards'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    score = db.Column(db.Float, default=0.0)
    rank = db.Column(db.Integer)
    period = db.Column(db.String(50)) # e.g., 'Term 1 2024'
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
