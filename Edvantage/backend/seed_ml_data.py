import uuid
from app import create_app, db
from app.models.user import User, Role
from app.models.student import Student, Department, AcademicYear, Semester, Course, Subject
from app.models.performance import Grade, Attendance
from app.models.assignment import Assignment, Submission
from app.models.behavior import BehavioralIncident
from app.models.finance import StudentFinance
from app.models.engagement import StudentEngagement
from app.models.risk import Referral, Intervention, InterventionOutcome
from datetime import datetime, timedelta
import random

app = create_app()

def seed_ml_data():
    with app.app_context():
        print("Cleaning up old data...")
        # Clean up existing data to start fresh
        db.drop_all()
        db.create_all()
        
        # 1. Create Roles
        roles = ['superadmin', 'admin', 'teacher', 'supervisor', 'counselor', 'student', 'parent']
        role_map = {}
        for r_name in roles:
            role = Role(name=r_name, description=f"{r_name.capitalize()} role")
            db.session.add(role)
            role_map[r_name] = role
        db.session.commit()
        
        # 2. Create Staff Users
        staff_data = [
            ('Admin User', 'admin', 'admin@edvantage.com', 'admin'),
            ('Teacher User', 'teacher', 'teacher@edvantage.com', 'teacher'),
            ('Supervisor User', 'supervisor', 'supervisor@edvantage.com', 'supervisor'),
            ('Counselor User', 'counselor', 'counselor@edvantage.com', 'counselor')
        ]
        user_map = {}
        for name, uname, email, rname in staff_data:
            user = User(full_name=name, username=uname, email=email, role=rname, role_id=role_map[rname].id)
            user.set_password('password123')
            db.session.add(user)
            user_map[rname] = user
        db.session.commit()
        
        # 3. Academic Structure
        dept = Department(name='Computer Science')
        db.session.add(dept)
        db.session.flush()
        
        ay = AcademicYear(year_label='2024/2025', is_current=True)
        db.session.add(ay)
        db.session.flush()
        
        sem = Semester(name='Semester 1', academic_year_id=ay.id, is_active=True)
        db.session.add(sem)
        db.session.flush()
        
        course = Course(name='BSc Computer Science', department_id=dept.id)
        db.session.add(course)
        db.session.flush()
        
        subject = Subject(name='Introduction to AI', course_id=course.id)
        db.session.add(subject)
        db.session.flush()
        
        assignment = Assignment(subject_id=subject.id, title='AI Ethics Paper', due_date=datetime.utcnow() - timedelta(days=5))
        db.session.add(assignment)
        db.session.commit()
        
        # 4. Create Students (High Risk and Low Risk)
        student_configs = [
            {
                'name': 'High Risk Student',
                'username': 'highrisk',
                'email': 'highrisk@student.com',
                'gpa': 1.5,
                'attendance': 62.0,
                'behavioral_incidents': 3,
                'fee_balance': 4500.0,
                'engagement': 'low',
                'submissions': 'missing'
            },
            {
                'name': 'Low Risk Student',
                'username': 'lowrisk',
                'email': 'lowrisk@student.com',
                'gpa': 3.9,
                'attendance': 98.0,
                'behavioral_incidents': 0,
                'fee_balance': 0.0,
                'engagement': 'high',
                'submissions': 'on_time'
            },
            {
                'name': 'Medium Risk Student',
                'username': 'medrisk',
                'email': 'medrisk@student.com',
                'gpa': 2.4,
                'attendance': 78.0,
                'behavioral_incidents': 1,
                'fee_balance': 1200.0,
                'engagement': 'medium',
                'submissions': 'late'
            }
        ]
        
        for config in student_configs:
            user = User(
                full_name=config['name'],
                username=config['username'],
                email=config['email'],
                role='student',
                role_id=role_map['student'].id
            )
            user.set_password('password123')
            db.session.add(user)
            db.session.flush()
            
            student = Student(
                user_id=user.id,
                admission_number=f"ADM-{random.randint(10000, 99999)}",
                full_name=user.full_name,
                department_id=dept.id,
                gpa=config['gpa'],
                attendance=config['attendance'],
                risk_status='Low' # Initial
            )
            db.session.add(student)
            db.session.flush()
            
            # Finance
            finance = StudentFinance(
                student_id=student.id,
                total_fees=5000.0,
                paid_fees=5000.0 - config['fee_balance'],
                balance=config['fee_balance'],
                status='cleared' if config['fee_balance'] == 0 else 'partial'
            )
            db.session.add(finance)
            
            # Engagement
            login_count = 5 if config['engagement'] == 'low' else 50 if config['engagement'] == 'high' else 20
            engagement = StudentEngagement(
                student_id=student.id,
                login_count=login_count,
                last_login=datetime.utcnow() - timedelta(days=1),
                resource_access_count=login_count * 2,
                participation_score=10.0 if config['engagement'] == 'high' else 2.0
            )
            db.session.add(engagement)
            
            # Behavioral
            for i in range(config['behavioral_incidents']):
                incident = BehavioralIncident(
                    student_id=student.id,
                    incident_type='discipline',
                    severity=3,
                    description=f"Issue {i+1} description",
                    recorded_by=user_map['teacher'].id
                )
                db.session.add(incident)
            
            # Submissions
            sub_status = config['submissions']
            score = 85.0 if config['name'] == 'Low Risk Student' else 40.0
            submission = Submission(
                assignment_id=assignment.id,
                student_id=student.id,
                score=score if sub_status != 'missing' else 0,
                status=sub_status,
                submitted_at=datetime.utcnow() - timedelta(days=6) if sub_status == 'on_time' else None
            )
            db.session.add(submission)
            
            # Counseling Referral for High Risk
            if config['name'] == 'High Risk Student':
                referral = Referral(
                    student_id=student.id,
                    counselor_id=user_map['counselor'].id,
                    reason="Consistently poor performance and behavioral issues",
                    status='pending'
                )
                db.session.add(referral)
                
                intervention = Intervention(
                    student_id=student.id,
                    supervisor_id=user_map['supervisor'].id,
                    type='mentorship',
                    status='closed',
                    notes="Mentorship session conducted"
                )
                db.session.add(intervention)
                db.session.flush()
                
                outcome = InterventionOutcome(
                    intervention_id=intervention.id,
                    outcome_notes="Student showed minimal improvement",
                    success_rating=2,
                    follow_up_date=datetime.utcnow() + timedelta(days=7)
                )
                db.session.add(outcome)

        db.session.commit()
        print("ML Data Seeding completed successfully!")

if __name__ == "__main__":
    seed_ml_data()
