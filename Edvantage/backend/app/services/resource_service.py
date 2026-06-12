from app.models.student import Student

def get_recommendations(student_id):
    student = Student.query.get(student_id)
    if not student:
        return []
    
    recommendations = []
    
    if student.gpa < 2.5:
        recommendations.append({
            "title": "Effective Study Skills",
            "url": "https://www.coursera.org/learn/learning-how-to-learn",
            "category": "Academic Support"
        })
        recommendations.append({
            "title": "Mastering GPA: A Guide",
            "url": "https://www.khanacademy.org/college-careers-more/college-admissions/after-youre-admitted/staying-on-track-academically/a/the-gpa-explained",
            "category": "Academic Support"
        })
        
    if student.attendance < 70:
        recommendations.append({
            "title": "Time Management Essentials",
            "url": "https://www.edx.org/learn/time-management",
            "category": "Soft Skills"
        })
        recommendations.append({
            "title": "Importance of Attendance",
            "url": "https://www.attendanceworks.org/the-problem/why-it-matters/",
            "category": "Counseling"
        })
        
    if student.risk_status == 'At Risk':
        recommendations.append({
            "title": "Academic Counseling Services",
            "url": "#",
            "category": "Institutional Support"
        })
        
    # Default recommendations if everything is fine or to supplement
    if not recommendations:
        recommendations.append({
            "title": "Advanced Research Methods",
            "url": "https://www.futurelearn.com/subjects/study-skills-courses",
            "category": "Excellence"
        })
        
    return recommendations
