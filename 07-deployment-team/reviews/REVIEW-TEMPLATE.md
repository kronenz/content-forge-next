# Deployment Review — [TASK-NNN: TASK TITLE]

**Task Reference:** [TASK-NNN]
**Reviewer:** [NAME]
**Date:** 2026-03-19
**Target Environment:** [ ] Staging  [ ] Production

---

## Pre-Deployment Checklist

| Check | Status | Notes |
|-------|--------|-------|
| All tests passing (unit, integration, E2E) | [ ] Pass  [ ] Fail  [ ] N/A | |
| Build succeeds without errors or warnings | [ ] Pass  [ ] Fail  [ ] N/A | |
| Security review completed and approved | [ ] Pass  [ ] Fail  [ ] N/A | |
| Design review completed and approved (if frontend) | [ ] Pass  [ ] Fail  [ ] N/A | |
| DB migrations tested locally | [ ] Pass  [ ] Fail  [ ] N/A | |
| DB migrations ready for target environment | [ ] Pass  [ ] Fail  [ ] N/A | |
| Environment variables / secrets configured | [ ] Pass  [ ] Fail  [ ] N/A | |
| No sensitive data in source code or build artifacts | [ ] Pass  [ ] Fail  [ ] N/A | |
| Monitoring / alerting configured | [ ] Pass  [ ] Fail  [ ] N/A | |
| Rollback plan documented | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## Deployment Steps

1. [STEP_1 — e.g., Apply DB migrations]
2. [STEP_2 — e.g., Deploy API worker]
3. [STEP_3 — e.g., Deploy frontend]
4. [STEP_4 — e.g., Run smoke tests]
5. [STEP_5 — e.g., Verify monitoring]

---

## Rollback Plan

**Trigger condition:** [When should we roll back? e.g., error rate > 1%, P0 bug found]

**Rollback steps:**

1. [ROLLBACK_STEP_1]
2. [ROLLBACK_STEP_2]
3. [ROLLBACK_STEP_3]

**Estimated rollback time:** [e.g., < 5 minutes]

---

## Post-Deployment Verification

| Check | Status | Notes |
|-------|--------|-------|
| Application loads without errors | [ ] Pass  [ ] Fail | |
| Core user flows working (smoke test) | [ ] Pass  [ ] Fail | |
| API health endpoint returns 200 | [ ] Pass  [ ] Fail | |
| DB migrations applied correctly | [ ] Pass  [ ] Fail | |
| No spike in error rates / latency | [ ] Pass  [ ] Fail | |
| Logs look clean (no unexpected errors) | [ ] Pass  [ ] Fail | |

---

## Sign-Off

| Role | Name | Approved | Date |
|------|------|----------|------|
| Developer | [NAME] | [ ] Yes  [ ] No | 2026-03-19 |
| Reviewer | [NAME] | [ ] Yes  [ ] No | 2026-03-19 |
| Approver | [NAME] | [ ] Yes  [ ] No | 2026-03-19 |

---

## Notes

[Any deployment-specific observations, timing constraints, or follow-up actions.]
