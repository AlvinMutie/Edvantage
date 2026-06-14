# EDVANTAGE API SPECIFICATION

Base URL:
/ api / v1

Authentication:
JWT (Flask-JWT-Extended)

---

# 1. AUTHENTICATION

POST /auth/register
Request:
{
  "full_name": "",
  "email": "",
  "password": "",
  "role": "student"
}

POST /auth/login
Request:
{
  "email": "",
  "password": ""
}

Response:
{
  "access_token": "",
  "refresh_token": "",
  "user": {}
}

POST /auth/refresh

POST /auth/logout

---

# 2. USERS

GET /users
GET /users/{id}
PUT /users/{id}
DELETE /users/{id}

---

# 3. STUDENTS

GET /students
GET /students/{id}
POST /students
PUT /students/{id}
DELETE /students/{id}

GET /students/{id}/performance
GET /students/{id}/risk

---

# 4. PARENTS

GET /parents
POST /parents
GET /parents/{id}

GET /parents/{id}/children

---

# 5. TEACHERS

GET /teachers
POST /teachers

GET /teachers/{id}/classes

---

# 6. ATTENDANCE

POST /attendance
Request:
{
  "student_id": "",
  "subject_id": "",
  "date": "",
  "status": "present"
}

GET /attendance/student/{id}
GET /attendance/class/{id}

---

# 7. GRADES

POST /grades
GET /grades/student/{id}
PUT /grades/{id}

---

# 8. ASSIGNMENTS

POST /assignments
GET /assignments
GET /assignments/{id}

POST /submissions
GET /submissions/student/{id}

---

# 9. AI / ML ENGINE

POST /ml/predict
Request:
{
  "student_id": ""
}

Response:
{
  "risk_level": "high",
  "probability": 0.87,
  "reasons": []
}

POST /ml/retrain
GET /ml/model-status
GET /ml/feature-importance
GET /ml/risk-report

---

# 10. INTERVENTIONS

POST /interventions
GET /interventions
GET /interventions/{id}
PUT /interventions/{id}

POST /interventions/{id}/outcome

---

# 11. COUNSELING

POST /counseling/sessions
GET /counseling/sessions

---

# 12. MESSAGING (SOCKET.IO)

Events:

send_message
{
  "conversation_id": "",
  "sender_id": "",
  "message": ""
}

receive_message

typing_indicator

---

# 13. NOTIFICATIONS

GET /notifications
POST /notifications/mark-read

---

# 14. REPORTS

GET /reports/student/{id}
GET /reports/institution
GET /reports/risk-summary

---

# 15. DASHBOARD DATA

GET /dashboard/admin
GET /dashboard/teacher
GET /dashboard/supervisor
GET /dashboard/student
GET /dashboard/parent