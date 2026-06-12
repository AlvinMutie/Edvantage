from app import db

class SchoolSettings(db.Model):
    __tablename__ = 'school_settings'

    id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.String(100), default="EdVantage")
    logo_url = db.Column(db.String(255), nullable=True) # Path to stored image
    address = db.Column(db.String(255), nullable=True)
    contact_email = db.Column(db.String(120), nullable=True)
    theme_color = db.Column(db.String(20), default="indigo") # For primary color customization

    def to_dict(self):
        return {
            'school_name': self.school_name,
            'logo_url': self.logo_url,
            'address': self.address,
            'contact_email': self.contact_email,
            'theme_color': self.theme_color
        }
