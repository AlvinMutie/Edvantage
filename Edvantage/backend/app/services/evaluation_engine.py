from app.models.student import Student
from app.models.performance import Grade, Attendance
from app.models.risk import RiskRule, Intervention
from app import db

class EvaluationEngine:
    @staticmethod
    def evaluate_student(student_id):
        student = Student.query.get(student_id)
        if not student:
            return None
        
        # Fetch latest records
        grades = Grade.query.filter_by(student_id=student_id).all()
        attendance_records = Attendance.query.filter_by(student_id=student_id).all()
        
        # Calculate heuristics (e.g., average attendance, latest GPA)
        attendance_values = [100 if r.status == 'present' else 0 for r in attendance_records]
        grade_values = [r.score for r in grades]
        
        avg_attendance = sum(attendance_values) / len(attendance_values) if attendance_values else 100
        avg_grade = sum(grade_values) / len(grade_values) if grade_values else 100
        
        # Fetch rules
        rules = RiskRule.query.all()
        
        highest_risk = 'Low'
        risk_score = 0
        
        for rule in rules:
            triggered = False
            if rule.condition_type == 'attendance_low' and avg_attendance < rule.threshold:
                triggered = True
            elif rule.condition_type == 'gpa_low' and avg_grade < rule.threshold:
                triggered = True
            
            if triggered:
                # Map risk levels to scores for comparison
                levels = {'High': 3, 'Medium': 2, 'Low': 1}
                if levels.get(rule.risk_level, 0) > risk_score:
                    risk_score = levels[rule.risk_level]
                    highest_risk = rule.risk_level
        
        return {
            'student_id': student_id,
            'attendance': avg_attendance,
            'grade_average': avg_grade,
            'risk_level': highest_risk
        }
