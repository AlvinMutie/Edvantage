# EDVANTAGE SYSTEM ARCHITECTURE

---

# 1. OVERALL ARCHITECTURE

Microservice-style modular monolith:

Frontend → Backend API → Database → ML Engine

---

# 2. FRONTEND (React)

Modules:
- Authentication UI
- Dashboards
- Analytics
- Messaging
- Reports

State:
- React Query (server state)
- Context API (auth + roles)

---

# 3. BACKEND (Flask)

Layers:

Controller Layer → Service Layer → Repository Layer

Responsibilities:
- API handling
- Business logic (Recommendations, Interventions)
- Authentication
- Performance Analytics

---

# 4. DATABASE (PostgreSQL)

Stores:
- Users
- Academic data
- AI predictions & Recommendations
- Interventions & Outcomes
- Messages

---

# 5. ML ENGINE

Standalone Python module:

Flow:
Database → Feature Engineering → Model → Prediction → Prescription

---

# 6. REAL-TIME SYSTEM

Flask-SocketIO

Used for:
- Chat
- Notifications
- Live alerts

---

# 7. SECURITY

- JWT Authentication
- Role-based access control
- Password hashing (bcrypt)
- Audit logging

---

# 8. DATA FLOW

User Action → API → DB → ML Engine → Response → UI Update

---

# 9. SCALABILITY

- Horizontal scaling ready
- Stateless backend
- Separate ML pipeline