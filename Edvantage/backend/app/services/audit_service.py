from app import db
from app.models.audit_log import AuditLog
from flask import request

from datetime import datetime

def log_audit(action, user_id=None, target_type=None, target_id=None, details=None):
    """
    Utility to record an action in the audit log
    """
    log = AuditLog(
        user_id=user_id,
        action=action,
        target_type=target_type,
        target_id=target_id,
        details=details,
        ip_address=request.remote_addr if request else None
    )
    db.session.add(log)
    
    # Update engagement metrics if it's a login
    if action == "User Login" and user_id:
        from app.models.user import User
        from app.models.student import Student
        from app.models.parent import Parent
        from app.models.engagement import StudentEngagement
        
        user = User.query.get(user_id)
        if user:
            if user.role == 'student':
                student = Student.query.filter_by(user_id=user_id).first()
                if student:
                    engagement = StudentEngagement.query.filter_by(student_id=student.id).first()
                    if not engagement:
                        engagement = StudentEngagement(student_id=student.id, login_count=0)
                        db.session.add(engagement)
                    if engagement.login_count is None:
                        engagement.login_count = 0
                    engagement.login_count += 1
                    engagement.last_login = datetime.utcnow()
                    engagement.last_activity = datetime.utcnow()
            
            elif user.role == 'parent':
                parent = Parent.query.filter_by(user_id=user_id).first()
                if parent:
                    if parent.login_count is None:
                        parent.login_count = 0
                    parent.login_count += 1
                    parent.last_active = datetime.utcnow()
    
    db.session.commit()
