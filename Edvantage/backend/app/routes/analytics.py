from flask import Blueprint, jsonify, request
from app.models.student import Student
from app.models.assignment import Assignment
from app import db
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from datetime import datetime, timedelta
import numpy as np

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/cohort-analysis', methods=['GET'])
@jwt_required()
def cohort_analysis():
    """Compare student groups by department or semester"""
    group_by = request.args.get('group_by', 'department')  # department or semester
    
    if group_by == 'department':
        cohorts = db.session.query(
            Student.department,
            func.count(Student.id).label('count'),
            func.avg(Student.gpa).label('avg_gpa'),
            func.avg(Student.attendance).label('avg_attendance'),
            func.sum(func.case((Student.risk_status == 'At Risk', 1), else_=0)).label('at_risk_count')
        ).group_by(Student.department).all()
        
        results = []
        for cohort in cohorts:
            if cohort.department:
                results.append({
                    'name': cohort.department,
                    'total_students': cohort.count,
                    'avg_gpa': round(cohort.avg_gpa, 2) if cohort.avg_gpa else 0,
                    'avg_attendance': round(cohort.avg_attendance, 1) if cohort.avg_attendance else 0,
                    'at_risk_count': cohort.at_risk_count,
                    'at_risk_percentage': round((cohort.at_risk_count / cohort.count) * 100, 1) if cohort.count > 0 else 0
                })
    
    elif group_by == 'semester':
        cohorts = db.session.query(
            Student.current_semester,
            func.count(Student.id).label('count'),
            func.avg(Student.gpa).label('avg_gpa'),
            func.avg(Student.attendance).label('avg_attendance'),
            func.sum(func.case((Student.risk_status == 'At Risk', 1), else_=0)).label('at_risk_count')
        ).group_by(Student.current_semester).all()
        
        results = []
        for cohort in cohorts:
            if cohort.current_semester:
                results.append({
                    'name': f'Semester {cohort.current_semester}',
                    'total_students': cohort.count,
                    'avg_gpa': round(cohort.avg_gpa, 2) if cohort.avg_gpa else 0,
                    'avg_attendance': round(cohort.avg_attendance, 1) if cohort.avg_attendance else 0,
                    'at_risk_count': cohort.at_risk_count,
                    'at_risk_percentage': round((cohort.at_risk_count / cohort.count) * 100, 1) if cohort.count > 0 else 0
                })
    
    return jsonify({'cohorts': results}), 200

@analytics_bp.route('/trend-prediction', methods=['GET'])
@jwt_required()
def trend_prediction():
    """Predict future GPA and attendance trends based on current data"""
    
    # Get all students with valid data
    students = Student.query.filter(
        Student.gpa.isnot(None),
        Student.attendance.isnot(None)
    ).all()
    
    if len(students) < 5:
        return jsonify({"msg": "Insufficient data for predictions"}), 400
    
    # Calculate current averages
    current_avg_gpa = sum([s.gpa for s in students]) / len(students)
    current_avg_attendance = sum([s.attendance for s in students]) / len(students)
    
    # Simple linear prediction (can be enhanced with actual time-series data)
    # For demo: predict slight decline if average is low, improvement if high
    gpa_trend = 0.05 if current_avg_gpa > 3.0 else -0.05
    attendance_trend = 1.0 if current_avg_attendance > 85 else -2.0
    
    # Generate predictions for next 6 months
    predictions = []
    for i in range(1, 7):
        month_label = (datetime.now() + timedelta(days=30*i)).strftime('%b %Y')
        predicted_gpa = max(0, min(4.0, current_avg_gpa + (gpa_trend * i)))
        predicted_attendance = max(0, min(100, current_avg_attendance + (attendance_trend * i)))
        
        predictions.append({
            'period': month_label,
            'predicted_gpa': round(predicted_gpa, 2),
            'predicted_attendance': round(predicted_attendance, 1),
            'confidence': max(50, 95 - (i * 5))  # Confidence decreases over time
        })
    
    return jsonify({
        'current': {
            'avg_gpa': round(current_avg_gpa, 2),
            'avg_attendance': round(current_avg_attendance, 1),
            'total_students': len(students)
        },
        'predictions': predictions
    }), 200

@analytics_bp.route('/risk-heatmap', methods=['GET'])
@jwt_required()
def risk_heatmap():
    """Generate heatmap data showing risk distribution across departments and semesters"""
    
    # Query students grouped by department and semester
    heatmap_data = db.session.query(
        Student.department,
        Student.current_semester,
        func.count(Student.id).label('total'),
        func.sum(func.case((Student.risk_status == 'At Risk', 1), else_=0)).label('at_risk')
    ).group_by(Student.department, Student.current_semester).all()
    
    # Organize data for heatmap
    heatmap = {}
    departments = set()
    semesters = set()
    
    for row in heatmap_data:
        if row.department and row.current_semester:
            dept = row.department
            sem = row.current_semester
            risk_percentage = (row.at_risk / row.total) * 100 if row.total > 0 else 0
            
            departments.add(dept)
            semesters.add(sem)
            
            if dept not in heatmap:
                heatmap[dept] = {}
            
            heatmap[dept][sem] = {
                'total': row.total,
                'at_risk': row.at_risk,
                'risk_percentage': round(risk_percentage, 1),
                'intensity': min(100, risk_percentage)  # For color intensity
            }
    
    return jsonify({
        'heatmap': heatmap,
        'departments': sorted(list(departments)),
        'semesters': sorted(list(semesters))
    }), 200

@analytics_bp.route('/intervention-success', methods=['GET'])
@jwt_required()
def intervention_success():
    """Track effectiveness of interventions (placeholder - needs intervention logging)"""
    
    # This would require intervention tracking implementation
    # For now, return sample data structure
    
    return jsonify({
        'total_interventions': 0,
        'successful_interventions': 0,
        'success_rate': 0,
        'avg_improvement': 0,
        'msg': 'Intervention tracking not yet implemented'
    }), 200

@analytics_bp.route('/overview-stats', methods=['GET'])
@jwt_required()
def overview_stats():
    """Get comprehensive system-wide statistics"""
    
    total_students = Student.query.count()
    at_risk_students = Student.query.filter_by(risk_status='At Risk').count()
    
    avg_stats = db.session.query(
        func.avg(Student.gpa).label('avg_gpa'),
        func.avg(Student.attendance).label('avg_attendance')
    ).first()
    
    # Department breakdown
    dept_stats = db.session.query(
        Student.department,
        func.count(Student.id).label('count')
    ).group_by(Student.department).all()
    
    return jsonify({
        'total_students': total_students,
        'at_risk_students': at_risk_students,
        'at_risk_percentage': round((at_risk_students / total_students) * 100, 1) if total_students > 0 else 0,
        'avg_gpa': round(avg_stats.avg_gpa, 2) if avg_stats.avg_gpa else 0,
        'avg_attendance': round(avg_stats.avg_attendance, 1) if avg_stats.avg_attendance else 0,
        'departments': [{'name': d.department, 'count': d.count} for d in dept_stats if d.department]
    }), 200
