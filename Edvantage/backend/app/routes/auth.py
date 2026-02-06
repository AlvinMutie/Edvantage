from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.student import Student
from app.schemas import UserSchema
from app import db, jwt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

auth_bp = Blueprint('auth', __name__)
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.flush()  # Get user.id without committing
    
    # Auto-create student profile for student users
    if user.role == 'student':
        # Generate unique student ID
        max_student = db.session.query(db.func.max(Student.id)).scalar()
        next_id = (max_student or 0) + 1
        
        student_profile = Student(
            user_id=user.id,
            student_id=f'ST{next_id:04d}',  # Format: ST0001, ST0002, etc.
            full_name=data.get('full_name', user.username),  # Use full_name if provided
            department=data.get('department', 'Unassigned'),
            current_semester=data.get('current_semester', 1),
            gpa=0.0,
            attendance=100.0,
            risk_status='Safe'
        )
        db.session.add(student_profile)
    
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token, role=user.role), 200
    
    return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user_schema.dump(user)), 200
