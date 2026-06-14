from app.services.feature_dataset_builder import feature_dataset_builder
from app.services.ai_service import ai_service
from app.services.model_registry_service import model_registry_service
from app.services.learning_evaluation_service import learning_evaluation_service
from app.services.drift_detection_service import drift_detection_service
from app.models.risk import ModelVersion, ModelTrainingLog, FeatureImportance, InterventionOutcome
from app import db
from datetime import datetime
import joblib
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

class ModelRetrainingService:
    def trigger_retraining(self, trigger_type='manual'):
        """
        Triggers the retraining pipeline with built-in validation.
        """
        print(f"Triggering model retraining: {trigger_type}")
        
        # 1. Build Dataset
        X, y = feature_dataset_builder.build_training_dataset()
        
        if X is None or len(X) < 5: # Back to 5 for demo stability
            print("Insufficient data for retraining. N < 5.")
            return False

        # 2. Train/Test Split for Evaluation
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # 3. Train Model
        model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
        model.fit(X_train, y_train)

        # 4. Evaluation Metrics
        eval_metrics = learning_evaluation_service.evaluate_model(model, X_test, y_test)
        gain = learning_evaluation_service.calculate_learning_gain(eval_metrics)
        eval_metrics['learning_gain_score'] = gain

        # 5. Drift Detection
        drift_alert = False
        drift_metrics = {}
        prev_version = model_registry_service.get_active_model()
        if prev_version:
            # We would need reference data to detect drift properly.
            # For now, we use a simple performance drift check.
            prev_log = ModelTrainingLog.query.filter_by(model_version_id=prev_version.id).first()
            if prev_log and prev_log.metrics:
                prev_acc = prev_log.metrics.get('accuracy', 0.0)
                if eval_metrics['accuracy'] < prev_acc - 0.1: # 10% drop
                    drift_alert = True
                    drift_metrics['performance_drift'] = True

        eval_metrics['drift_alert'] = drift_alert
        eval_metrics['drift_metrics'] = drift_metrics

        # 6. Save & Register
        version_name = f"validated-v1-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        model_path = f'models/student_risk_learning_{datetime.utcnow().strftime("%Y%m%d%H%M")}.joblib'
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, model_path)

        feature_importances = dict(zip(X.columns, model.feature_importances_))
        
        v = model_registry_service.register_model(
            model=model,
            name=version_name,
            metrics=eval_metrics,
            dataset_info=f"Trained on {len(X_train)} outcomes. Eval on {len(X_test)}. Trigger: {trigger_type}",
            feature_importances=feature_importances,
            model_path=model_path
        )

        # 7. Hot-Swap Safety Check (Rollback if drift is too severe)
        if drift_alert and eval_metrics['accuracy'] < 0.5:
            print("CRITICAL: Significant performance drift detected. Rolling back...")
            model_registry_service.rollback_to_version(prev_version.id)
            return False

        # Update active model in memory
        ai_service.model = model
        ai_service.model_path = model_path
        
        print(f"Model retrained, validated, and activated: {version_name}")
        print(f"Metrics: {eval_metrics}")
        return True

    def check_event_driven_trigger(self):
        """
        Check if N interventions completed since last training.
        """
        last_log = ModelTrainingLog.query.order_by(ModelTrainingLog.trained_at.desc()).first()
        last_trained_at = last_log.trained_at if last_log else datetime.min
        
        new_outcomes = InterventionOutcome.query.filter(InterventionOutcome.completion_date > last_trained_at).count()
        
        if new_outcomes >= 20: # Retrain every 20 new outcomes (increased from 5 for stability)
            return self.trigger_retraining(trigger_type='event_driven')
        
        return False

model_retraining_service = ModelRetrainingService()
