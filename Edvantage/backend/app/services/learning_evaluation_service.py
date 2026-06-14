from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from app.models.risk import ModelVersion, ModelTrainingLog, InterventionOutcome, Intervention
from app import db
import numpy as np

class LearningEvaluationService:
    def evaluate_model(self, model, X_test, y_test):
        """
        Calculates core ML metrics for a model version.
        """
        y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
        
        return {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1': float(f1)
        }

    def calculate_learning_gain(self, current_metrics, previous_version_id=None):
        """
        Calculates the learning gain score by comparing current metrics with the previous version.
        """
        if not previous_version_id:
            # Try to find the latest version before this one
            prev_version = ModelVersion.query.filter(ModelVersion.is_active == False).order_by(ModelVersion.created_at.desc()).first()
        else:
            prev_version = ModelVersion.query.get(previous_version_id)
            
        if not prev_version:
            return 0.0 # First version
            
        prev_log = ModelTrainingLog.query.filter_by(model_version_id=prev_version.id).first()
        if not prev_log or not prev_log.metrics:
            return 0.0
            
        prev_accuracy = prev_log.metrics.get('accuracy', 0.0)
        current_accuracy = current_metrics.get('accuracy', 0.0)
        
        # Simple gain: delta accuracy
        gain = current_accuracy - prev_accuracy
        return float(gain)

    def get_intervention_success_trend(self):
        """
        Calculates how intervention success rates are changing over time.
        """
        outcomes = InterventionOutcome.query.order_by(InterventionOutcome.completion_date.asc()).all()
        if not outcomes:
            return []
            
        # Group by week or just return last N
        # For simplicity, let's return a moving average of success_rating
        ratings = [o.success_rating for o in outcomes if o.success_rating is not None]
        if not ratings:
            return []
            
        moving_avg = []
        window = 5
        for i in range(len(ratings)):
            start = max(0, i - window + 1)
            avg = np.mean(ratings[start:i+1])
            moving_avg.append(float(avg))
            
        return moving_avg

learning_evaluation_service = LearningEvaluationService()
