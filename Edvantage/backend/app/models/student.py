import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Department(db.Model):
    __tablename__ = 'departments'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(100), nullable=False)
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    course_id = db.Column(db.String(36), db.ForeignKey('courses.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    credit_units = db.Column(db.Integer, default=3)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AcademicYear(db.Model):
    __tablename__ = 'academic_years'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    year_label = db.Column(db.String(50), nullable=False) # e.g., '2024/2025'
    is_current = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Semester(db.Model):
    __tablename__ = 'semesters'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(50), nullable=False) # e.g., 'Semester 1'
    academic_year_id = db.Column(db.String(36), db.ForeignKey('academic_years.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    
    academic_year = db.relationship('AcademicYear', backref=db.backref('semesters', lazy=True))

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    admission_number = db.Column(db.String(20), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String(10))
    department_id = db.Column(db.String(36), db.ForeignKey('departments.id'))
    class_id = db.Column(db.String(50)) # e.g., 'Class A'
    current_semester = db.Column(db.Integer, default=1)
    gpa = db.Column(db.Float, default=0.0)
    attendance = db.Column(db.Float, default=100.0)
    risk_status = db.Column(db.String(20), default='Low') # Low, Medium, High, Critical
    status = db.Column(db.String(20), default='active') # active, graduated, suspended
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False)
    
    # Relationships
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('student_profile', uselist=False))
    department = db.relationship('Department', backref=db.backref('students', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'admission_number': self.admission_number,
            'full_name': self.full_name,
            'current_semester': self.current_semester,
            'gpa': self.gpa,
            'attendance': self.attendance,
            'risk_status': self.risk_status,
            'status': self.status,
            'department': self.department.name if self.department else None,
            'user': self.user.to_dict() if self.user else None
        }
