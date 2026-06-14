import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from datetime import datetime

class RiskPredictionService:
    def __init__(self):
        self.model = None
        self.model_path = 'student_risk_model.joblib'

    def _load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                return True
            except Exception:
                return False
        return False

    def train_model(self):
        """
        Trains the Random Forest model on student data using multi-factor features.
        """
        from app import db
        from app.models.student import Student
        from app.models.performance import Grade, Attendance
        from app.models.assignment import Submission
        from app.models.behavior import BehavioralIncident
        from app.models.finance import StudentFinance
        from app.models.engagement import StudentEngagement
        from app.models.risk import Referral, ModelVersion, ModelTrainingLog, FeatureImportance
        
        students = Student.query.all()
        if len(students) < 3:
            return self._train_synthetic()

        features = []
        labels = []
        
        for student in students:
            # 1. Academic & Behavioral (Existing)
            gpa = student.gpa or 0.0
            attendance = student.attendance or 0.0
            late_subs = Submission.query.filter_by(student_id=student.id, status='late').count()
            missing_subs = Submission.query.filter_by(student_id=student.id, status='missing').count()
            
            # 2. Behavioral Incidents
            incidents = BehavioralIncident.query.filter_by(student_id=student.id).all()
            incident_count = len(incidents)
            avg_severity = np.mean([i.severity for i in incidents]) if incidents else 0.0
            
            # 3. Engagement
            engagement = StudentEngagement.query.filter_by(student_id=student.id).first()
            login_count = engagement.login_count if engagement else 0
            resource_usage = engagement.resource_access_count if engagement else 0
            participation = engagement.participation_score if engagement else 0.0
            
            # 4. Socio-academic
            finance = StudentFinance.query.filter_by(student_id=student.id).first()
            fee_balance = finance.balance if finance else 0.0
            referral_count = Referral.query.filter_by(student_id=student.id).count()
            
            # Feature Vector
            feature_row = [
                gpa, attendance, late_subs, missing_subs, 
                incident_count, avg_severity, 
                login_count, resource_usage, participation,
                fee_balance, referral_count
            ]
            
            # Label heuristic
            risk_label = 0 # Low
            if gpa < 1.5 or attendance < 65 or incident_count > 2 or fee_balance > 4000:
                risk_label = 3 # Critical
            elif gpa < 2.2 or attendance < 75 or incident_count > 1 or fee_balance > 2000:
                risk_label = 2 # High
            elif gpa < 2.8 or attendance < 85 or missing_subs > 1:
                risk_label = 1 # Medium
            
            features.append(feature_row)
            labels.append(risk_label)
        
        feature_names = [
            'gpa', 'attendance', 'late_submissions', 'missing_submissions',
            'incident_count', 'avg_severity',
            'login_count', 'resource_usage', 'participation_score',
            'fee_balance', 'referral_count'
        ]
        X = pd.DataFrame(features, columns=feature_names)
        y = np.array(labels)
        
        # Train Model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        # Save Model and Track Version
        joblib.dump(self.model, self.model_path)
        
        # Database Tracking
        version_name = f"v1.1-{datetime.utcnow().strftime('%Y%m%d%H%M')}"
        v = ModelVersion(name=version_name, accuracy=1.0, is_active=True) # Simplified accuracy for now
        db.session.add(v)
        db.session.flush()
        
        log = ModelTrainingLog(
            model_version_id=v.id,
            dataset_info=f"Trained on {len(students)} students with {len(feature_names)} features",
            metrics={'accuracy': 1.0, 'samples': len(students)}
        )
        db.session.add(log)
        
        # Feature Importance Tracking
        importances = self.model.feature_importances_
        for name, imp in zip(feature_names, importances):
            fi = FeatureImportance(model_version_id=v.id, feature_name=name, importance_score=float(imp))
            db.session.add(fi)
            
        db.session.commit()
        return True

    def _train_synthetic(self):
        # Updated synthetic data with more features
        data = {
            'gpa': [3.8, 3.5, 2.2, 1.8, 1.0, 2.8, 0.5, 3.2, 2.0, 3.9],
            'attendance': [98, 95, 75, 60, 40, 85, 20, 88, 70, 99],
            'late_submissions': [0, 1, 3, 5, 8, 2, 10, 1, 4, 0],
            'missing_submissions': [0, 0, 1, 3, 5, 1, 10, 0, 2, 0],
            'incident_count': [0, 0, 1, 2, 3, 0, 4, 0, 1, 0],
            'avg_severity': [0, 0, 2, 3, 4, 0, 5, 0, 2, 0],
            'login_count': [50, 45, 20, 10, 5, 30, 2, 40, 15, 55],
            'resource_usage': [100, 90, 40, 20, 10, 60, 4, 80, 30, 110],
            'participation_score': [10, 9, 5, 3, 1, 7, 0, 8, 4, 10],
            'fee_balance': [0, 0, 1000, 3000, 5000, 0, 6000, 0, 2000, 0],
            'referral_count': [0, 0, 0, 1, 1, 0, 2, 0, 1, 0],
            'risk_label': [0, 0, 1, 2, 3, 0, 3, 0, 2, 0]
        }
        df = pd.DataFrame(data)
        feature_names = [
            'gpa', 'attendance', 'late_submissions', 'missing_submissions',
            'incident_count', 'avg_severity',
            'login_count', 'resource_usage', 'participation_score',
            'fee_balance', 'referral_count'
        ]
        X = df[feature_names]
        y = df['risk_label']
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        joblib.dump(self.model, self.model_path)
        return True

    def predict_student_risk(self, student_id):
        from app.models.student import Student
        from app.models.risk import RiskPrediction, ModelVersion
        from app.services.temporal_feature_service import temporal_feature_service
        from app import db
        
        if not self.model and not self._load_model():
            self.train_model()
            
        student = Student.query.get(student_id)
        if not student:
            return None
            
        # 1. Get Temporal Features (Parity with training)
        features_dict = temporal_feature_service.get_student_features(student_id)
        
        # 2. Add categorical dummy support (though prediction usually lacks the categorical part initially)
        # We need to ensure the columns match the model's expected input
        X_pred = pd.DataFrame([features_dict])
        
        # Handle dummy columns if model was trained with them (intervention_type)
        # If model expects intervention_type columns, we add them as 0 for prediction context
        expected_cols = self.model.feature_names_in_ if hasattr(self.model, 'feature_names_in_') else []
        for col in expected_cols:
            if col not in X_pred.columns:
                X_pred[col] = 0
        
        # Ensure order matches training
        if len(expected_cols) > 0:
            X_pred = X_pred[expected_cols]
        
        # Fill NAs
        X_pred = X_pred.fillna(0)
        
        risk_level_idx = self.model.predict(X_pred)[0]
        probabilities = self.model.predict_proba(X_pred)[0]
        
        # Correctly map probability to the predicted class
        class_list = list(self.model.classes_)
        class_idx = class_list.index(risk_level_idx)
        probability = float(probabilities[class_idx])
        
        levels = ['Low', 'Medium', 'High', 'Critical']
        risk_level = levels[risk_level_idx]
        
        # Explainability (Basic heuristics for now)
        reasons = []
        gpa_30d = features_dict.get('gpa_avg_30d')
        if gpa_30d is not None and gpa_30d < 2.0: reasons.append("Low GPA trend detected")
        
        att_30d = features_dict.get('att_rate_30d')
        if att_30d is not None and att_30d < 75: reasons.append("Low attendance trend detected")
        
        inc_30d = features_dict.get('incidents_30d')
        if inc_30d is not None and inc_30d > 1: reasons.append("Recent behavioral incidents")
        
        # Get active model version
        active_version = ModelVersion.query.filter_by(is_active=True).order_by(ModelVersion.created_at.desc()).first()
        
        import uuid
        trace_id = str(uuid.uuid4())
        
        # Save prediction
        prediction = RiskPrediction(
            student_id=student.id,
            risk_level=risk_level,
            probability_score=probability,
            model_version_id=active_version.id if active_version else None,
            reasons={'factors': reasons},
            trace_id=trace_id
        )
        db.session.add(prediction)
        db.session.flush()

        # Emit Event
        from app.services.event_bus import event_bus
        event_bus.emit('RiskPredictionGenerated', {
            'student_id': student.id,
            'risk_level': risk_level,
            'probability': probability,
            'features': features_dict
        }, trace_id=trace_id)

        # Trigger Recommendations
        from app.services.intervention_service import intervention_service
        # Context data needs to be consistent with what engines expect
        context_data = features_dict.copy()
        context_data['trace_id'] = trace_id
        
        # Map temporal names back to what RuleEngine expects if necessary, 
        # or update RuleEngine. Let's keep RuleEngine using its expected names.
        context_data['gpa'] = features_dict.get('gpa_avg_30d') or student.gpa
        context_data['attendance'] = features_dict.get('att_rate_30d') or student.attendance
        context_data['incident_count'] = features_dict.get('incidents_30d') or 0
        
        intervention_service.generate_recommendations(student, prediction, context_data)
        
        student.risk_status = risk_level
        db.session.commit()
        
        return {
            'risk_level': risk_level,
            'probability': probability,
            'reasons': reasons,
            'factors': features_dict
        }

ai_service = RiskPredictionService()
