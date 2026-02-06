from app import db

class RiskRule(db.Model):
    __tablename__ = 'risk_rules'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    condition_type = db.Column(db.String(50), nullable=False) # 'attendance_low', 'gpa_low'
    threshold = db.Column(db.Float, nullable=False)
    risk_level = db.Column(db.String(20), nullable=False) # 'Low', 'Medium', 'High'
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class Intervention(db.Model):
    __tablename__ = 'interventions'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    supervisor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='Pending') # 'Pending', 'In Progress', 'Completed'
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    student = db.relationship('Student', backref=db.backref('interventions', lazy=True))
    supervisor = db.relationship('User', backref=db.backref('supervised_interventions', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'supervisor_id': self.supervisor_id,
            'type': self.type,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
