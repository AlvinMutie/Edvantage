from app import db

class PerformanceRecord(db.Model):
    __tablename__ = 'performance_records'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    record_type = db.Column(db.String(50), nullable=False) # e.g., 'attendance', 'grade'
    value = db.Column(db.Float, nullable=False)
    date_recorded = db.Column(db.DateTime, server_default=db.func.now())
    semester = db.Column(db.Integer)

    student = db.relationship('Student', backref=db.backref('performance_records', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'record_type': self.record_type,
            'value': self.value,
            'date_recorded': self.date_recorded.isoformat(),
            'semester': self.semester
        }
