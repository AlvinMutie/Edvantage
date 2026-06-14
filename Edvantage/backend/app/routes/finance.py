from flask import Blueprint, request, jsonify
from app.models.finance import StudentFinance
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User

finance_bp = Blueprint('finance', __name__)

@finance_bp.route('/student/<student_id>', methods=['GET'])
@jwt_required()
def get_student_finance(student_id):
    finance = StudentFinance.query.filter_by(student_id=student_id).first()
    if not finance:
        return jsonify({"msg": "Finance record not found"}), 404
    return jsonify(finance.to_dict()), 200

@finance_bp.route('/update', methods=['POST'])
@jwt_required()
def update_finance():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
        
    data = request.get_json()
    student_id = data.get('student_id')
    total_fees = data.get('total_fees')
    paid_fees = data.get('paid_fees')
    
    finance = StudentFinance.query.filter_by(student_id=student_id).first()
    if not finance:
        finance = StudentFinance(student_id=student_id)
        db.session.add(finance)
    
    if total_fees is not None:
        finance.total_fees = total_fees
    if paid_fees is not None:
        finance.paid_fees = paid_fees
        
    finance.balance = finance.total_fees - finance.paid_fees
    if finance.balance <= 0:
        finance.status = 'cleared'
    elif finance.paid_fees > 0:
        finance.status = 'partial'
    else:
        finance.status = 'pending'
        
    db.session.commit()
    return jsonify(finance.to_dict()), 200
