from app import create_app, db
from app.models.user import User
from app.models.student import Student
from app.models.performance import PerformanceRecord
from app.models.risk import RiskRule

app = create_app()

def seed_data():
    with app.app_context():
        # Create database tables
        db.drop_all()
        db.create_all()
        
        # Check if users already exist
        if User.query.filter_by(username='admin').first():
            print("Database already seeded.")
            return

        # Create Admin
        admin = User(username='admin', email='admin@spmis.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)

        # Create Superadmin
        superadmin = User(username='superadmin', email='superadmin@spmis.com', role='superadmin')
        superadmin.set_password('superadmin123')
        db.session.add(superadmin)

        # Create Supervisor
        supervisor = User(username='supervisor', email='supervisor@spmis.com', role='supervisor')
        supervisor.set_password('password123')
        db.session.add(supervisor)

        # Create Student User
        student_user = User(username='student', email='student@spmis.com', role='student')
        student_user.set_password('password123')
        db.session.add(student_user)
        
        db.session.flush()

        # Create Student Profile
        student = Student(
            user_id=student_user.id,
            student_id='ST1001',
            full_name='Alice Johnson',
            department='Computer Science',
            current_semester=1,
            supervisor_id=supervisor.id  # Assign to the test supervisor
        )
        db.session.add(student)
        
        # Add Rules
        rules = [
            RiskRule(name='Low Attendance', condition_type='attendance_low', threshold=75.0, risk_level='High'),
            RiskRule(name='Low GPA', condition_type='gpa_low', threshold=2.5, risk_level='Medium')
        ]
        db.session.add_all(rules)

        db.session.commit()
        print("Database seeded successfully!")
        print("Admin: admin / admin123")
        print("Supervisor: supervisor / password123")

if __name__ == '__main__':
    seed_data()
