from app import create_app, db
from app.models.user import User
from app.models.student import Student

def delete_student_profile():
    app = create_app()
    with app.app_context():
        # Find the 'student' user
        user = User.query.filter_by(username='student').first()
        if not user:
            print("User 'student' not found!")
            return

        # Find the associated student profile
        student = Student.query.filter_by(user_id=user.id).first()
        if not student:
            print("Student profile not found! It might have already been deleted.")
            return

        # Delete the student profile
        db.session.delete(student)
        db.session.commit()
        print(f"Successfully deleted student profile for user '{user.username}' (ID: {user.id})")
        print("Now you can log in as 'student' to verify auto-creation.")

if __name__ == "__main__":
    delete_student_profile()
