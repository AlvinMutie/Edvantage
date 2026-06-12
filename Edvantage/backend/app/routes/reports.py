from flask import Blueprint, jsonify, send_file
from app.models.student import Student
from app.models.assignment import Assignment
from app.models.audit_log import AuditLog
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

@reports_bp.route('/comprehensive/<int:student_id>', methods=['GET'])
@jwt_required()
def generate_comprehensive_report(student_id):
    """Generate a comprehensive PDF report including audit logs and performance trends"""
    student = Student.query.get_or_404(student_id)
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=22, textColor=colors.HexColor('#4338CA'), spaceAfter=20)
    elements.append(Paragraph(f"Comprehensive Performance Audit: {student.full_name}", title_style))
    
    # 1. Basic Info
    info_data = [
        ['ID', student.student_id],
        ['Dept', student.department],
        ['GPA', f"{student.gpa:.2f}"],
        ['Attendance', f"{student.attendance:.1f}%"],
        ['Risk Status', student.risk_status]
    ]
    t = Table(info_data, colWidths=[1.5*inch, 4.5*inch])
    t.setStyle(TableStyle([('GRID', (0,0), (-1,-1), 0.5, colors.grey), ('BACKGROUND', (0,0), (0,-1), colors.whitesmoke)]))
    elements.append(t)
    elements.append(Spacer(1, 0.2*inch))
    
    # 2. Performance Trends
    elements.append(Paragraph("Performance Summary", styles['Heading2']))
    trends_desc = f"Current GPA is {student.gpa}. Risk level is currently {student.risk_status}."
    elements.append(Paragraph(trends_desc, styles['Normal']))
    elements.append(Spacer(1, 0.2*inch))
    
    # 3. System Audit Logs
    elements.append(Paragraph("System Activity Logs", styles['Heading2']))
    logs = AuditLog.query.filter_by(target_type='Student', target_id=student.id).order_by(AuditLog.timestamp.desc()).limit(20).all()
    
    if logs:
        log_data = [['Timestamp', 'Action', 'User', 'Details']]
        for log in logs:
            log_data.append([
                log.timestamp.strftime('%Y-%m-%d %H:%M'),
                log.action,
                log.user.username if log.user else 'System',
                (log.details[:40] + '...') if log.details and len(log.details) > 40 else (log.details or '')
            ])
        log_table = Table(log_data, colWidths=[1.2*inch, 1.5*inch, 1*inch, 2.8*inch])
        log_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F3F4F6')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.silver),
            ('FONTSIZE', (0,0), (-1,-1), 8)
        ]))
        elements.append(log_table)
    else:
        elements.append(Paragraph("No recent audit activity found for this student.", styles['Italic']))

    # Footer
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph(f"Report ID: COMP-{student.id}-{int(datetime.now().timestamp())}", styles['Normal']))
    
    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', as_attachment=True, download_name=f'comprehensive_{student.student_id}.pdf')

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
