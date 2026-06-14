from flask import Blueprint, request, jsonify
from app.models.user import User, Role
from app.models.student import Student
from app.schemas import UserSchema
from app import db, jwt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.services.audit_service import log_audit
import uuid

auth_bp = Blueprint('auth', __name__)
user_schema = UserSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check for required role
    role_name = data.get('role', 'student')
    role = Role.query.filter_by(name=role_name).first()
    if not role:
        return jsonify({"msg": f"Role '{role_name}' does not exist"}), 400
    
    # Manually add role_id for schema validation if not present
    if 'role_id' not in data:
        data['role_id'] = role.id
    
    errors = user_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    user = User(
        full_name=data.get('full_name', data['username']),
        username=data['username'],
        email=data['email'],
        role=role_name,
        role_id=role.id
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.flush()
    
    if role_name == 'student':
        # Generate admission number
        count = Student.query.count()
        admission_number = f"ADM-{1000 + count + 1}"
        
        student_profile = Student(
            user_id=user.id,
            admission_number=admission_number,
            full_name=user.full_name,
            current_semester=1,
            gpa=0.0,
            attendance=100.0,
            risk_status='Low'
        )
        db.session.add(student_profile)
    
    db.session.commit()
    log_audit("User Registration", user_id=user.id, target_type="User", target_id=user.id, details=f"User {user.username} registered.")
    
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    
    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=user.id)
        log_audit("User Login", user_id=user.id, details=f"User {user.username} logged in.")
        return jsonify(access_token=access_token, role=user.role, user_id=user.id), 200
    
    log_audit("Failed Login Attempt", details=f"Failed login attempt for username: {data.get('username')}")
    return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user_schema.dump(user)), 200
