# Security Review — [TASK-NNN: TASK TITLE]

**Task Reference:** [TASK-NNN]
**Reviewer:** [NAME]
**Date:** 2026-03-19
**Scope:** [Brief description of what was reviewed]

---

## Authentication & Authorization

| Check | Status | Notes |
|-------|--------|-------|
| All endpoints require authentication where appropriate | [ ] Pass  [ ] Fail  [ ] N/A | |
| Role-based access control enforced server-side | [ ] Pass  [ ] Fail  [ ] N/A | |
| Tokens have appropriate expiry | [ ] Pass  [ ] Fail  [ ] N/A | |
| Session invalidation works correctly on logout | [ ] Pass  [ ] Fail  [ ] N/A | |
| No privilege escalation paths identified | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## Input Validation

| Check | Status | Notes |
|-------|--------|-------|
| All user inputs validated server-side | [ ] Pass  [ ] Fail  [ ] N/A | |
| Parameterized queries used (no string concatenation in SQL) | [ ] Pass  [ ] Fail  [ ] N/A | |
| File upload types and sizes validated | [ ] Pass  [ ] Fail  [ ] N/A | |
| Output encoding applied (XSS prevention) | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## Data Protection

| Check | Status | Notes |
|-------|--------|-------|
| Sensitive data encrypted at rest | [ ] Pass  [ ] Fail  [ ] N/A | |
| All transport over HTTPS/TLS | [ ] Pass  [ ] Fail  [ ] N/A | |
| PII minimized — only necessary data collected | [ ] Pass  [ ] Fail  [ ] N/A | |
| No secrets or credentials in source code | [ ] Pass  [ ] Fail  [ ] N/A | |
| Logs do not contain sensitive data (passwords, tokens, PII) | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## API Security

| Check | Status | Notes |
|-------|--------|-------|
| Rate limiting configured on sensitive endpoints | [ ] Pass  [ ] Fail  [ ] N/A | |
| CORS policy appropriately restrictive | [ ] Pass  [ ] Fail  [ ] N/A | |
| Security headers set (CSP, X-Frame-Options, etc.) | [ ] Pass  [ ] Fail  [ ] N/A | |
| Error responses do not leak internal details | [ ] Pass  [ ] Fail  [ ] N/A | |
| HTTP methods restricted to what is needed | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## OWASP Top 10 Quick Check

| Risk | Status | Notes |
|------|--------|-------|
| A01 — Broken Access Control | [ ] Pass  [ ] Fail  [ ] N/A | |
| A02 — Cryptographic Failures | [ ] Pass  [ ] Fail  [ ] N/A | |
| A03 — Injection (SQL, XSS, etc.) | [ ] Pass  [ ] Fail  [ ] N/A | |
| A04 — Insecure Design | [ ] Pass  [ ] Fail  [ ] N/A | |
| A05 — Security Misconfiguration | [ ] Pass  [ ] Fail  [ ] N/A | |
| A06 — Vulnerable & Outdated Components | [ ] Pass  [ ] Fail  [ ] N/A | |
| A07 — Identification & Auth Failures | [ ] Pass  [ ] Fail  [ ] N/A | |
| A08 — Software & Data Integrity Failures | [ ] Pass  [ ] Fail  [ ] N/A | |
| A09 — Security Logging & Monitoring Failures | [ ] Pass  [ ] Fail  [ ] N/A | |
| A10 — Server-Side Request Forgery (SSRF) | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## Risk Assessment

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| [RISK_1] | [Critical / High / Medium / Low] | [MITIGATION] | [Open / Resolved] |
| [RISK_2] | [Critical / High / Medium / Low] | [MITIGATION] | [Open / Resolved] |

---

## Findings

| # | Severity | Description | Required Fix |
|---|----------|-------------|--------------|
| 1 | [Critical / High / Medium / Low] | [DESCRIPTION] | [ ] Yes  [ ] No |
| 2 | [Critical / High / Medium / Low] | [DESCRIPTION] | [ ] Yes  [ ] No |

---

## Verdict

[ ] **Approved** — No security concerns. Ready to proceed.
[ ] **Needs Changes** — Required fixes listed above. Re-review after fixes.
[ ] **Rejected** — Critical security issues. Must not ship until resolved.

**Comments:**

[Any additional notes for the implementer or team.]
