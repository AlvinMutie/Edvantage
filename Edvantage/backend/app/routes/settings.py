import os
from flask import Blueprint, jsonify, request, current_app, send_from_directory
from app.models.settings import SchoolSettings
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User
from werkzeug.utils import secure_filename

settings_bp = Blueprint('settings', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_settings():
    settings = SchoolSettings.query.first()
    if not settings:
        settings = SchoolSettings(school_name="EdVantage")
        db.session.add(settings)
        db.session.commit()
    return settings

@settings_bp.route('/', methods=['GET'])
def fetch_settings():
    # Public endpoint so login page can see Logo/Name
    settings = get_settings()
    return jsonify(settings.to_dict()), 200

@settings_bp.route('/', methods=['PUT'])
@jwt_required()
def update_settings():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403

    settings = get_settings()
    
    # Handle Text Data
    if 'school_name' in request.form: settings.school_name = request.form['school_name']
    if 'address' in request.form: settings.address = request.form['address']
    if 'contact_email' in request.form: settings.contact_email = request.form['contact_email']
    
    # Handle File Upload
    if 'logo' in request.files:
        file = request.files['logo']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            
            file.save(os.path.join(upload_folder, filename))
            settings.logo_url = f"/static/uploads/{filename}"

    db.session.commit()
    return jsonify(settings.to_dict()), 200

# Explicitly serve static files if needed (though standard Flask static folder usually handles this)
# But since we might run frontend separately, we need to ensure the backend serves these images clearly.
# For now, we rely on the client pointing to backend_url + logo_url
