from flask import Blueprint, jsonify, request, current_app
from app.models.message import Message
from app.models.user import User
from app.models.student import Student
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_, and_
import os
from werkzeug.utils import secure_filename

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        # Ensure upload folder exists
        upload_folder = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        
        file.save(os.path.join(upload_folder, filename))
        # Return accessible URL
        # Assuming backend is running on port 5000
        url = f"http://127.0.0.1:5000/static/uploads/{filename}"
        return jsonify({'url': url}), 200

@messages_bp.route('/', methods=['POST'])
@jwt_required()
def send_message():
    """Send a message to another user"""
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    receiver_id = data.get('receiver_id')
    content = data.get('content')
    attachment_url = data.get('attachment_url')
    
    if not receiver_id or (not content and not attachment_url):
        return jsonify({"msg": "Receiver ID and content/attachment are required"}), 400
        
    # Check if receiver exists
    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({"msg": "Receiver not found"}), 404
        
    message = Message(
        sender_id=current_user_id,
        receiver_id=receiver_id,
        content=content if content else "Sent an attachment",
        attachment_url=attachment_url
    )
    
    db.session.add(message)
    db.session.commit()
    
    return jsonify(message.to_dict()), 201

@messages_bp.route('/conversations', methods=['GET'])
@jwt_required()
def get_conversations():
    """Get list of users the current user has exchanged messages with"""
    current_user_id = get_jwt_identity()
    
    # This query finds distinct users who have either sent a message to OR received a message from the current user
    # It's a bit complex in pure SQL, so we fetch messages and process in python for MVP simplicity
    # Or use a union query
    
    sent = db.session.query(Message.receiver_id).filter(Message.sender_id == current_user_id)
    received = db.session.query(Message.sender_id).filter(Message.receiver_id == current_user_id)
    
    contact_ids = set([x[0] for x in sent.all()] + [x[0] for x in received.all()])
    
    # Also include relevant contacts based on role automatically (Discovery)
    current_user = User.query.get(current_user_id)
    
    if current_user.role == 'admin':
        # Admins can chat with everyone EXCEPT superadmin
        all_users = User.query.filter(User.id != current_user_id, User.role != 'superadmin').all()
        for u in all_users:
            contact_ids.add(u.id)
            
    elif current_user.role == 'student':
        # Add their supervisor if assigned
        student = Student.query.filter_by(user_id=current_user_id).first()
        if student and student.supervisor_id:
            contact_ids.add(student.supervisor_id)
        # Add all Admins (but NOT superadmin)
        admins = User.query.filter(User.role == 'admin').all()
        for a in admins:
            contact_ids.add(a.id)
            
    elif current_user.role == 'supervisor':
        # Add all assigned students' user_ids
        students = Student.query.filter_by(supervisor_id=current_user_id).all()
        for s in students:
            contact_ids.add(s.user_id)
        # Add all Admins (but NOT superadmin)
        admins = User.query.filter(User.role == 'admin').all()
        for a in admins:
            contact_ids.add(a.id)
            
    contacts = []
    for uid in contact_ids:
        user = User.query.get(uid)
        if user:
            # Calculate unread count for messages FROM this user TO current_user
            unread_count = Message.query.filter_by(sender_id=uid, receiver_id=current_user_id, is_read=False).count()
            
            # Auto-mark undelivered messages as delivered
            undelivered = Message.query.filter_by(sender_id=uid, receiver_id=current_user_id, is_delivered=False).all()
            if undelivered:
                for msg in undelivered:
                    msg.is_delivered = True
                db.session.commit()

            contacts.append({
                'id': user.id,
                'username': user.username,
                'role': user.role,
                'student_profile': user.student_profile.to_dict() if user.student_profile else None,
                'unread_count': unread_count
            })
            
    # Sort contacts: Online/Recent first (mock logic: ID desc)
    contacts.sort(key=lambda x: x['id'], reverse=True)
            
    return jsonify(contacts), 200

@messages_bp.route('/<int:message_id>', methods=['DELETE'])
@jwt_required()
def delete_message(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get_or_404(message_id)
    
    # Only sender can delete
    if message.sender_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    db.session.delete(message)
    db.session.commit()
    return jsonify({'message': 'Message deleted'}), 200

@messages_bp.route('/<int:message_id>', methods=['PUT'])
@jwt_required()
def edit_message(message_id):
    current_user_id = get_jwt_identity()
    message = Message.query.get_or_404(message_id)
    
    # Check authorization
    if message.sender_id != current_user_id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    # Check 3-minute time limit
    from datetime import datetime
    time_diff = datetime.utcnow() - message.timestamp
    if time_diff.total_seconds() > 180: # 3 minutes * 60 seconds
        return jsonify({'error': 'Edit time limit exceeded (3 minutes)'}), 400
        
    data = request.get_json()
    new_content = data.get('content')
    if not new_content:
        return jsonify({'error': 'Content required'}), 400
        
    message.content = new_content
    message.is_edited = True
    db.session.commit()
    return jsonify(message.to_dict()), 200

@messages_bp.route('/history/<int:user_id>', methods=['GET'])
@jwt_required()
def get_messages(user_id):
    """Get message history with a specific user"""
    current_user_id = get_jwt_identity()
    
    messages = Message.query.filter(
        or_(
            and_(Message.sender_id == current_user_id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user_id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
    # Mark received messages as read and delivered
    params = request.args
    mark_read = params.get('mark_read', 'true') == 'true'
    
    if mark_read:
        for msg in messages:
            if msg.receiver_id == current_user_id:
                if not msg.is_read:
                    msg.is_read = True
                if not msg.is_delivered:
                    msg.is_delivered = True
        db.session.commit()
    
    return jsonify([m.to_dict() for m in messages]), 200
