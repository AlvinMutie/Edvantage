import uuid
from datetime import datetime
from app import db
import bcrypt

def generate_uuid():
    return str(uuid.uuid4())

class Role(db.Model):
    __tablename__ = 'roles'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name = db.Column(db.String(50), unique=True, nullable=False) # superadmin, admin, teacher, supervisor, student, parent, counselor
    description = db.Column(db.String(255))
    
    users = db.relationship('User', backref='role_profile', lazy=True)

class Permission(db.Model):
    __tablename__ = 'permissions'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    role_id = db.Column(db.String(36), db.ForeignKey('roles.id'), nullable=False)
    permission_name = db.Column(db.String(100), nullable=False)
    
    role = db.relationship('Role', backref=db.backref('permissions', lazy=True))

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.String(36), db.ForeignKey('roles.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False) # Keep legacy role string for compatibility during migration
    status = db.Column(db.String(20), default='active') # active, suspended
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'role_id': self.role_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
