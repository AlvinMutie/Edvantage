from marshmallow import Schema, fields, post_load
from app.models.user import User, Role, Permission
from app.models.student import Student, Department, Course, Subject, Semester
from app.models.performance import Enrollment, Grade, Attendance, Teacher, Supervisor, Counselor
from app.models.risk import RiskPrediction, Intervention, InterventionOutcome, Referral, CounselingSession, RiskRule

class RoleSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    description = fields.Str()

class UserSchema(Schema):
    id = fields.Str(dump_only=True)
    full_name = fields.Str(required=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(required=True)
    role_id = fields.Str(required=True)
    password = fields.Str(load_only=True)
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)

class DepartmentSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)

class StudentSchema(Schema):
    id = fields.Str(dump_only=True)
    user_id = fields.Str(required=True)
    student_id = fields.Str(attribute='admission_number', dump_only=True) # Alias for frontend
    admission_number = fields.Str(required=True)
    full_name = fields.Str(required=True)
    department_id = fields.Str()
    current_semester = fields.Int()
    gpa = fields.Float()
    attendance = fields.Float()
    risk_status = fields.Str()
    status = fields.Str()
    user = fields.Nested(UserSchema, dump_only=True)
    supervisor = fields.Nested(UserSchema, dump_only=True)

class GradeSchema(Schema):
    id = fields.Str(dump_only=True)
    student_id = fields.Str(required=True)
    subject_id = fields.Str(required=True)
    assessment_type = fields.Str(required=True)
    score = fields.Float(required=True)
    max_score = fields.Float()
    created_at = fields.DateTime(dump_only=True)

class AttendanceSchema(Schema):
    id = fields.Str(dump_only=True)
    student_id = fields.Str(required=True)
    subject_id = fields.Str(required=True)
    date = fields.Date(required=True)
    status = fields.Str(required=True)

class ModelVersionSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    accuracy = fields.Float()
    is_active = fields.Bool()
    created_at = fields.DateTime(dump_only=True)

class RiskPredictionSchema(Schema):
    id = fields.Str(dump_only=True)
    student_id = fields.Str(required=True)
    risk_level = fields.Str(required=True)
    probability_score = fields.Float(required=True)
    model_version_id = fields.Str()
    reasons = fields.Dict()
    created_at = fields.DateTime(dump_only=True)

class InterventionSchema(Schema):
    id = fields.Str(dump_only=True)
    student_id = fields.Str(required=True)
    supervisor_id = fields.Str(required=True)
    type = fields.Str(required=True)
    status = fields.Str()
    notes = fields.Str()
    created_at = fields.DateTime(dump_only=True)

class RiskRuleSchema(Schema):
    id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    condition_type = fields.Str(required=True)
    threshold = fields.Float(required=True)
    risk_level = fields.Str(required=True)
