from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.student import Student
from app.schemas import UserSchema
from app import db
from flask_jwt_extended import jwt_required

users_bp = Blueprint('users', __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    # Mask passwords
    result = users_schema.dump(users)
    return jsonify(result), 200

@users_bp.route('/', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=data['email']).first():
         return jsonify({"msg": "Email already exists"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data['role']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.flush()  # Get user.id without committing
    
    # Auto-create student profile for student users
    if new_user.role == 'student':
        # Generate unique student ID
        max_student = db.session.query(db.func.max(Student.id)).scalar()
        next_id = (max_student or 0) + 1
        
        student_profile = Student(
            user_id=new_user.id,
            student_id=f'ST{next_id:04d}',
            full_name=data.get('full_name', new_user.username),
            department=data.get('department', 'Unassigned'),
            current_semester=data.get('current_semester', 1),
            gpa=0.0,
            attendance=100.0,
            risk_status='Safe'
        )
        db.session.add(student_profile)
    
    db.session.commit()
    
    return jsonify(user_schema.dump(new_user)), 201

@users_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user = User.query.get_or_404(id)
    if user.username == 'superadmin': 
         return jsonify({"msg": "Cannot delete superadmin"}), 403
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200

@users_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if 'username' in data: user.username = data['username']
    if 'email' in data: user.email = data['email']
    if 'role' in data: user.role = data['role']
    
    db.session.commit()
    return jsonify(user_schema.dump(user)), 200

@users_bp.route('/<int:id>/reset-password', methods=['POST'])
@jwt_required()
def reset_password(id):
    user = User.query.get_or_404(id)
    data = request.get_json()
    
    if not data.get('password'):
        return jsonify({"msg": "Password required"}), 400
        
    user.set_password(data['password'])
    db.session.commit()
    return jsonify({"msg": "Password reset successfully"}), 200
