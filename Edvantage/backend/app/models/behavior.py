import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class BehavioralIncident(db.Model):
    __tablename__ = 'behavioral_incidents'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    incident_type = db.Column(db.String(50), nullable=False) # e.g., 'discipline', 'attendance_issue', 'commendation'
    severity = db.Column(db.Integer, default=1) # 1: Low, 5: Critical
    description = db.Column(db.Text)
    recorded_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    incident_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('behavioral_incidents', lazy=True))
    staff = db.relationship('User', backref=db.backref('recorded_incidents', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'incident_type': self.incident_type,
            'severity': self.severity,
            'description': self.description,
            'incident_date': self.incident_date.isoformat(),
            'recorded_by': self.staff.full_name if self.staff else 'System'
        }
