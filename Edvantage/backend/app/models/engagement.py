import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class StudentEngagement(db.Model):
    __tablename__ = 'student_engagement'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), unique=True, nullable=False)
    login_count = db.Column(db.Integer, default=0)
    last_login = db.Column(db.DateTime)
    resource_access_count = db.Column(db.Integer, default=0) # LMS usage
    participation_score = db.Column(db.Float, default=0.0) # From discussions/participation
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    
    student = db.relationship('Student', backref=db.backref('engagement_profile', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'login_count': self.login_count,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'resource_access_count': self.resource_access_count,
            'participation_score': self.participation_score,
            'last_activity': self.last_activity.isoformat()
        }
