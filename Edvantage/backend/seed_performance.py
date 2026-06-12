from app import create_app, db
from app.models.student import Student
from app.models.performance import PerformanceRecord

app = create_app()

def seed_performance():
    with app.app_context():
        student = Student.query.filter_by(student_id='ST1001').first()
        if not student:
            print("Student ST1001 not found. Run seed.py first.")
            return

        if PerformanceRecord.query.filter_by(student_id=student.id).first():
            print("Performance records already exist.")
            return

        print(f"Seeding records for {student.full_name}...")
        records = [
            PerformanceRecord(student_id=student.id, record_type='GPA', value=3.8, semester=1),
            PerformanceRecord(student_id=student.id, record_type='Attendance', value=95.0, semester=1),
            PerformanceRecord(student_id=student.id, record_type='GPA', value=3.2, semester=2),
            PerformanceRecord(student_id=student.id, record_type='Attendance', value=82.0, semester=2),
            PerformanceRecord(student_id=student.id, record_type='GPA', value=2.9, semester=3),
            PerformanceRecord(student_id=student.id, record_type='Attendance', value=78.0, semester=3),
        ]
        
        db.session.add_all(records)
        db.session.commit()
        print("Performance records added!")

if __name__ == '__main__':
    seed_performance()
