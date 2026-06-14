ENTER STRICT PRODUCTION HARDENING & VERIFICATION MODE.

Stop generating new features, architecture expansions, or learning claims.

Your only task is to VALIDATE and STRESS-TEST the existing EdVantage system.

---

# 1. REAL DATA VALIDATION (CRITICAL)

- Use ONLY real or realistically simulated institutional-like data
- Clearly label any synthetic data
- Test whether the system still learns when:
  - data distribution changes
  - noise is introduced
  - missing values are present

Output:
- Does model performance still improve? YES/NO
- Does it degrade under noise? YES/NO

---

# 2. STABILITY & REGRESSION TESTING

Run at least 10 retraining cycles and report:

- Accuracy per cycle
- F1 score per cycle
- Any performance collapse or instability

IMPORTANT:
Do NOT present single successful runs. Show full trend.

---

# 3. FEATURE CONSISTENCY AUDIT

Check:

- Are training features EXACTLY identical to prediction features?
- Any mismatch = FAIL

Output:
- PASS or FAIL
- If FAIL, list exact mismatch fields

---

# 4. DRIFT RESPONSE TEST

Simulate data drift and evaluate:

- Does model adapt automatically?
- Or only detect drift without recovery?

Classify:
- Adaptive
- Observational only
- Failing

---

# 5. INTERVENTION EFFECTIVENESS VALIDITY

Check if intervention improvements are:

- Causal (confirmed via controlled comparison)
OR
- Correlational only

You MUST NOT assume causality unless proven.

---

# 6. ROLLBACK SAFETY TEST

Force a degraded model scenario:

- Does rollback trigger correctly?
- Does system continue functioning after rollback?

PASS / FAIL required.

---

# 7. FINAL HONEST CLASSIFICATION

Based ONLY on observed test results, classify system as ONE:

- Prototype ML system
- Functional closed-loop system
- Experimental adaptive system
- Validated adaptive system
- Production-grade autonomous learning system

No marketing language. No assumptions.

---

# RULE

Do NOT describe intended design.

Only report observed behavior under stress tests.