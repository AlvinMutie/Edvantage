from flask import Blueprint, jsonify, request
from app.models.notification import Notification
from app.models.user import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    notifications = Notification.query.filter_by(user_id=current_user_id).order_by(Notification.created_at.desc()).limit(20).all()
    return jsonify([n.to_dict() for n in notifications]), 200

@notifications_bp.route('/<int:id>/read', methods=['PUT'])
@jwt_required()
def mark_read(id):
    current_user_id = get_jwt_identity()
    notification = Notification.query.filter_by(id=id, user_id=current_user_id).first_or_404()
    notification.is_read = True
    db.session.commit()
    return jsonify({"msg": "Marked as read"}), 200

@notifications_bp.route('/broadcast', methods=['POST'])
@jwt_required()
def broadcast_notification():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role != 'superadmin':
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.get_json()
    title = data.get('title')
    message = data.get('message')
    type = data.get('type', 'info')

    if not title or not message:
        return jsonify({"msg": "Title and message required"}), 400

    users = User.query.all()
    notifications = []
    for u in users:
        notifications.append(Notification(
            user_id=u.id,
            title=title,
            message=message,
            type=type
        ))
    
    db.session.add_all(notifications)
    db.session.commit()

    return jsonify({"msg": f"Broadcast sent to {len(users)} users"}), 201
