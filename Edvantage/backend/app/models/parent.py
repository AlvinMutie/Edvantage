from app import db

# Association table for Parent-Student
parent_student = db.Table('parent_student',
    db.Column('parent_id', db.Integer, db.ForeignKey('parents.id'), primary_key=True),
    db.Column('student_id', db.Integer, db.ForeignKey('students.id'), primary_key=True)
)

class Parent(db.Model):
    __tablename__ = 'parents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    
    user = db.relationship('User', backref=db.backref('parent_profile', uselist=False))
    students = db.relationship('Student', secondary=parent_student, backref=db.backref('parents', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'students': [{
                'id': s.id,
                'student_id': s.student_id,
                'full_name': s.full_name,
                'risk_status': s.risk_status,
                'gpa': s.gpa,
                'attendance': s.attendance
            } for s in self.students]
        }
