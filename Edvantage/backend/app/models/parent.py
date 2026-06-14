import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

# Association table for Parent-Student
parent_student = db.Table('parent_student',
    db.Column('parent_id', db.String(36), db.ForeignKey('parents.id'), primary_key=True),
    db.Column('student_id', db.String(36), db.ForeignKey('students.id'), primary_key=True)
)

class Parent(db.Model):
    __tablename__ = 'parents'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    last_active = db.Column(db.DateTime)
    login_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('parent_profile', uselist=False))
    students = db.relationship('Student', secondary=parent_student, backref=db.backref('parents', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'phone': self.phone,
            'students': [{
                'id': s.id,
                'admission_number': s.admission_number,
                'full_name': s.full_name,
                'risk_status': s.risk_status,
                'gpa': s.gpa,
                'attendance': s.attendance
            } for s in self.students]
        }
