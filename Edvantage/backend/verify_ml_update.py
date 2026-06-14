from app import create_app, db
from app.services.ai_service import ai_service
from app.models.student import Student
from app.models.risk import RiskPrediction, ModelVersion

app = create_app()

def verify_ml():
    with app.app_context():
        print("Triggering Model Retraining with Multi-Factor Features...")
        ai_service.train_model()
        
        # Check if ModelVersion and FeatureImportance are populated
        version = ModelVersion.query.filter_by(is_active=True).order_by(ModelVersion.created_at.desc()).first()
        if version:
            print(f"Successfully tracked Model Version: {version.name}")
            print(f"Features tracked: {len(version.features)}")
            for fi in version.features:
                print(f" - {fi.feature_name}: {fi.importance_score:.4f}")
        
        print("\nPerforming Risk Predictions...")
        students = Student.query.all()
        for student in students:
            result = ai_service.predict_student_risk(student.id)
            print(f"\nStudent: {student.full_name}")
            print(f"Risk Level: {result['risk_level']} (Prob: {result['probability']:.2f})")
            print(f"Reasons: {', '.join(result['reasons']) if result['reasons'] else 'None'}")
            print(f"Factors: {result['factors']}")

if __name__ == "__main__":
    verify_ml()
