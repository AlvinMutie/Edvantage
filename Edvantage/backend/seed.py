from app import create_app, db
from app.models.user import User, Role
from app.models.student import Student
from app.models.risk import RiskRule

app = create_app()

def seed_data():
    with app.app_context():
        # Create database tables (don't drop all if we want to keep some data, but for full reset:)
        # db.drop_all()
        db.create_all()
        
        # 1. Create Roles if they don't exist
        roles = ['superadmin', 'admin', 'teacher', 'supervisor', 'counselor', 'student', 'parent']
        role_objects = {}
        for role_name in roles:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                role = Role(name=role_name, description=f"{role_name.capitalize()} role")
                db.session.add(role)
            role_objects[role_name] = role
        db.session.flush()

        # 2. Create Superadmin
        superadmin = User.query.filter_by(username='superadmin').first()
        if not superadmin:
            superadmin = User(
                full_name='System Superadmin',
                username='superadmin', 
                email='superadmin@edvantage.com', 
                role='superadmin',
                role_id=role_objects['superadmin'].id
            )
            superadmin.set_password('superadmin123')
            db.session.add(superadmin)

        # 3. Create Admin
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                full_name='Admin User',
                username='admin', 
                email='admin@edvantage.com', 
                role='admin',
                role_id=role_objects['admin'].id
            )
            admin.set_password('admin123')
            db.session.add(admin)

        # 4. Create Supervisor
        supervisor = User.query.filter_by(username='supervisor').first()
        if not supervisor:
            supervisor = User(
                full_name='Test Supervisor',
                username='supervisor', 
                email='supervisor@edvantage.com', 
                role='supervisor',
                role_id=role_objects['supervisor'].id
            )
            supervisor.set_password('password123')
            db.session.add(supervisor)

        # 5. Create Student User
        student_user = User.query.filter_by(username='student').first()
        if not student_user:
            student_user = User(
                full_name='Alice Johnson',
                username='student', 
                email='student@edvantage.com', 
                role='student',
                role_id=role_objects['student'].id
            )
            student_user.set_password('password123')
            db.session.add(student_user)
            db.session.flush()

            # Create Student Profile
            student = Student(
                user_id=student_user.id,
                admission_number='ADM-1001',
                full_name='Alice Johnson',
                current_semester=1,
                gpa=3.5,
                attendance=92.0,
                risk_status='Low'
            )
            db.session.add(student)
        
        # 6. Add Rules
        if not RiskRule.query.first():
            rules = [
                RiskRule(name='Low Attendance', condition_type='attendance_low', threshold=75.0, risk_level='High'),
                RiskRule(name='Low GPA', condition_type='gpa_low', threshold=2.5, risk_level='Medium')
            ]
            db.session.add_all(rules)

        db.session.commit()
        print("Database seeded successfully!")
        print("Superadmin: superadmin / superadmin123")
        print("Admin: admin / admin123")
        print("Supervisor: supervisor / password123")
        print("Student: student / password123")

if __name__ == '__main__':
    seed_data()
