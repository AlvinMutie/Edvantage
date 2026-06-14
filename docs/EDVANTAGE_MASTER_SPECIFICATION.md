# EDVANTAGE

## Intelligent Student Performance Monitoring & Intervention System (SPMIS)

# PROJECT OVERVIEW

EdVantage is an AI-powered Student Performance Monitoring & Intervention System designed to help educational institutions identify academically at-risk students early, implement targeted interventions, monitor outcomes, and improve overall student success.

The platform combines:

* Student Information Management
* Academic Performance Analytics
* Machine Learning Risk Prediction
* Intervention Tracking
* Parent Engagement
* Counseling Management
* Communication Systems
* Institutional Analytics

The goal is to move beyond traditional academic record systems by providing predictive intelligence and actionable intervention recommendations.

---

# TECHNICAL STACK

## Frontend

* React 19
* Vite
* Tailwind CSS 4
* Recharts
* TanStack Query
* React Context API
* Lucide React

## Backend

* Python 3.13
* Flask 3.1.3
* Flask JWT Extended
* Flask SocketIO
* SQLAlchemy
* PostgreSQL
* SQLite (development)

## AI / Machine Learning

* scikit-learn
* pandas
* numpy
* joblib

Primary model:

* Random Forest Classifier

Future Models:

* XGBoost
* LightGBM
* Logistic Regression

---

# SYSTEM OBJECTIVES

The system must:

1. Monitor academic performance.
2. Predict at-risk students.
3. Track interventions.
4. Improve student retention.
5. Improve graduation rates.
6. Support evidence-based decision making.
7. Facilitate communication between stakeholders.
8. Provide actionable recommendations.
9. Continuously improve prediction accuracy through retraining.

---

# USER ROLES

## Superadmin

Responsibilities:

* Manage institutions
* Manage administrators
* View audit logs
* Manage permissions
* Force password resets
* Monitor system health
* Send global announcements

---

## Admin

Responsibilities:

* Manage school profile
* Configure AI settings
* Configure risk thresholds
* Manage users
* Manage courses
* Manage semesters
* Manage departments
* Manage academic years
* Link students to parents
* Trigger model retraining

---

## Teacher

Responsibilities:

* Record grades
* Record attendance
* Manage assignments
* Create assessments
* Refer students for intervention
* View class performance

---

## Supervisor

Responsibilities:

* Monitor assigned students
* View risk predictions
* Create interventions
* Follow up interventions
* Generate reports
* Communicate with students

---

## Counselor

Responsibilities:

* Receive referrals
* Schedule counseling sessions
* Record counseling notes
* Create action plans
* Monitor counseling outcomes

---

## Parent

Responsibilities:

* View student performance
* View attendance
* View risk status
* Receive alerts
* Communicate with supervisors

---

## Student

Responsibilities:

* View dashboard
* Track academic progress
* View recommendations
* Participate in interventions
* Communicate with supervisors
* Earn badges

---

# CORE MODULES

## User Management

Features:

* Registration
* Login
* JWT Authentication
* Password Reset
* Role Based Access Control
* Account Locking
* Multi-Factor Authentication
* Session Tracking

---

## Student Management

Features:

* Student Profiles
* Student Registration
* Admission Records
* Student Status
* Student Transfers
* Student History

---

## Parent Management

Features:

* Parent Profiles
* Multiple Child Linking
* Emergency Contacts

---

## Staff Management

Features:

* Teacher Management
* Supervisor Management
* Counselor Management
* Administrator Management

---

## Course Management

Features:

* Courses
* Subjects
* Departments
* Credit Units
* Academic Years
* Semesters

---

## Academic Performance Module

Features:

* CAT Scores
* Assignments
* Projects
* Practical Exams
* Final Exams
* GPA Calculation
* CGPA Calculation
* Ranking

---

## Attendance Management

Supported Methods:

* QR Code
* RFID
* NFC
* Manual Entry

Attendance Status:

* Present
* Absent
* Late
* Excused

---

## Assignment Management

Features:

* Assignment Creation
* Submission Tracking
* Deadline Tracking
* Late Submission Detection

---

# MACHINE LEARNING MODULE

## Risk Prediction Categories

* Low Risk
* Medium Risk
* High Risk
* Critical Risk

## Prediction Inputs

* GPA
* Attendance
* Assignment Completion
* Missed Assignments
* Course Failures
* Behavioral Incidents
* Fee Balance
* Login Frequency
* Resource Usage

## Predictions

### Academic Failure Prediction

Predict probability of academic failure.

### Course Failure Prediction

Predict specific courses likely to be failed.

### Dropout Prediction

Predict probability of student withdrawal.

### Attendance Decline Prediction

Predict attendance deterioration.

### Graduation Prediction

Predict expected graduation success.

---

# EXPLAINABLE AI

Every prediction must include:

* Risk score
* Contributing factors
* Confidence score
* Recommended interventions

Example:

Risk Level: High

Reasons:

* Attendance below 70%
* GPA below 2.0
* 5 missed assignments

Recommendations:

* Tutoring
* Counseling
* Weekly mentorship

---

# INTERVENTION MANAGEMENT

Intervention Types:

* Counseling
* Mentorship
* Tutoring
* Parent Meeting
* Academic Warning
* Peer Support

Track:

* Date
* Supervisor
* Student
* Reason
* Outcome
* Follow-Up Date

---

# COUNSELING MODULE

Features:

* Referrals
* Counseling Sessions
* Session Notes
* Follow-Ups
* Outcome Tracking

---

# COMMUNICATION MODULE

Features:

* Real-Time Chat
* Notifications
* Announcements
* Email Alerts
* SMS Alerts

Communication Paths:

* Student ↔ Supervisor
* Parent ↔ Supervisor
* Teacher ↔ Student
* Admin ↔ All Users

---

# GAMIFICATION MODULE

Features:

* Badges
* Achievements
* Milestones
* Leaderboards

Badge Examples:

* Perfect Attendance
* GPA Excellence
* Most Improved
* Assignment Champion

---

# ANALYTICS MODULE

Institutional Analytics:

* Student Performance Trends
* Attendance Trends
* Risk Distribution
* Intervention Effectiveness
* Department Performance
* Teacher Performance
* Retention Rates

---

# INFOGRAPHICS & VISUALIZATIONS

Implement using Recharts.

Visualizations:

## Academic

* GPA Trend Charts
* Performance Heatmaps
* Course Performance Charts

## Attendance

* Attendance Trends
* Attendance Heatmaps

## AI

* Risk Distribution Pie Charts
* Risk Trend Graphs
* Prediction Confidence Charts

## Intervention

* Intervention Success Rates
* Intervention Effectiveness Comparison

## Institution

* Retention Rate Trends
* Graduation Rate Trends
* Department Comparisons

---

# DATA FLOW ARCHITECTURE

Student Activities
↓
Attendance + Grades + Assignments
↓
Database Storage
↓
Feature Engineering
↓
Machine Learning Engine
↓
Risk Prediction
↓
Supervisor Dashboard
↓
Intervention Creation
↓
Student Support
↓
Outcome Monitoring
↓
Model Retraining

---

# MACHINE LEARNING WORKFLOW

Data Collection
↓
Data Cleaning
↓
Feature Engineering
↓
Train/Test Split
↓
Model Training
↓
Model Evaluation
↓
Model Serialization (joblib)
↓
Prediction API
↓
Dashboard Integration
↓
Continuous Retraining

---

# DATABASE TABLES

Authentication:

* users
* roles
* permissions
* audit_logs

People:

* students
* parents
* teachers
* supervisors
* counselors

Academics:

* departments
* courses
* subjects
* semesters
* academic_years
* enrollments
* attendance
* grades
* assignments
* submissions

AI:

* risk_predictions
* model_versions
* model_training_logs
* feature_importance

Interventions:

* interventions
* intervention_types
* intervention_outcomes
* referrals
* counseling_sessions

Communication:

* conversations
* messages
* notifications
* announcements

Gamification:

* badges
* student_badges
* achievements
* leaderboards

System:

* school_settings
* system_logs
* audit_logs

---

# API ENDPOINTS

Authentication

POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh

Students

GET /api/students
GET /api/students/{id}
POST /api/students
PUT /api/students/{id}
DELETE /api/students/{id}

Attendance

POST /api/attendance
GET /api/attendance/student/{id}

Grades

POST /api/grades
PUT /api/grades/{id}
GET /api/grades/student/{id}

Assignments

POST /api/assignments
GET /api/assignments

AI

POST /api/ml/predict
POST /api/ml/retrain
GET /api/ml/risk-report
GET /api/ml/model-metrics

Interventions

POST /api/interventions
GET /api/interventions
PUT /api/interventions/{id}

Messaging

GET /api/chat/conversations
POST /api/chat/send

Notifications

GET /api/notifications

Reports

GET /api/reports/student
GET /api/reports/institution

---

# DASHBOARD REQUIREMENTS

## Superadmin Dashboard

* Total Institutions
* Total Users
* Active Sessions
* Security Logs
* System Health
* Storage Usage

## Admin Dashboard

* Student Count
* Risk Distribution
* Attendance Analytics
* Department Analytics
* AI Metrics

## Teacher Dashboard

* Classes
* Attendance Entry
* Grade Entry
* Assignment Management

## Supervisor Dashboard

* Assigned Students
* Risk Alerts
* Intervention Queue
* Messaging

## Counselor Dashboard

* Referrals
* Sessions
* Outcomes
* Follow-Ups

## Parent Dashboard

* Attendance
* GPA
* Risk Level
* Notifications

## Student Dashboard

* GPA Trends
* Attendance Trends
* Assignments
* Recommendations
* Badges

---

# FUTURE ENHANCEMENTS

* AI Academic Assistant
* Recommendation Engine
* Predictive Cohort Analysis
* Digital Student Portfolio
* Mobile App
* Offline Attendance Sync
* LMS Integration
* Microsoft Teams Integration
* Google Classroom Integration
* Biometric Attendance
* AI Study Planner
* AI Timetable Generator

---

# DEVELOPMENT REQUIREMENTS

Generate:

1. PostgreSQL Database Schema
2. Complete ERD
3. Flask REST API
4. React Frontend
5. Tailwind UI
6. SocketIO Messaging
7. JWT Authentication
8. Machine Learning Pipeline
9. Recharts Dashboards
10. Audit Logging
11. Role Based Access Control
12. PDF Reporting
13. Notification System
14. SMS Integration
15. Email Integration

Build the system using modular, scalable architecture following enterprise software engineering practices and production-ready standards.
