from app import create_app, db
from app.models.user import User, Role
from app.models.student import Student
from app.models.risk import RiskRule

app = create_app()

def seed_data():
    with app.app_context():
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

        # 2. Force Create/Update Superadmin
        superadmin = User.query.filter_by(username='superadmin').first()
        if not superadmin:
            superadmin = User(username='superadmin', email='superadmin@edvantage.com', role='superadmin', role_id=role_objects['superadmin'].id, full_name='System Superadmin')
            db.session.add(superadmin)
        superadmin.set_password('superadmin123')

        # 3. Force Create/Update Admin
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(username='admin', email='admin@edvantage.com', role='admin', role_id=role_objects['admin'].id, full_name='Admin User')
            db.session.add(admin)
        admin.set_password('admin123')

        # 4. Force Create/Update Supervisor
        supervisor = User.query.filter_by(username='supervisor').first()
        if not supervisor:
            supervisor = User(username='supervisor', email='supervisor@edvantage.com', role='supervisor', role_id=role_objects['supervisor'].id, full_name='Test Supervisor')
            db.session.add(supervisor)
        supervisor.set_password('password123')

        # 5. Force Create/Update Student
        student_user = User.query.filter_by(username='student').first()
        if not student_user:
            student_user = User(username='student', email='student@edvantage.com', role='student', role_id=role_objects['student'].id, full_name='Alice Johnson')
            db.session.add(student_user)
            db.session.flush()
        
        student_user.set_password('password123')

        # Ensure student profile exists
        student = Student.query.filter_by(user_id=student_user.id).first()
        if not student:
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

        db.session.commit()
        print("Database credentials synchronized!")
        print("Superadmin: superadmin / superadmin123")
        print("Admin: admin / admin123")
        print("Supervisor: supervisor / password123")
        print("Student: student / password123")

if __name__ == '__main__':
    seed_data()
