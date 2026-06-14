from datetime import datetime, timedelta
from sqlalchemy import func
from app import db
from app.models.performance import Grade, Attendance
from app.models.behavior import BehavioralIncident
from app.models.audit_log import AuditLog
from app.models.risk import Intervention
import numpy as np

class TemporalFeatureService:
    def get_student_features(self, student_id, ref_date=None):
        """
        Compute time-series aware features for a student.
        ref_date: The date to compute features relative to (defaults to now).
        """
        if ref_date is None:
            ref_date = datetime.utcnow()
            
        features = {}
        
        # 1. GPA Trends
        features.update(self._get_gpa_trends(student_id, ref_date))
        
        # 2. Attendance Trends
        features.update(self._get_attendance_trends(student_id, ref_date))
        
        # 3. Behavioral Trends
        features.update(self._get_behavioral_trends(student_id, ref_date))
        
        # 4. Engagement Trends (Logins)
        features.update(self._get_engagement_trends(student_id, ref_date))
        
        # 5. Intervention Response
        features.update(self._get_intervention_features(student_id, ref_date))
        
        return features

    def _get_gpa_trends(self, student_id, ref_date):
        def calc_avg_gpa(days):
            start_date = ref_date - timedelta(days=days)
            grades = Grade.query.filter(
                Grade.student_id == student_id,
                Grade.created_at >= start_date,
                Grade.created_at <= ref_date
            ).all()
            if not grades: return None
            return np.mean([g.score / g.max_score * 4.0 for g in grades])

        gpa_7d = calc_avg_gpa(7)
        gpa_30d = calc_avg_gpa(30)
        gpa_90d = calc_avg_gpa(90)
        
        return {
            'gpa_avg_7d': gpa_7d,
            'gpa_avg_30d': gpa_30d,
            'gpa_avg_90d': gpa_90d,
            'gpa_trend_30d': (gpa_7d - gpa_30d) if (gpa_7d and gpa_30d) else 0.0
        }

    def _get_attendance_trends(self, student_id, ref_date):
        def calc_att_rate(days):
            start_date = (ref_date - timedelta(days=days)).date()
            att_records = Attendance.query.filter(
                Attendance.student_id == student_id,
                Attendance.date >= start_date,
                Attendance.date <= ref_date.date()
            ).all()
            if not att_records: return None
            present = sum(1 for a in att_records if a.status == 'present')
            return (present / len(att_records)) * 100

        att_7d = calc_att_rate(7)
        att_30d = calc_att_rate(30)
        att_90d = calc_att_rate(90)
        
        return {
            'att_rate_7d': att_7d,
            'att_rate_30d': att_30d,
            'att_rate_90d': att_90d,
            'att_trend_30d': (att_7d - att_30d) if (att_7d and att_30d) else 0.0
        }

    def _get_behavioral_trends(self, student_id, ref_date):
        def count_incidents(days):
            start_date = ref_date - timedelta(days=days)
            return BehavioralIncident.query.filter(
                BehavioralIncident.student_id == student_id,
                BehavioralIncident.incident_date >= start_date,
                BehavioralIncident.incident_date <= ref_date
            ).count()

        return {
            'incidents_7d': count_incidents(7),
            'incidents_30d': count_incidents(30),
            'incidents_90d': count_incidents(90)
        }

    def _get_engagement_trends(self, student_id, ref_date):
        # Using AuditLog for logins
        from app.models.student import Student
        student = Student.query.get(student_id)
        user_id = student.user_id if student else None
        
        def count_logins(days):
            if not user_id: return 0
            start_date = ref_date - timedelta(days=days)
            return AuditLog.query.filter(
                AuditLog.user_id == user_id,
                AuditLog.action == 'Login',
                AuditLog.timestamp >= start_date,
                AuditLog.timestamp <= ref_date
            ).count()

        logins_7d = count_logins(7)
        logins_30d = count_logins(30)
        
        return {
            'logins_7d': logins_7d,
            'logins_30d': logins_30d,
            'engagement_growth': (logins_7d / 7) - (logins_30d / 30) if logins_30d > 0 else 0.0
        }

    def _get_intervention_features(self, student_id, ref_date):
        # Average time from recommendation to intervention creation
        # (This is a simplified version)
        interventions = Intervention.query.filter(
            Intervention.student_id == student_id,
            Intervention.created_at <= ref_date
        ).all()
        
        count = len(interventions)
        return {
            'intervention_count_total': count,
            'active_interventions': sum(1 for i in interventions if i.status == 'open')
        }

temporal_feature_service = TemporalFeatureService()
