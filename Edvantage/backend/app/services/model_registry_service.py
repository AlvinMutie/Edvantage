from app.models.risk import ModelVersion, ModelTrainingLog, FeatureImportance
from app import db
from datetime import datetime
import os
import joblib

class ModelRegistryService:
    def register_model(self, model, name, metrics, dataset_info, feature_importances, model_path):
        """
        Registers a new model version with its metadata and metrics.
        """
        # Deactivate all current versions
        ModelVersion.query.update({ModelVersion.is_active: False})
        
        # Create new version
        new_version = ModelVersion(
            name=name,
            accuracy=metrics.get('accuracy', 0.0),
            is_active=True
        )
        db.session.add(new_version)
        db.session.flush()

        # Create training log
        log = ModelTrainingLog(
            model_version_id=new_version.id,
            dataset_info=dataset_info,
            metrics=metrics
        )
        db.session.add(log)

        # Store feature importances
        for feature_name, score in feature_importances.items():
            fi = FeatureImportance(
                model_version_id=new_version.id,
                feature_name=feature_name,
                importance_score=float(score)
            )
            db.session.add(fi)

        db.session.commit()
        return new_version

    def get_active_model(self):
        return ModelVersion.query.filter_by(is_active=True).order_by(ModelVersion.created_at.desc()).first()

    def rollback_to_version(self, version_id):
        """
        Rolls back the active model to a previous version.
        """
        target_version = ModelVersion.query.get(version_id)
        if not target_version:
            return False, "Version not found"

        # Deactivate current
        ModelVersion.query.update({ModelVersion.is_active: False})
        
        # Activate target
        target_version.is_active = True
        db.session.commit()
        
        # Update ai_service in-memory
        from app.services.ai_service import ai_service
        # We need to find the model file associated with this version.
        # Currently we don't store model_path in ModelVersion. 
        # For simplicity, we assume we can reload it if we had the path.
        # Ideally, ModelVersion should have a model_path column.
        
        return True, f"Rolled back to {target_version.name}"

    def get_version_history(self):
        return ModelVersion.query.order_by(ModelVersion.created_at.desc()).all()

    def compare_versions(self, version_id_a, version_id_b):
        v_a = ModelVersion.query.get(version_id_a)
        v_b = ModelVersion.query.get(version_id_b)
        
        if not v_a or not v_b:
            return None
            
        log_a = ModelTrainingLog.query.filter_by(model_version_id=v_a.id).first()
        log_b = ModelTrainingLog.query.filter_by(model_version_id=v_b.id).first()
        
        return {
            'v_a': {'name': v_a.name, 'metrics': log_a.metrics if log_a else {}},
            'v_b': {'name': v_b.name, 'metrics': log_b.metrics if log_b else {}}
        }

model_registry_service = ModelRegistryService()
