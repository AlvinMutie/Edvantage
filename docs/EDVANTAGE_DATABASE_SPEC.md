# EDVANTAGE DATABASE SPECIFICATION

## DATABASE TYPE
PostgreSQL (Primary)
SQLite (Development fallback)

---

# 1. CORE DESIGN PRINCIPLES

- Fully normalized (3NF minimum)
- UUID primary keys for distributed safety
- Audit logging enabled for all critical tables
- Soft deletes (is_deleted flag)
- Timestamp tracking on all records
- Role-based access enforcement at DB + API level

---

# 2. AUTHENTICATION & SYSTEM TABLES

## users
- id (UUID, PK)
- full_name
- email (unique)
- password_hash
- role_id (FK)
- status (active, suspended)
- last_login
- created_at
- updated_at

## roles
- id (UUID, PK)
- name (superadmin, admin, teacher, supervisor, student, parent, counselor)

## permissions
- id
- role_id (FK)
- permission_name

## audit_logs
- id
- user_id (FK)
- action
- entity
- entity_id
- timestamp
- ip_address

---

# 3. ACADEMIC STRUCTURE

## students
- id (UUID)
- user_id (FK)
- admission_number
- date_of_birth
- gender
- class_id
- parent_id (FK)
- status

## parents
- id
- user_id (FK)
- phone
- address

## teachers
- id
- user_id
- department_id

## supervisors
- id
- user_id

## counselors
- id
- user_id

---

## departments
- id
- name

## courses
- id
- name
- department_id

## subjects
- id
- course_id
- name
- credit_units

## semesters
- id
- name
- academic_year_id

## academic_years
- id
- year_label

---

# 4. ACADEMIC PERFORMANCE

## enrollments
- id
- student_id
- subject_id
- semester_id

## grades
- id
- student_id
- subject_id
- assessment_type (CAT1, CAT2, Exam)
- score
- max_score
- created_at

## assignments
- id
- subject_id
- title
- description
- due_date

## submissions
- id
- assignment_id
- student_id
- score
- submitted_at
- status (on_time, late, missing)

---

# 5. ATTENDANCE

## attendance
- id
- student_id
- subject_id
- date
- status (present, absent, late, excused)

---

# 6. AI & MACHINE LEARNING

## risk_predictions
- id
- student_id
- risk_level (low, medium, high, critical)
- probability_score
- model_version
- reasons (JSON)
- created_at

## model_versions
- id
- name
- accuracy
- created_at
- active

## model_training_logs
- id
- model_version_id
- dataset_info
- metrics (JSON)
- trained_at

## feature_importance
- id
- model_version_id
- feature_name
- importance_score

---

# 7. INTERVENTIONS

## interventions
- id
- student_id
- supervisor_id
- type (mentorship, counseling, tutoring, warning)
- status (open, closed)
- notes
- created_at

## intervention_outcomes
- id
- intervention_id
- outcome_notes
- success_rating
- follow_up_date

## referrals
- id
- student_id
- counselor_id
- reason
- status

## counseling_sessions
- id
- counselor_id
- student_id
- session_notes
- session_date

---

# 8. COMMUNICATION

## conversations
- id
- participant_1
- participant_2

## messages
- id
- conversation_id
- sender_id
- message
- timestamp
- read_status

## notifications
- id
- user_id
- title
- message
- type
- is_read

## announcements
- id
- title
- message
- target_role
- created_at

---

# 9. GAMIFICATION

## badges
- id
- name
- description

## student_badges
- id
- student_id
- badge_id
- awarded_at

## achievements
- id
- student_id
- title
- description

## leaderboards
- id
- student_id
- score
- rank
- period

---

# 10. SYSTEM SETTINGS

## school_settings
- id
- school_name
- logo_url
- theme_config (JSON)

## system_logs
- id
- event
- severity
- timestamp