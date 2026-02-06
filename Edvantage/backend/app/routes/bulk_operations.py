from flask import Blueprint, jsonify, request, send_file
from app.models.student import Student
from app.models.user import User
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd
from io import BytesIO
from datetime import datetime
import csv

bulk_bp = Blueprint('bulk', __name__)

@bulk_bp.route('/import-students', methods=['POST'])
@jwt_required()
def import_students():
    """Import students from CSV file"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    if 'file' not in request.files:
        return jsonify({"msg": "No file provided"}), 400
    
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({"msg": "Only CSV files are supported"}), 400
    
    try:
        # Read CSV
        df = pd.read_csv(file)
        
        # Validate required columns
        required_cols = ['student_id', 'full_name', 'username', 'email', 'department']
        missing_cols = [col for col in required_cols if col not in df.columns]
        
        if missing_cols:
            return jsonify({"msg": f"Missing required columns: {', '.join(missing_cols)}"}), 400
        
        success_count = 0
        error_count = 0
        errors = []
        
        for index, row in df.iterrows():
            try:
                # Check if user already exists
                existing_user = User.query.filter_by(email=row['email']).first()
                if existing_user:
                    errors.append(f"Row {index + 2}: Email {row['email']} already exists")
                    error_count += 1
                    continue
                
                # Create user account
                new_user = User(
                    username=row['username'],
                    email=row['email'],
                    role='student'
                )
                new_user.set_password(row.get('password', 'Student@123'))  # Default password
                db.session.add(new_user)
                db.session.flush()  # Get user ID
                
                # Create student profile
                new_student = Student(
                    user_id=new_user.id,
                    student_id=row['student_id'],
                    full_name=row['full_name'],
                    department=row['department'],
                    current_semester=int(row.get('current_semester', 1)),
                    gpa=float(row.get('gpa', 0.0)),
                    attendance=float(row.get('attendance', 100.0))
                )
                db.session.add(new_student)
                success_count += 1
                
            except Exception as e:
                error_count += 1
                errors.append(f"Row {index + 2}: {str(e)}")
                db.session.rollback()
                continue
        
        # Commit all successful imports
        db.session.commit()
        
        return jsonify({
            "msg": f"Import completed: {success_count} successful, {error_count} failed",
            "success_count": success_count,
            "error_count": error_count,
            "errors": errors[:10]  # Return first 10 errors
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Import failed: {str(e)}"}), 500

@bulk_bp.route('/export-students', methods=['GET'])
@jwt_required()
def export_students():
    """Export all students to Excel file"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if user.role not in ['admin', 'superadmin']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    try:
        students = Student.query.all()
        
        # Prepare data
        data = []
        for student in students:
            data.append({
                'Student ID': student.student_id,
                'Full Name': student.full_name,
                'Email': student.user.email if student.user else '',
                'Department': student.department,
                'Semester': student.current_semester,
                'GPA': student.gpa,
                'Attendance': student.attendance,
                'Risk Status': student.risk_status
            })
        
        # Create DataFrame
        df = pd.DataFrame(data)
        
        # Create Excel file in memory
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Students')
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'students_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
        )
        
    except Exception as e:
        return jsonify({"msg": f"Export failed: {str(e)}"}), 500

@bulk_bp.route('/download-template', methods=['GET'])
def download_template():
    """Download CSV template for student import"""
    template_data = {
        'student_id': ['STU001', 'STU002'],
        'full_name': ['John Doe', 'Jane Smith'],
        'username': ['johndoe', 'janesmith'],
        'email': ['john@example.com', 'jane@example.com'],
        'department': ['Computer Science', 'Engineering'],
        'current_semester': [3, 2],
        'gpa': [3.5, 3.8],
        'attendance': [95.0, 92.5],
        'password': ['optional', 'optional']
    }
    
    df = pd.DataFrame(template_data)
    
    output = BytesIO()
    df.to_csv(output, index=False)
    output.seek(0)
    
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name='student_import_template.csv'
    )
