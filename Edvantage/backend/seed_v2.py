import uuid
from app import create_app, db
from app.models.user import User, Role
from datetime import datetime

app = create_app()

def seed_data():
    with app.app_context():
        # 1. Create Roles
        roles = [
            'superadmin', 'admin', 'teacher', 'supervisor', 'counselor', 'student', 'parent'
        ]
        
        role_objects = {}
        for role_name in roles:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                role = Role(name=role_name, description=f"{role_name.capitalize()} role")
                db.session.add(role)
                print(f"Created role: {role_name}")
            role_objects[role_name] = role
        
        db.session.commit()
        
        # 2. Create Superadmin
        superadmin_email = 'superadmin@edvantage.com'
        superadmin = User.query.filter_by(email=superadmin_email).first()
        
        if not superadmin:
            superadmin = User(
                full_name='System Superadmin',
                username='superadmin',
                email=superadmin_email,
                role='superadmin', # Legacy field
                role_id=role_objects['superadmin'].id,
                status='active'
            )
            superadmin.set_password('superadmin123')
            db.session.add(superadmin)
            print("Created superadmin user")
        
        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()
