from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.models.performance import PerformanceRecord
from app.schemas import StudentSchema, PerformanceRecordSchema
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

students_bp = Blueprint('students', __name__)
student_schema = StudentSchema()
students_schema = StudentSchema(many=True)
performance_schema = PerformanceRecordSchema()

@students_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_student():
    current_user_id = get_jwt_identity()
    student = Student.query.filter_by(user_id=current_user_id).first()
    if not student:
        return jsonify({"msg": "Student profile not found"}), 404
    return jsonify(student_schema.dump(student)), 200

@students_bp.route('/', methods=['GET'])
@jwt_required()
def get_students():
    students = Student.query.all()
    return jsonify(students_schema.dump(students)), 200

@students_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_student(id):
    student = Student.query.get_or_404(id)
    return jsonify(student_schema.dump(student)), 200

@students_bp.route('/<int:id>/performance', methods=['POST'])
@jwt_required()
def add_performance(id):
    data = request.get_json()
    data['student_id'] = id
    errors = performance_schema.validate(data)
    if errors:
        return jsonify(errors), 400
    
    record = PerformanceRecord(
        student_id=id,
        record_type=data['record_type'],
        value=data['value'],
        semester=data.get('semester')
    )
    db.session.add(record)
    db.session.commit()
    return jsonify(performance_schema.dump(record)), 201

@students_bp.route('/<int:id>/assign-supervisor', methods=['PUT'])
@jwt_required()
def assign_supervisor(id):
    """Assign a supervisor to a student"""
    student = Student.query.get_or_404(id)
    data = request.get_json()
    
    supervisor_id = data.get('supervisor_id')
    
    # Verify supervisor exists and has correct role
    from app.models.user import User
    supervisor = User.query.get(supervisor_id)
    if not supervisor or supervisor.role != 'supervisor':
         return jsonify({"msg": "Invalid supervisor ID"}), 400
         
    student.supervisor_id = supervisor_id
    db.session.commit()
    
    return jsonify({
        "msg": "Supervisor assigned successfully",
        "student": student.to_dict()
    }), 200
