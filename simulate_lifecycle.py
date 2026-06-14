import sys
import os
from datetime import datetime, timedelta

# Add the project root to sys.path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'Edvantage', 'backend'))

from app import create_app, db
from app.models.student import Student
from app.models.risk import RiskPrediction, InterventionRecommendation, Intervention, InterventionOutcome, ModelVersion, ModelTrainingLog
from app.services.ai_service import ai_service
from app.services.intervention_service import intervention_service
from app.services.analytics_service import analytics_service
from app.services.retraining_service import model_retraining_service

app = create_app()

def simulate_lifecycle():
    with app.app_context():
        print("--- STARTING PRODUCTION REALITY SIMULATION ---")
        
        # 1. PREDICT RISK
        print("\nStep 1: Predicting Risk...")
        students = Student.query.all()
        if not students:
            print("No students found. Seed the database first.")
            return

        for student in students:
            print(f"Predicting for {student.full_name}...")
            ai_service.predict_student_risk(student.id)
        
        predictions = RiskPrediction.query.count()
        print(f"Total Predictions in DB: {predictions}")

        # 2. CHECK RECOMMENDATIONS
        print("\nStep 2: Checking Recommendations...")
        recommendations = InterventionRecommendation.query.filter_by(status='pending').all()
        print(f"Pending Recommendations: {len(recommendations)}")
        
        if not recommendations:
            print("No recommendations generated. Check engine logic.")
            return

        # 3. APPLY INTERVENTIONS (APPROVE)
        print("\nStep 3: Applying Interventions...")
        # Get a supervisor ID (just use the first user for demo)
        from app.models.user import User
        supervisor = User.query.filter_by(role='supervisor').first()
        if not supervisor:
            supervisor = User.query.first()
            
        interventions = []
        for rec in recommendations:
            print(f"Approving recommendation {rec.id} for student {rec.student.full_name}")
            intervention = intervention_service.approve_recommendation(rec.id, supervisor.id)
            if intervention:
                interventions.append(intervention)
        
        print(f"Active Interventions Created: {len(interventions)}")

        # 4. RECORD OUTCOMES
        print("\nStep 4: Recording Outcomes (Triggering Loop)...")
        # We need 5 outcomes to trigger retraining based on retraining_service.py logic
        import random 
        outcome_count = 0
        for i, intervention in enumerate(interventions):
            print(f"Recording outcome for intervention {intervention.id}...")
            outcome_data = {
                'notes': f"Completed intervention {i+1}",
                'success_rating': random.randint(3, 5)
            }
            outcome = analytics_service.record_outcome(intervention.id, outcome_data, supervisor.id)
            if outcome:
                outcome_count += 1
            
            if outcome_count >= 5:
                break
        
        print(f"Outcomes Recorded: {outcome_count}")

        # 5. CHECK RETRAINING
        print("\nStep 5: Checking if Retraining was triggered...")
        latest_log = ModelTrainingLog.query.order_by(ModelTrainingLog.trained_at.desc()).first()
        if latest_log:
            print(f"Retraining DETECTED at {latest_log.trained_at}")
            print(f"Retraining Info: {latest_log.dataset_info}")
            print(f"Validation Metrics: {latest_log.metrics}")
        else:
            print("NO RETRAINING DETECTED.")

        # 6. CHECK INTELLIGENCE DASHBOARD
        print("\nStep 6: Checking Intelligence Dashboard Metrics...")
        from app.services.model_registry_service import model_registry_service
        from app.services.learning_evaluation_service import learning_evaluation_service
        
        versions = model_registry_service.get_version_history()
        print(f"Total Model Versions: {len(versions)}")
        
        success_trend = learning_evaluation_service.get_intervention_success_trend()
        print(f"Intervention Success Trend (Moving Avg): {success_trend}")

        # 7. VERIFY PRODUCTION CONTINUITY
        print("\nStep 7: Verifying Production Continuity (Next Prediction)...")
        try:
            student = Student.query.first()
            print(f"Attempting prediction for {student.full_name} using the new model...")
            result = ai_service.predict_student_risk(student.id)
            print(f"Prediction SUCCESSFUL: {result['risk_level']}")
        except Exception as e:
            print(f"CRITICAL FAILURE: Prediction failed after retraining!")
            print(f"Error: {e}")

if __name__ == "__main__":
    simulate_lifecycle()
