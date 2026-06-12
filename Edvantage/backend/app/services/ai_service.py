import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle
import os

class RiskPredictionService:
    def __init__(self):
        self.model = None
        self.model_path = 'student_risk_model.pkl'
        self._initialize_model()

    def _initialize_model(self):
        """
        Initializes and trains the model on real student data from the database.
        If no data is available, falls back to synthetic data.
        """
        if os.path.exists(self.model_path):
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                return
            except Exception:
                pass # Re-train if load fails

        # Import here to avoid circular imports
        from app import db
        from app.models.student import Student
        
        # Fetch all students from database
        students = Student.query.all()
        
        if len(students) < 5:
            # Fallback to synthetic data if insufficient real data
            print("⚠️ Insufficient student data. Using synthetic training set.")
            self._train_on_synthetic_data()
            return
        
        # Extract features from real students
        data = {
            'gpa': [],
            'attendance': [],
            'missed_deadlines': [],
            'risk_label': []
        }
        
        for student in students:
            # Extract GPA (default to 2.5 if None)
            gpa = student.gpa if student.gpa is not None else 2.5
            
            # Calculate attendance percentage (default to 85% if None)
            attendance = student.attendance if student.attendance is not None else 85.0
            
            # Missed deadlines placeholder (you can enhance this with actual data)
            missed_deadlines = 0  # TODO: Track this in Student model
            
            # Define risk criteria based on existing risk_status field
            # Or create heuristic: Low GPA (<2.0) OR Low Attendance (<70%)
            is_at_risk = 0
            if student.risk_status == 'At Risk':
                is_at_risk = 1
            elif gpa < 2.0 or attendance < 70:
                is_at_risk = 1
            
            data['gpa'].append(gpa)
            data['attendance'].append(attendance)
            data['missed_deadlines'].append(missed_deadlines)
            data['risk_label'].append(is_at_risk)
        
        df = pd.DataFrame(data)
        X = df[['gpa', 'attendance', 'missed_deadlines']]
        y = df['risk_label']
        
        # Train the model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        # Calculate and log accuracy
        predictions = self.model.predict(X)
        accuracy = (predictions == y).sum() / len(y) * 100
        print(f"✅ AI Model trained on {len(students)} real students. Accuracy: {accuracy:.1f}%")
        
        # Save model
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
    
    def _train_on_synthetic_data(self):
        """Fallback method using synthetic data"""
        data = {
            'gpa': [3.8, 3.5, 3.9, 2.2, 1.8, 2.5, 3.0, 1.5, 3.2, 2.0, 1.0, 2.8, 3.7, 0.5, 2.1],
            'attendance': [98, 95, 99, 75, 60, 80, 90, 50, 88, 70, 40, 85, 92, 20, 72],
            'missed_deadlines': [0, 1, 0, 3, 5, 2, 1, 6, 1, 4, 8, 2, 0, 10, 3],
            'risk_label': [0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1]
        }
        
        df = pd.DataFrame(data)
        X = df[['gpa', 'attendance', 'missed_deadlines']]
        y = df['risk_label']

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)

    def predict_risk(self, gpa, attendance, missed_deadlines):
        """
        Returns a probability of being 'At Risk' (0.0 to 1.0)
        """
        if not self.model:
            self._initialize_model()
            
        features = np.array([[gpa, attendance, missed_deadlines]])
        probability = self.model.predict_proba(features)[0][1] # Probability of class 1 (At Risk)
        
        # Simple Logic Augmentation (Hybrid AI)
        # If GPA is extremely low, force high risk even if model is uncertain
        if gpa < 1.0:
            probability = max(probability, 0.95)
            
        return round(probability * 100, 1)

ai_service = RiskPredictionService()
