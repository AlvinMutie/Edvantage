import uuid
from datetime import datetime
from app import db

def generate_uuid():
    return str(uuid.uuid4())

class SavedFilter(db.Model):
    __tablename__ = 'saved_filters'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    criteria = db.Column(db.JSON, nullable=False)  # Store filter criteria as JSON
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('saved_filters', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'criteria': self.criteria,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
