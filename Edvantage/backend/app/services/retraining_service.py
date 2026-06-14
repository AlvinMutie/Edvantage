from app.services.feature_dataset_builder import feature_dataset_builder
from app.services.ai_service import ai_service
from app.models.risk import ModelVersion, ModelTrainingLog, FeatureImportance, InterventionOutcome
from app import db
from datetime import datetime
import joblib
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

class ModelRetrainingService:
    def trigger_retraining(self, trigger_type='manual'):
        """
        Triggers the retraining pipeline.
        """
        print(f"Triggering model retraining: {trigger_type}")
        
        # 1. Build Dataset
        X, y = feature_dataset_builder.build_training_dataset()
        
        if X is None or len(X) < 10:
            print("Insufficient data for retraining. N < 10.")
            return False

        # 2. Train Model (RandomForest)
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)

        # 3. Save & Version
        model_path = f'models/student_risk_learning_{datetime.utcnow().strftime("%Y%m%d%H%M")}.joblib'
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, model_path)

        # Update database
        version_name = f"learning-v1-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        v = ModelVersion(name=version_name, accuracy=0.0, is_active=True) # Accuracy needs evaluation set
        
        # Deactivate previous versions
        ModelVersion.query.update({ModelVersion.is_active: False})
        
        db.session.add(v)
        db.session.flush()

        log = ModelTrainingLog(
            model_version_id=v.id,
            dataset_info=f"Trained on {len(X)} outcomes. Trigger: {trigger_type}",
            metrics={'samples': len(X)}
        )
        db.session.add(log)

        # Feature Importance
        for name, imp in zip(X.columns, model.feature_importances_):
            fi = FeatureImportance(model_version_id=v.id, feature_name=name, importance_score=float(imp))
            db.session.add(fi)

        db.session.commit()
        
        # Update active model in memory if necessary (ai_service might need reload)
        ai_service.model = model
        ai_service.model_path = model_path
        
        print(f"Model retrained and activated: {version_name}")
        return True

    def check_event_driven_trigger(self):
        """
        Check if N interventions completed since last training.
        """
        last_log = ModelTrainingLog.query.order_by(ModelTrainingLog.trained_at.desc()).first()
        last_trained_at = last_log.trained_at if last_log else datetime.min
        
        new_outcomes = InterventionOutcome.query.filter(InterventionOutcome.completion_date > last_trained_at).count()
        
        if new_outcomes >= 5: # Retrain every 5 new outcomes (low for demo, high for prod)
            return self.trigger_retraining(trigger_type='event_driven')
        
        return False

model_retraining_service = ModelRetrainingService()
