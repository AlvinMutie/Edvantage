from app import db

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100))
    current_semester = db.Column(db.Integer)
    gpa = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=100.0)  # Percentage
    risk_status = db.Column(db.String(20), default='Safe')  # Safe, At Risk
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Relationship to Supervisor (User)
    supervisor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    supervisor = db.relationship('User', foreign_keys=[supervisor_id], backref=db.backref('assigned_students', lazy=True))

    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('student_profile', uselist=False))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'full_name': self.full_name,
            'department': self.department,
            'current_semester': self.current_semester,
            'gpa': self.gpa,
            'attendance': self.attendance,
            'risk_status': self.risk_status,
            'user': self.user.to_dict() if self.user else None,
            'supervisor': self.supervisor.to_dict() if self.supervisor else None
        }
