from app import create_app, db
from app.models.risk import InterventionTemplate

app = create_app()

def seed_templates():
    with app.app_context():
        templates = [
            {
                "name": "Attendance Counseling",
                "description": "One-on-one session with a counselor to discuss attendance barriers and solutions.",
                "intervention_type": "counseling",
                "priority": "High",
                "suggested_duration_days": 30,
                "responsible_role": "counselor"
            },
            {
                "name": "Parent Notification - Attendance",
                "description": "Send formal notification to parents regarding student's declining attendance.",
                "intervention_type": "warning",
                "priority": "Medium",
                "suggested_duration_days": 7,
                "responsible_role": "supervisor"
            },
            {
                "name": "Academic Tutoring Recommendation",
                "description": "Enroll student in specialized tutoring sessions for subjects with low grades.",
                "intervention_type": "tutoring",
                "priority": "High",
                "suggested_duration_days": 60,
                "responsible_role": "teacher"
            },
            {
                "name": "Study Plan Generation",
                "description": "Collaborate with the student to create a personalized study and submission plan.",
                "intervention_type": "mentorship",
                "priority": "Medium",
                "suggested_duration_days": 14,
                "responsible_role": "teacher"
            },
            {
                "name": "Behavior Improvement Plan",
                "description": "Formal plan to address repeated behavioral incidents with specific targets.",
                "intervention_type": "counseling",
                "priority": "Critical",
                "suggested_duration_days": 45,
                "responsible_role": "counselor"
            },
            {
                "name": "Finance Office Referral",
                "description": "Refer student to the finance office for scholarship review or payment counseling.",
                "intervention_type": "financial",
                "priority": "High",
                "suggested_duration_days": 15,
                "responsible_role": "finance"
            },
            {
                "name": "Mentor Assignment",
                "description": "Assign a senior student or staff mentor to improve engagement and outreach.",
                "intervention_type": "mentorship",
                "priority": "Medium",
                "suggested_duration_days": 90,
                "responsible_role": "supervisor"
            }
        ]
        
        for t_data in templates:
            existing = InterventionTemplate.query.filter_by(name=t_data['name']).first()
            if not existing:
                template = InterventionTemplate(**t_data)
                db.session.add(template)
                print(f"Created template: {t_data['name']}")
        
        db.session.commit()
        print("Intervention templates seeding completed!")

if __name__ == "__main__":
    seed_templates()
