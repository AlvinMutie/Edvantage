from app.models.risk import Intervention, InterventionOutcome, InterventionRecommendation, InterventionTemplate, InterventionEffectiveness
from app.models.student import Student
from app import db
from sqlalchemy import func
from datetime import datetime

class InterventionAnalyticsService:
    def record_outcome(self, intervention_id, outcome_data, completed_by_id):
        """
        Records the outcome of an intervention and captures performance deltas.
        """
        intervention = Intervention.query.get(intervention_id)
        if not intervention:
            return None
            
        student = intervention.student
        
        # 1. Capture "After" Snapshot (Current state)
        gpa_after = student.gpa or 0.0
        attendance_after = student.attendance or 0.0
        risk_after = student.risk_status
        
        # 2. Capture "Before" Snapshot 
        gpa_before = None
        attendance_before = None
        risk_before = None
        
        if intervention.recommendation:
            risk_before = intervention.recommendation.prediction.risk_level
            for evidence in intervention.recommendation.evidence:
                if evidence.metric_name == 'gpa': gpa_before = evidence.current_value
                if evidence.metric_name == 'attendance': attendance_before = evidence.current_value
        
        if risk_before is None: risk_before = risk_after
        if gpa_before is None: gpa_before = gpa_after
        if attendance_before is None: attendance_before = attendance_after

        # 3. Calculate Effectiveness Score
        effectiveness = self._calculate_effectiveness(
            gpa_before, gpa_after, attendance_before, attendance_after, outcome_data.get('success_rating', 3)
        )

        outcome = InterventionOutcome(
            intervention_id=intervention.id,
            outcome_notes=outcome_data.get('notes'),
            success_rating=outcome_data.get('success_rating'),
            risk_level_before=risk_before,
            risk_level_after=risk_after,
            gpa_before=gpa_before,
            gpa_after=gpa_after,
            attendance_before=attendance_before,
            attendance_after=attendance_after,
            effectiveness_score=effectiveness,
            completed_by_id=completed_by_id,
            completion_date=datetime.utcnow(),
            trace_id=intervention.trace_id
        )
        
        intervention.status = 'closed'
        db.session.add(outcome)
        
        # 4. Update InterventionEffectiveness
        self._update_effectiveness_stats(intervention.type, effectiveness)
        
        # Emit events
        from app.services.event_bus import event_bus
        event_bus.emit('InterventionCompleted', {
            'intervention_id': intervention.id,
            'completed_by_id': completed_by_id
        }, trace_id=intervention.trace_id)

        event_bus.emit('InterventionOutcomeRecorded', {
            'intervention_id': intervention.id,
            'effectiveness_score': effectiveness,
            'gpa_delta': (gpa_after - gpa_before) if (gpa_after and gpa_before) else 0
        }, trace_id=intervention.trace_id)

        db.session.commit()
        
        # 5. Check if retraining is needed
        try:
            from app.services.retraining_service import model_retraining_service
            model_retraining_service.check_event_driven_trigger()
        except Exception as e:
            print(f"Retraining trigger failed: {e}")
            
        return outcome

    def _update_effectiveness_stats(self, intervention_type, score):
        stats = InterventionEffectiveness.query.filter_by(intervention_type=intervention_type).first()
        if not stats:
            stats = InterventionEffectiveness(
                intervention_type=intervention_type,
                total_count=0,
                success_count=0,
                avg_effectiveness_score=0.0
            )
            db.session.add(stats)
        
        if stats.total_count is None: stats.total_count = 0
        if stats.success_count is None: stats.success_count = 0
        if stats.avg_effectiveness_score is None: stats.avg_effectiveness_score = 0.0

        stats.total_count += 1
        if score > 0.6:
            stats.success_count += 1
        
        stats.avg_effectiveness_score = (stats.avg_effectiveness_score * (stats.total_count - 1) + score) / stats.total_count
        stats.last_updated = datetime.utcnow()

    def _calculate_effectiveness(self, gpa_b, gpa_a, att_b, att_a, rating):
        rating_score = (rating / 5.0) * 0.4
        gpa_change = (gpa_a - gpa_b) if (gpa_a and gpa_b) else 0
        gpa_score = max(0, min(0.3, (gpa_change / 1.0) * 0.3))
        att_change = (att_a - att_b) if (att_a and att_b) else 0
        att_score = max(0, min(0.3, (att_change / 20.0) * 0.3))
        return rating_score + gpa_score + att_score

    def get_summary_stats(self):
        total_interventions = Intervention.query.count()
        closed_interventions = Intervention.query.filter_by(status='closed').count()
        avg_success = db.session.query(func.avg(InterventionOutcome.success_rating)).scalar() or 0
        avg_effectiveness = db.session.query(func.avg(InterventionOutcome.effectiveness_score)).scalar() or 0
        stats_by_type = db.session.query(
            Intervention.type,
            func.avg(InterventionOutcome.effectiveness_score).label('avg_eff'),
            func.count(InterventionOutcome.id).label('count')
        ).join(InterventionOutcome).group_by(Intervention.type).all()
        return {
            "total_count": total_interventions,
            "completion_rate": (closed_interventions / total_interventions) if total_interventions > 0 else 0,
            "avg_success_rating": float(avg_success),
            "avg_effectiveness_score": float(avg_effectiveness),
            "by_type": [{"type": s.type, "effectiveness": float(s.avg_eff), "count": s.count} for s in stats_by_type]
        }

    def get_best_interventions(self, risk_level=None):
        query = db.session.query(
            Intervention.type,
            func.avg(InterventionOutcome.effectiveness_score).label('avg_eff')
        ).join(InterventionOutcome)
        if risk_level:
            query = query.filter(InterventionOutcome.risk_level_before == risk_level)
        results = query.group_by(Intervention.type).order_by(func.avg(InterventionOutcome.effectiveness_score).desc()).all()
        return [{"type": r.type, "effectiveness": float(r.avg_eff)} for r in results]

analytics_service = InterventionAnalyticsService()
