from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.models.performance import Grade, Attendance
from app.schemas import StudentSchema, GradeSchema, AttendanceSchema
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.audit_service import log_audit
from app.services.resource_service import get_recommendations

students_bp = Blueprint('students', __name__)
student_schema = StudentSchema()
students_schema = StudentSchema(many=True)
grade_schema = GradeSchema()
attendance_schema = AttendanceSchema()

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

@students_bp.route('/<id>', methods=['GET'])
@jwt_required()
def get_student(id):
    student = Student.query.get_or_404(id)
    return jsonify(student_schema.dump(student)), 200

@students_bp.route('/<id>/performance', methods=['POST'])
@jwt_required()
def add_performance(id):
    data = request.get_json()
    data['student_id'] = id
    
    record_type = data.get('record_type')
    if record_type == 'grade':
        errors = grade_schema.validate(data)
        if errors:
            return jsonify(errors), 400
        
        record = Grade(
            student_id=id,
            subject_id=data['subject_id'],
            assessment_type=data['assessment_type'],
            score=data['score'],
            max_score=data.get('max_score', 100.0)
        )
        db.session.add(record)
        dump_data = grade_schema.dump(record)
    elif record_type == 'attendance':
        errors = attendance_schema.validate(data)
        if errors:
            return jsonify(errors), 400
            
        record = Attendance(
            student_id=id,
            subject_id=data['subject_id'],
            date=data['date'],
            status=data['status']
        )
        db.session.add(record)
        dump_data = attendance_schema.dump(record)
    else:
        return jsonify({"msg": "Invalid record type. Must be 'grade' or 'attendance'"}), 400
    
    db.session.commit()
    
    current_user_id = get_jwt_identity()
    log_audit(
        action="Add Performance Record",
        user_id=current_user_id,
        target_type="Student",
        target_id=id,
        details=f"Added {record_type} record"
    )
    
    return jsonify(dump_data), 201

@students_bp.route('/<id>/assign-supervisor', methods=['PUT'])
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
         
    old_supervisor_id = student.supervisor_id
    student.supervisor_id = supervisor_id
    db.session.commit()
    
    current_user_id = get_jwt_identity()
    log_audit(
        action="Assign Supervisor",
        user_id=current_user_id,
        target_type="Student",
        target_id=id,
        details=f"Assigned supervisor {supervisor_id} (previous: {old_supervisor_id})"
    )
    
    return jsonify({
        "msg": "Supervisor assigned successfully",
        "student": student.to_dict()
    }), 200

@students_bp.route('/<id>/recommendations', methods=['GET'])
@jwt_required()
def student_recommendations(id):
    """Get personalized educational resources based on performance"""
    recommendations = get_recommendations(id)
    return jsonify(recommendations), 200
