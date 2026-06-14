import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Teacher(db.Model):
    __tablename__ = 'teachers'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('teacher_profile', uselist=False))
    department = db.relationship('Department', backref=db.backref('teachers', lazy=True))

class Supervisor(db.Model):
    __tablename__ = 'supervisors'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('supervisor_profile', uselist=False))

class Counselor(db.Model):
    __tablename__ = 'counselors'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('counselor_profile', uselist=False))

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    semester_id = db.Column(db.String(36), db.ForeignKey('semesters.id'), nullable=False)
    status = db.Column(db.String(20), default='enrolled') # enrolled, completed, dropped
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Grade(db.Model):
    __tablename__ = 'grades'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    assessment_type = db.Column(db.String(50), nullable=False) # CAT1, CAT2, Exam, Assignment
    score = db.Column(db.Float, nullable=False)
    max_score = db.Column(db.Float, default=100.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    student_id = db.Column(db.String(36), db.ForeignKey('students.id'), nullable=False)
    subject_id = db.Column(db.String(36), db.ForeignKey('subjects.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String(20), nullable=False) # present, absent, late, excused
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
