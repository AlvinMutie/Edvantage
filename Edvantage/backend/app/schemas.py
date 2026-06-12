from app import db
from marshmallow import Schema, fields, post_load
from app.models.user import User
from app.models.student import Student
from app.models.performance import PerformanceRecord
from app.models.risk import RiskRule, Intervention

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    role = fields.Str(required=True)
    password = fields.Str(load_only=True, required=True)
    created_at = fields.DateTime(dump_only=True)

class PerformanceRecordSchema(Schema):
    id = fields.Int(dump_only=True)
    student_id = fields.Int(required=True)
    record_type = fields.Str(required=True)
    value = fields.Float(required=True)
    date_recorded = fields.DateTime(dump_only=True)
    semester = fields.Str()

class StudentSchema(Schema):
    id = fields.Int(dump_only=True)
    student_id = fields.Str(required=True)
    full_name = fields.Str(required=True)
    department = fields.Str()
    current_semester = fields.Int()
    user = fields.Nested(UserSchema, exclude=('password',))
    performance_records = fields.Nested(PerformanceRecordSchema, many=True)

class RiskRuleSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)
    condition_type = fields.Str(required=True)
    threshold = fields.Float(required=True)
    risk_level = fields.Str(required=True)

class InterventionSchema(Schema):
    id = fields.Int(dump_only=True)
    student_id = fields.Int(required=True)
    supervisor_id = fields.Int(required=True)
    type = fields.Str(required=True)
    description = fields.Str()
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
