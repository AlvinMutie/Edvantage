from app import db

class Assignment(db.Model):
    __tablename__ = 'assignments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    course_name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    score = db.Column(db.Float, nullable=True)  # Actual score received
    max_score = db.Column(db.Float, default=100.0)  # Total possible points
    due_date = db.Column(db.DateTime, nullable=True)
    submitted_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, submitted, graded, late
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    student = db.relationship('Student', backref=db.backref('assignments', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_name': self.course_name,
            'title': self.title,
            'score': self.score,
            'max_score': self.max_score,
            'percentage': round((self.score / self.max_score) * 100, 1) if self.score else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'submitted_date': self.submitted_date.isoformat() if self.submitted_date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
