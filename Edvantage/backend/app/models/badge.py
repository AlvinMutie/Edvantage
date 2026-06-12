from app import db

class Badge(db.Model):
    __tablename__ = 'badges'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255))
    icon_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon_url': self.icon_url
        }

class StudentBadge(db.Model):
    __tablename__ = 'student_badges'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, server_default=db.func.now())
    
    student = db.relationship('Student', backref=db.backref('student_badges', lazy=True))
    badge = db.relationship('Badge', backref=db.backref('awarded_to_students', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'badge': self.badge.to_dict(),
            'awarded_at': self.awarded_at.isoformat()
        }
