from app import db
from datetime import datetime

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action = db.Column(db.String(100), nullable=False) # e.g., "Update Grade", "Login", "Create Intervention"
    target_type = db.Column(db.String(50), nullable=True) # e.g., "Student", "Assignment"
    target_id = db.Column(db.Integer, nullable=True)
    details = db.Column(db.Text, nullable=True) # JSON or descriptive string
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    user = db.relationship('User', backref=db.backref('audit_logs', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user': self.user.username if self.user else 'System',
            'action': self.action,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'timestamp': self.timestamp.isoformat()
        }
