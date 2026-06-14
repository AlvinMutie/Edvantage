# EDVANTAGE AI / MACHINE LEARNING SPECIFICATION

---

# 1. PURPOSE

Predict student academic risk and recommend interventions.

---

# 2. MODEL TYPE

Primary:
Random Forest Classifier

Optional:
- XGBoost
- LightGBM

---

# 3. FEATURES (INPUT VARIABLES)

## Academic
- GPA
- CAT scores
- Exam scores
- Class rank

## Behavioral
- Attendance rate
- Late submissions
- Missed assignments
- Discipline records

## Engagement
- Login frequency
- LMS usage
- Participation score

## Socio-academic
- Fee balance
- Counselor referrals
- Parent engagement

---

# 4. TARGET LABELS

- Low Risk
- Medium Risk
- High Risk
- Critical Risk

---

# 5. FEATURE ENGINEERING

- GPA trend slope
- Attendance rolling average
- Assignment completion ratio
- Performance delta (week-to-week change)

---

# 6. TRAINING PIPELINE

1. Collect data from PostgreSQL
2. Clean missing values
3. Encode categorical data
4. Normalize numeric values
5. Split dataset (80/20)
6. Train Random Forest
7. Evaluate model
8. Save model (joblib)

---

# 7. MODEL OUTPUT

{
  "risk_level": "high",
  "probability": 0.87,
  "top_factors": [
    "low attendance",
    "declining GPA"
  ]
}

---

# 8. EXPLAINABLE AI

Always return:
- Why prediction was made
- Top contributing features
- Suggested interventions

---

# 9. RETRAINING

Triggered by admin:

POST /ml/retrain

Conditions:
- New semester data
- Model accuracy drop
- Large dataset update

---

# 10. MODEL STORAGE

- joblib file storage
- version tracking in DB
- rollback support