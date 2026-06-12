from app import create_app, db
from app.models.student import Student
from app.schemas import StudentSchema
from flask import jsonify

app = create_app()

def test_schema_dump():
    with app.app_context():
        student = Student.query.filter_by(student_id='ST1001').first()
        if not student:
            print("Student ST1001 not found")
            return

        schema = StudentSchema()
        try:
            dump = schema.dump(student)
            print("--- DATA DUMP START ---")
            print(dump)
            print("--- DATA DUMP END ---")
            
            if 'performance_records' in dump:
                 print(f"Performance Records Found: {len(dump['performance_records'])}")
            else:
                 print("ERROR: performance_records field MISSING in dump.")

        except Exception as e:
            print(f"Schema dump failed: {e}")

if __name__ == '__main__':
    test_schema_dump()
