from app import db
from app.models.audit_log import AuditLog
from flask import request

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
    db.session.commit()
