from app import create_app, db
from app.models.user import User
from app.models.student import Student

def manage_users():
    app = create_app()
    with app.app_context():
        # List current users
        users = User.query.all()
        print(f"\n--- Current Users ({len(users)}) ---")
        for u in users:
            print(f"ID: {u.id} | Username: {u.username} | Role: {u.role}")
        print("--------------------------\n")

        # Check if we need to delete 'student'
        student_user = User.query.filter_by(username='student').first()
        if student_user:
            print(f"Deleting user 'student' (ID: {student_user.id})...")
            # Profile cascade delete might not be set up, so delete profile first just in case
            profile = Student.query.filter_by(user_id=student_user.id).first()
            if profile:
                db.session.delete(profile)
            
            db.session.delete(student_user)
            db.session.commit()
            print("User 'student' deleted.")
        else:
            print("User 'student' not found.")
            
        # Check if we need to delete 'supervisor' (since user said '2 users only', likely keeping admin/superadmin)
        supervisor_user = User.query.filter_by(username='supervisor').first()
        if supervisor_user:
             print(f"Deleting user 'supervisor' (ID: {supervisor_user.id})...")
             db.session.delete(supervisor_user)
             db.session.commit()
             print("User 'supervisor' deleted.")
             
        # List remaining users
        remaining = User.query.all()
        print(f"\n--- Remaining Users ({len(remaining)}) ---")
        for u in remaining:
            print(f"ID: {u.id} | Username: {u.username} | Role: {u.role}")

if __name__ == "__main__":
    manage_users()
