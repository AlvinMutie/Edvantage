import sys
import os
import random
from datetime import datetime, timedelta

# Add the project root to sys.path
sys.path.append(os.getcwd())
sys.path.append(os.path.join(os.getcwd(), 'Edvantage', 'backend'))

from app import create_app, db
from app.models.student import Student
from app.models.risk import RiskPrediction, InterventionRecommendation, Intervention, InterventionOutcome, ModelVersion, ModelTrainingLog, InterventionTemplate
from app.services.ai_service import ai_service
from app.services.intervention_service import intervention_service
from app.services.analytics_service import analytics_service
from app.services.retraining_service import model_retraining_service
from app.services.model_registry_service import model_registry_service
from sqlalchemy import desc

app = create_app()

def run_stress_test():
    with app.app_context():
        print("--- STARTING PRODUCTION HARDENING STRESS TEST ---")
        
        # 1. INITIAL SEED (Ensure we have enough data)
        print("\nStep 1: Initializing Data...")
        # (Assuming seed_ml_data and seed_interventions were already run)
        
        results = []
        
        # 2. RUN 10 RETRAINING CYCLES
        print("\nStep 2: Running 10 Retraining Cycles...")
        for cycle in range(1, 11):
            print(f"\nCycle {cycle}/10:")
            
            # Generate new data for this cycle
            generate_batch_outcomes(5)
            
            # Trigger retraining
            success = model_retraining_service.trigger_retraining(trigger_type='stress_test')
            
            if success:
                latest_log = ModelTrainingLog.query.order_by(desc(ModelTrainingLog.trained_at)).first()
                metrics = latest_log.metrics if latest_log else {}
                acc = metrics.get('accuracy', 0.0)
                f1 = metrics.get('f1', 0.0)
                print(f"  Cycle {cycle} Success. Accuracy: {acc:.2f}, F1: {f1:.2f}")
                results.append({'cycle': cycle, 'accuracy': acc, 'f1': f1, 'status': 'PASS'})
            else:
                print(f"  Cycle {cycle} FAILED (Insufficient data or error)")
                results.append({'cycle': cycle, 'status': 'FAIL'})

        # 3. ROLLBACK SAFETY TEST
        print("\nStep 3: Rollback Safety Test...")
        
        print("Simulating performance collapse...")
        from unittest.mock import patch
        with patch('app.services.learning_evaluation_service.learning_evaluation_service.evaluate_model') as mock_eval:
            mock_eval.return_value = {'accuracy': 0.1, 'precision': 0.1, 'recall': 0.1, 'f1': 0.1}
            
            generate_batch_outcomes(5)
            success = model_retraining_service.trigger_retraining(trigger_type='rollback_test')
            
            if not success:
                print("  Rollback Triggered CorrectLY (Model rejected due to poor performance)")
                rollback_status = "PASS"
            else:
                print("  Rollback FAILED (Bad model was accepted)")
                rollback_status = "FAIL"

        # 4. DRIFT RESPONSE TEST
        print("\nStep 4: Drift Response Test...")
        
        student = Student.query.first()
        if student:
            res1 = ai_service.predict_student_risk(student.id)
            print(f"  Base Risk: {res1['risk_level']}")
            
            from app.models.performance import Grade, Attendance
            from app.models.student import Subject
            subject = Subject.query.first()
            if subject:
                bad_grade = Grade(student_id=student.id, subject_id=subject.id, assessment_type='Exam', score=0, max_score=100)
                bad_att = Attendance(student_id=student.id, subject_id=subject.id, date=datetime.utcnow().date(), status='absent')
                db.session.add(bad_grade)
                db.session.add(bad_att)
                db.session.commit()
                
                res2 = ai_service.predict_student_risk(student.id)
                print(f"  Drifted Risk: {res2['risk_level']}")
                
                if res1['risk_level'] != res2['risk_level']:
                    print("  System ADAPTED to drift (Prediction changed)")
                    drift_status = "Adaptive"
                else:
                    print("  System was INSENSITIVE to drift (Prediction unchanged)")
                    drift_status = "Observational only"
            else:
                drift_status = "NOT TESTED (Incomplete student data)"
        else:
            drift_status = "NOT TESTED (No students)"

        # FINAL REPORT
        print("\n--- STRESS TEST SUMMARY ---")
        print("| Cycle | Accuracy | F1 Score | Status |")
        print("|-------|----------|----------|--------|")
        for r in results:
            acc = f"{r.get('accuracy', 0.0):.2f}" if 'accuracy' in r else "N/A"
            f1 = f"{r.get('f1', 0.0):.2f}" if 'f1' in r else "N/A"
            print(f"| {r['cycle']:5} | {acc:8} | {f1:8} | {r['status']:6} |")
        
        print(f"\nRollback Safety Test: {rollback_status}")
        print(f"Drift Response: {drift_status}")

def generate_batch_outcomes(n):
    from app.models.user import User
    supervisor = User.query.filter_by(role='supervisor').first()
    if not supervisor:
        supervisor = User.query.first()
        
    students = Student.query.all()
    templates = InterventionTemplate.query.all()
    
    if not students or not templates:
        print("  Error: No students or templates for data generation.")
        return

    for _ in range(n):
        student = random.choice(students)
        template = random.choice(templates)
        
        ai_service.predict_student_risk(student.id)
        prediction = RiskPrediction.query.filter_by(student_id=student.id).order_by(desc(RiskPrediction.created_at)).first()
        
        rec = InterventionRecommendation(
            student_id=student.id,
            risk_prediction_id=prediction.id,
            template_id=template.id,
            status='pending',
            trace_id=prediction.trace_id
        )
        db.session.add(rec)
        db.session.flush()
        
        intervention = intervention_service.approve_recommendation(rec.id, supervisor.id)
        
        outcome_data = {
            'notes': "Stress test outcome",
            'success_rating': random.randint(1, 5)
        }
        analytics_service.record_outcome(intervention.id, outcome_data, supervisor.id)

if __name__ == "__main__":
    run_stress_test()
