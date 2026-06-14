from app.models.risk import InterventionRecommendation, Intervention, InterventionOutcome, InterventionTemplate
from app.services.recommendation_engine import RuleBasedRecommendationEngine
from app import db
from datetime import datetime, timedelta

class InterventionRecommendationService:
    def __init__(self, engine=None):
        self.engine = engine or RuleBasedRecommendationEngine()

    def generate_recommendations(self, student, risk_prediction, context_data):
        """
        Orchestrates the generation and storage of recommendations.
        """
        # Remove any existing pending recommendations for this student and prediction to avoid duplicates
        InterventionRecommendation.query.filter_by(
            student_id=student.id, 
            risk_prediction_id=risk_prediction.id, 
            status='pending'
        ).delete()
        
        recommendations = self.engine.get_recommendations(student, risk_prediction, context_data)
        for rec in recommendations:
            db.session.add(rec)
            # Evidence is already attached to rec in the engine
            
        db.session.commit()
        return recommendations

    def approve_recommendation(self, recommendation_id, supervisor_id, modifications=None):
        """
        Approves a recommendation and creates an actual intervention.
        """
        rec = InterventionRecommendation.query.get(recommendation_id)
        if not rec or rec.status != 'pending':
            return None
            
        rec.status = 'approved'
        rec.supervisor_id = supervisor_id
        
        notes = rec.supervisor_notes
        assigned_to_id = None
        due_date = None
        
        if modifications:
            rec.supervisor_notes = modifications.get('notes', rec.supervisor_notes)
            notes = modifications.get('notes', notes)
            assigned_to_id = modifications.get('assigned_to_id')
            if modifications.get('due_date'):
                due_date = datetime.fromisoformat(modifications.get('due_date').replace('Z', '+00:00'))

        template = rec.template
        if not due_date:
            duration = template.suggested_duration_days if template else 30
            due_date = datetime.utcnow() + timedelta(days=duration)

        # Create Intervention
        intervention = Intervention(
            student_id=rec.student_id,
            supervisor_id=supervisor_id,
            recommendation_id=rec.id,
            assigned_to_id=assigned_to_id,
            type=template.intervention_type if template else 'General',
            notes=notes or (template.description if template else "Automated intervention"),
            due_date=due_date,
            status='open'
        )
        
        db.session.add(intervention)
        db.session.commit()
        return intervention

    def reject_recommendation(self, recommendation_id, supervisor_id, notes):
        rec = InterventionRecommendation.query.get(recommendation_id)
        if rec and rec.status == 'pending':
            rec.status = 'rejected'
            rec.supervisor_id = supervisor_id
            rec.supervisor_notes = notes
            db.session.commit()
            return rec
        return None

    def get_pending_recommendations(self):
        return InterventionRecommendation.query.filter_by(status='pending').all()

    def get_student_recommendations(self, student_id):
        return InterventionRecommendation.query.filter_by(student_id=student_id).order_by(InterventionRecommendation.created_at.desc()).all()

intervention_service = InterventionRecommendationService()
