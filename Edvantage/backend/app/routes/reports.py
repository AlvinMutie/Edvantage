from flask import Blueprint, jsonify, send_file
from app.models.student import Student
from app.models.assignment import Assignment
from flask_jwt_extended import jwt_required, get_jwt_identity
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/student-report/<int:student_id>', methods=['GET'])
@jwt_required()
def generate_student_report(student_id):
    """Generate PDF report for a specific student"""
    student = Student.query.get_or_404(student_id)
    
    # Create PDF in memory
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    # Styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#4F46E5'),
        spaceAfter=30,
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1F2937'),
        spaceAfter=12,
    )
    
    # Title
    title = Paragraph(f"Student Performance Report", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.2 * inch))
    
    # Student Info
    info_heading = Paragraph("Student Information", heading_style)
    elements.append(info_heading)
    
    info_data = [
        ['Student ID:', student.student_id],
        ['Name:', student.full_name],
        ['Department:', student.department or 'N/A'],
        ['Semester:', str(student.current_semester) if student.current_semester else 'N/A'],
        ['Email:', student.user.email if student.user else 'N/A']
    ]
    
    info_table = Table(info_data, colWidths=[2 * inch, 4 * inch])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#374151')),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Performance Metrics
    perf_heading = Paragraph("Performance Metrics", heading_style)
    elements.append(perf_heading)
    
    perf_data = [
        ['Metric', 'Value', 'Status'],
        ['GPA', f"{student.gpa:.2f}", get_status(student.gpa, 'gpa')],
        ['Attendance', f"{student.attendance:.1f}%", get_status(student.attendance, 'attendance')],
        ['Risk Status', student.risk_status, student.risk_status]
    ]
    
    perf_table = Table(perf_data, colWidths=[2 * inch, 2 * inch, 2 * inch])
    perf_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 11),
    ]))
    elements.append(perf_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Assignments
    assignments = Assignment.query.filter_by(student_id=student.id).limit(10).all()
    if assignments:
        assign_heading = Paragraph("Recent Assignments", heading_style)
        elements.append(assign_heading)
        
        assign_data = [['Course', 'Title', 'Score', 'Status']]
        for assignment in assignments:
            assign_data.append([
                assignment.course_name,
                assignment.title[:30] + '...' if len(assignment.title) > 30 else assignment.title,
                f"{assignment.score}/{assignment.max_score}" if assignment.score else 'N/A',
                assignment.status
            ])
        
        assign_table = Table(assign_data, colWidths=[1.5 * inch, 2.5 * inch, 1 * inch, 1 * inch])
        assign_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4F46E5')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
        ]))
        elements.append(assign_table)
    
    # Footer
    elements.append(Spacer(1, 0.5 * inch))
    footer = Paragraph(
        f"Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}<br/>EdVantage Student Performance System",
        styles['Normal']
    )
    elements.append(footer)
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    
    return send_file(
        buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'student_report_{student.student_id}_{datetime.now().strftime("%Y%m%d")}.pdf'
    )

def get_status(value, metric_type):
    """Helper to get status label based on value"""
    if metric_type == 'gpa':
        if value >= 3.5:
            return 'Excellent'
        elif value >= 3.0:
            return 'Good'
        elif value >= 2.0:
            return 'Fair'
        else:
            return 'Poor'
    elif metric_type == 'attendance':
        if value >= 90:
            return 'Excellent'
        elif value >= 80:
            return 'Good'
        elif value >= 70:
            return 'Fair'
        else:
            return 'Poor'
    return 'N/A'
