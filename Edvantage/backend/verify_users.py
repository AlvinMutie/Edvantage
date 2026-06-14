from app import create_app, db
from app.models.user import User

app = create_app()

def verify():
    with app.app_context():
        users = User.query.all()
        print(f"Total users: {len(users)}")
        for u in users:
            print(f"Username: {u.username}, Role: {u.role}, Email: {u.email}")
            # We can't see the password, but we can check if it matches the expected one
            passwords_to_check = ['superadmin123', 'admin123', 'password123']
            for p in passwords_to_check:
                if u.check_password(p):
                    print(f"  Password matches: {p}")
                    break
            else:
                print("  NO KNOWN PASSWORD MATCHES")

if __name__ == '__main__':
    verify()
