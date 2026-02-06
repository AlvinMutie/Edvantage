from app import db

class SavedFilter(db.Model):
    __tablename__ = 'saved_filters'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    criteria = db.Column(db.JSON, nullable=False)  # Store filter criteria as JSON
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user = db.relationship('User', backref=db.backref('saved_filters', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'criteria': self.criteria,
            'created_at': self.created_at.isoformat()
        }
