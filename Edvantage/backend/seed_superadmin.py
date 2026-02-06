from app import create_app, db
from app.models.user import User

app = create_app()

def seed_notifications_table():
    with app.app_context():
        # Quick way to ensure table exists without full migration system present in this specific task context
        # In a real app, use Flask-Migrate. Here we just call create_all which creates missing tables.
        from app.models.notification import Notification
        from app.models.settings import SchoolSettings
        db.create_all()
        print("Tables checked/created.")

if __name__ == '__main__':
    seed_notifications_table()
