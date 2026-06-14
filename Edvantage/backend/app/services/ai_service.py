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
        Trains the Random Forest model on student data.
        """
        from app import db
        from app.models.student import Student
        from app.models.performance import Grade, Attendance
        from app.models.assignment import Submission
        
        students = Student.query.all()
        if len(students) < 5:
            # Synthetic fallback for cold start
            return self._train_synthetic()

        features = []
        labels = []
        
        for student in students:
            # Feature extraction
            gpa = student.gpa or 0.0
            attendance = student.attendance or 0.0
            
            # Additional features from related tables
            late_submissions = Submission.query.filter_by(student_id=student.id, status='late').count()
            missing_submissions = Submission.query.filter_by(student_id=student.id, status='missing').count()
            
            # Simple heuristic for labeling training data
            # 0: Low, 1: Medium, 2: High, 3: Critical
            risk_label = 0
            if gpa < 1.0 or attendance < 50:
                risk_label = 3
            elif gpa < 2.0 or attendance < 70:
                risk_label = 2
            elif gpa < 2.5 or attendance < 85:
                risk_label = 1
            
            features.append([gpa, attendance, late_submissions, missing_submissions])
            labels.append(risk_label)
        
        X = pd.DataFrame(features, columns=['gpa', 'attendance', 'late_submissions', 'missing_submissions'])
        y = np.array(labels)
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        joblib.dump(self.model, self.model_path)
        return True

    def _train_synthetic(self):
        # Synthetic data for initial boot
        data = {
            'gpa': [3.8, 3.5, 2.2, 1.8, 1.0, 2.8, 0.5, 3.2, 2.0, 3.9],
            'attendance': [98, 95, 75, 60, 40, 85, 20, 88, 70, 99],
            'late_submissions': [0, 1, 3, 5, 8, 2, 10, 1, 4, 0],
            'missing_submissions': [0, 0, 1, 3, 5, 1, 10, 0, 2, 0],
            'risk_label': [0, 0, 1, 2, 3, 0, 3, 0, 2, 0]
        }
        df = pd.DataFrame(data)
        X = df[['gpa', 'attendance', 'late_submissions', 'missing_submissions']]
        y = df['risk_label']
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        joblib.dump(self.model, self.model_path)
        return True

    def predict_student_risk(self, student_id):
        from app.models.student import Student
        from app.models.performance import Grade, Attendance
        from app.models.assignment import Submission
        from app.models.risk import RiskPrediction
        from app import db
        
        if not self.model and not self._load_model():
            self.train_model()
            
        student = Student.query.get(student_id)
        if not student:
            return None
            
        gpa = student.gpa or 0.0
        attendance = student.attendance or 0.0
        late_submissions = Submission.query.filter_by(student_id=student.id, status='late').count()
        missing_submissions = Submission.query.filter_by(student_id=student.id, status='missing').count()
        
        features = np.array([[gpa, attendance, late_submissions, missing_submissions]])
        risk_level_idx = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        
        levels = ['Low', 'Medium', 'High', 'Critical']
        risk_level = levels[risk_level_idx]
        probability = float(probabilities[risk_level_idx])
        
        # Explainability
        reasons = []
        if gpa < 2.0: reasons.append("Low GPA detected")
        if attendance < 75: reasons.append("Low attendance detected")
        if late_submissions > 3: reasons.append("Frequent late submissions")
        if missing_submissions > 2: reasons.append("Missing assignments detected")
        
        # Save prediction
        prediction = RiskPrediction(
            student_id=student.id,
            risk_level=risk_level,
            probability_score=probability,
            model_version='1.0.0',
            reasons={'factors': reasons}
        )
        db.session.add(prediction)
        
        # Update student status
        student.risk_status = risk_level
        db.session.commit()
        
        return {
            'risk_level': risk_level,
            'probability': probability,
            'reasons': reasons
        }

ai_service = RiskPredictionService()
