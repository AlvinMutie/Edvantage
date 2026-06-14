import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class StudentFinance(db.Model):
    __tablename__ = 'student_finance'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), unique=True, nullable=False)
    total_fees = db.Column(db.Float, default=0.0)
    paid_fees = db.Column(db.Float, default=0.0)
    balance = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='cleared') # 'cleared', 'partial', 'pending'
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = db.relationship('Student', backref=db.backref('finance_profile', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'total_fees': self.total_fees,
            'paid_fees': self.paid_fees,
            'balance': self.balance,
            'status': self.status,
            'updated_at': self.updated_at.isoformat()
        }
