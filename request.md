ENTER SYSTEM STABILIZATION MODE.

Do NOT add new features, ML improvements, or architecture enhancements.

Only fix runtime-breaking issues preventing end-to-end execution.

---

# 1. CRITICAL SCHEMA FIX (BLOCKING ISSUE)

## Problem:
InterventionRecommendation model is missing trace_id.

## Required Fix:
- Add trace_id field (UUID, indexed)
- Ensure trace_id is propagated from:
  RiskPrediction → Recommendation → Intervention → Outcome

## RULE:
trace_id MUST exist in ALL lifecycle tables.

---

# 2. FEATURE PARITY FIX (CRITICAL ML BUG)

## Problem:
Training uses 16+ temporal features, inference uses 11 snapshot features.

## Required Fix:
- Create UnifiedFeatureService (single source of truth)
- BOTH training and inference MUST use identical feature set
- Remove all duplicate feature extractors

## RULE:
Feature vector MUST be identical in:
- FeatureDatasetBuilder
- ai_service.predict_student_risk

---

# 3. FLOW RECOVERY REQUIREMENT

Fix system so that:

Prediction → Recommendation → Intervention → Outcome

executes WITHOUT runtime crash.

No step may block the pipeline.

---

# 4. RETRAINING PIPELINE VERIFICATION

Ensure ModelRetrainingService is:

- reachable in production flow
- triggered after outcome recording
- NOT blocked by earlier failures

---

# 5. NO NEW FEATURES RULE

Strictly forbidden:
- new ML models
- new dashboards
- new analytics
- new engines

ONLY fix broken execution flow.

---

# 6. SUCCESS CRITERION

System is ONLY considered fixed when:

A full student lifecycle can execute end-to-end WITHOUT errors:

Prediction → Recommendation → Intervention → Outcome → Retraining

---

# FINAL GOAL

Restore system from:
"crashing pipeline system"

to:
"fully executable closed-loop system"