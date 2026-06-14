from flask import Blueprint, jsonify, request
from app.models.student import Student, Department
from app.models.assignment import Assignment
from app import db
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from datetime import datetime, timedelta
import numpy as np

analytics_bp = Blueprint('analytics', __name__)

def is_at_risk_filter():
    return Student.risk_status.in_(['High', 'Critical'])

@analytics_bp.route('/cohort-analysis', methods=['GET'])
@jwt_required()
def cohort_analysis():
    """Compare student groups by department or semester"""
    group_by = request.args.get('group_by', 'department')
    
    if group_by == 'department':
        cohorts = db.session.query(
            Department.name,
            func.count(Student.id).label('count'),
            func.avg(Student.gpa).label('avg_gpa'),
            func.avg(Student.attendance).label('avg_attendance'),
            func.sum(func.case((is_at_risk_filter(), 1), else_=0)).label('at_risk_count')
        ).join(Department, Student.department_id == Department.id).group_by(Department.name).all()
        
        results = []
        for cohort in cohorts:
            results.append({
                'name': cohort.name,
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
            func.sum(func.case((is_at_risk_filter(), 1), else_=0)).label('at_risk_count')
        ).group_by(Student.current_semester).all()
        
        results = []
        for cohort in cohorts:
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
    students = Student.query.filter(Student.gpa.isnot(None)).all()
    if len(students) < 5:
        return jsonify({"msg": "Insufficient data for predictions"}), 400
    
    current_avg_gpa = sum([s.gpa for s in students]) / len(students)
    current_avg_attendance = sum([s.attendance for s in students]) / len(students)
    
    gpa_trend = 0.05 if current_avg_gpa > 3.0 else -0.05
    attendance_trend = 1.0 if current_avg_attendance > 85 else -2.0
    
    predictions = []
    for i in range(1, 7):
        month_label = (datetime.now() + timedelta(days=30*i)).strftime('%b %Y')
        predicted_gpa = max(0, min(4.0, current_avg_gpa + (gpa_trend * i)))
        predicted_attendance = max(0, min(100, current_avg_attendance + (attendance_trend * i)))
        
        predictions.append({
            'period': month_label,
            'predicted_gpa': round(predicted_gpa, 2),
            'predicted_attendance': round(predicted_attendance, 1),
            'confidence': max(50, 95 - (i * 5))
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
    heatmap_data = db.session.query(
        Department.name,
        Student.current_semester,
        func.count(Student.id).label('total'),
        func.sum(func.case((is_at_risk_filter(), 1), else_=0)).label('at_risk')
    ).join(Department, Student.department_id == Department.id).group_by(Department.name, Student.current_semester).all()
    
    heatmap = {}
    departments = set()
    semesters = set()
    
    for row in heatmap_data:
        dept = row.name
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
            'intensity': min(100, risk_percentage)
        }
    
    return jsonify({
        'heatmap': heatmap,
        'departments': sorted(list(departments)),
        'semesters': sorted(list(semesters))
    }), 200

@analytics_bp.route('/overview-stats', methods=['GET'])
@jwt_required()
def overview_stats():
    total_students = Student.query.count()
    at_risk_students = Student.query.filter(is_at_risk_filter()).count()
    
    avg_stats = db.session.query(
        func.avg(Student.gpa).label('avg_gpa'),
        func.avg(Student.attendance).label('avg_attendance')
    ).first()
    
    dept_stats = db.session.query(
        Department.name,
        func.count(Student.id).label('count')
    ).join(Department, Student.department_id == Department.id).group_by(Department.name).all()
    
    return jsonify({
        'total_students': total_students,
        'at_risk_students': at_risk_students,
        'at_risk_percentage': round((at_risk_students / total_students) * 100, 1) if total_students > 0 else 0,
        'avg_gpa': round(avg_stats.avg_gpa, 2) if avg_stats.avg_gpa else 0,
        'avg_attendance': round(avg_stats.avg_attendance, 1) if avg_stats.avg_attendance else 0,
        'departments': [{'name': d.name, 'count': d.count} for d in dept_stats]
    }), 200
