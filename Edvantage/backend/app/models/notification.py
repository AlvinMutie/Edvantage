import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50)) # info, warning, risk_alert, message
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('notifications', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat()
        }

class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    target_role = db.Column(db.String(50)) # e.g., 'all', 'teacher', 'student'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
