from abc import ABC, abstractmethod
from app.models.risk import InterventionTemplate, InterventionRecommendation, RecommendationEvidence, InterventionEffectiveness
from app import db
from datetime import datetime

class RecommendationEngine(ABC):
    @abstractmethod
    def get_recommendations(self, student, risk_prediction, context_data):
        """
        Generate recommendations based on student data and risk prediction.
        
        Args:
            student: Student model instance
            risk_prediction: RiskPrediction model instance
            context_data: Dictionary containing detailed metrics (gpa, attendance, etc.)
            
        Returns:
            List of InterventionRecommendation objects (unsaved)
        """
        pass

class RuleBasedRecommendationEngine(RecommendationEngine):
    def get_recommendations(self, student, risk_prediction, context_data):
        templates = InterventionTemplate.query.filter_by(is_active=True).all()
        recommendations = []
        
        # Rule mapping: metric_name -> (template_type_keyword, condition_func)
        rules = [
            ('gpa', 'tutoring', lambda v: v < 2.0),
            ('gpa', 'study plan', lambda v: v < 2.5),
            ('attendance', 'attendance counseling', lambda v: v < 70),
            ('attendance', 'parent notification', lambda v: v < 85),
            ('incident_count', 'counselor referral', lambda v: v > 1),
            ('fee_balance', 'finance office referral', lambda v: v > 2000),
            ('resource_usage', 'mentor assignment', lambda v: v < 10),
        ]
        
        triggered_templates = []
        evidence_map = {} # template_id -> list of evidence data
        
        for metric, keyword, condition in rules:
            val = context_data.get(metric)
            if val is not None and condition(val):
                # Find matching templates
                matching_templates = [t for t in templates if keyword.lower() in t.name.lower() or keyword.lower() in t.intervention_type.lower()]
                for template in matching_templates:
                    if template.id not in triggered_templates:
                        triggered_templates.append(template.id)
                        evidence_map[template.id] = []
                    
                    evidence_map[template.id].append({
                        'metric_name': metric,
                        'current_value': val,
                        'threshold_value': self._get_threshold(metric), # Placeholder for threshold logic
                        'trend': context_data.get(f'{metric}_trend', 'stable')
                    })

        for template_id in triggered_templates:
            template = next(t for t in templates if t.id == template_id)
            
            # Calculate Scores (Rule-based heuristics)
            confidence = 0.8 # Fixed for rule-based
            urgency = self._calculate_urgency(template, evidence_map[template_id])
            effectiveness = 0.7 # Based on historical averages (placeholder)
            
            rec = InterventionRecommendation(
                student_id=student.id,
                risk_prediction_id=risk_prediction.id,
                template_id=template.id,
                status='pending',
                confidence_score=confidence,
                urgency_score=urgency,
                predicted_effectiveness=effectiveness,
                trace_id=context_data.get('trace_id')
            )
            
            # Attach evidence objects
            for e_data in evidence_map[template_id]:
                evidence = RecommendationEvidence(
                    metric_name=e_data['metric_name'],
                    current_value=e_data['current_value'],
                    threshold_value=e_data['threshold_value'],
                    trend=e_data['trend']
                )
                rec.evidence.append(evidence)
            
            recommendations.append(rec)
            
        return recommendations

    def _get_threshold(self, metric):
        thresholds = {
            'gpa': 2.5,
            'attendance': 85.0,
            'incident_count': 1.0,
            'fee_balance': 1000.0,
            'resource_usage': 20.0
        }
        return thresholds.get(metric, 0.0)

    def _calculate_urgency(self, template, evidence_list):
        # Heuristic for urgency
        base_urgency = 0.5
        if template.priority == 'Critical': base_urgency = 0.9
        elif template.priority == 'High': base_urgency = 0.7
        
        # Boost urgency if metrics are way off
        for e in evidence_list:
            if e['metric_name'] == 'attendance' and e['current_value'] < 50:
                base_urgency = max(base_urgency, 0.95)
            if e['metric_name'] == 'gpa' and e['current_value'] < 1.0:
                base_urgency = max(base_urgency, 0.9)
                
        return min(base_urgency, 1.0)

class LearningRecommendationEngine(RecommendationEngine):
    def get_recommendations(self, student, risk_prediction, context_data):
        templates = InterventionTemplate.query.filter_by(is_active=True).all()
        effectiveness_stats = {e.intervention_type: e for e in InterventionEffectiveness.query.all()}
        
        recommendations = []
        
        # 1. First, identify applicable categories based on risk context
        categories = []
        if context_data.get('gpa', 4.0) < 2.5: categories.append('tutoring')
        if context_data.get('attendance', 100) < 85: categories.append('counseling')
        if context_data.get('incident_count', 0) > 0: categories.append('counseling')
        if context_data.get('fee_balance', 0) > 1000: categories.append('financial')
        
        applicable_templates = []
        for template in templates:
            if any(cat in template.intervention_type.lower() or cat in template.name.lower() for cat in categories):
                applicable_templates.append(template)

        # 2. Score and Rank based on Historical Effectiveness
        scored_templates = []
        for template in applicable_templates:
            stats = effectiveness_stats.get(template.intervention_type)
            
            # Predictive Score = (Historical Effectiveness * 0.7) + (Priority Weight * 0.3)
            hist_eff = stats.avg_effectiveness_score if stats else 0.5
            priority_map = {'Critical': 1.0, 'High': 0.8, 'Medium': 0.5, 'Low': 0.3}
            prio_weight = priority_map.get(template.priority, 0.5)
            
            score = (hist_eff * 0.7) + (prio_weight * 0.3)
            scored_templates.append((template, score, hist_eff))

        # Rank by score descending
        scored_templates.sort(key=lambda x: x[1], reverse=True)

        for template, score, hist_eff in scored_templates:
            rec = InterventionRecommendation(
                student_id=student.id,
                risk_prediction_id=risk_prediction.id,
                template_id=template.id,
                status='pending',
                confidence_score=0.9 if stats else 0.5,
                urgency_score=score,
                predicted_effectiveness=hist_eff,
                trace_id=context_data.get('trace_id')
            )
            
            evidence = RecommendationEvidence(
                metric_name='learning_score',
                current_value=score,
                threshold_value=0.5,
                trend='stable'
            )
            rec.evidence.append(evidence)
            recommendations.append(rec)
            
        return recommendations
