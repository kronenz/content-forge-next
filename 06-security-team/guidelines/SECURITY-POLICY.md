# Security Policy

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Authentication

- **Password hashing:** All passwords must be hashed using a strong, adaptive algorithm (e.g., bcrypt, Argon2, PBKDF2 with sufficient iterations). Never store plaintext passwords.
- **Session management:** Issue short-lived session tokens. Refresh tokens may be longer-lived but must be rotatable and revocable.
- **Token storage:** Store tokens in memory or httpOnly cookies. Avoid localStorage for sensitive tokens.
- **Multi-factor authentication (MFA):** [Describe MFA requirements — required for admins, optional for users, not yet implemented, etc.]
- **Account lockout:** Lock accounts after [N] consecutive failed login attempts. Implement exponential back-off or CAPTCHA for repeated failures.
- **Logout:** Invalidate server-side session on logout. Do not rely solely on client-side token deletion.

---

## Authorization

- **Role-Based Access Control (RBAC):** Define roles and their permitted actions explicitly. Enforce authorization checks on the server — never trust client-side role information.
- **Principle of least privilege:** Grant users and service accounts only the permissions they need to perform their function.
- **Permission checks:** Every API endpoint must verify that the authenticated user has permission to perform the requested action on the requested resource.
- **Resource ownership:** For user-owned resources, verify that the requesting user owns or is authorized to access the specific record (not just that they have the role).
- **Content Forge-specific roles:** [List the roles used in this project and their access levels]

---

## Input Validation

- **Server-side validation is mandatory.** Client-side validation is a UX aid only and must never be the sole validation layer.
- **Parameterized queries:** All database queries must use parameterized statements or an ORM that prevents SQL injection. String interpolation into queries is prohibited.
- **Sanitization:** Sanitize user-supplied content before rendering to prevent XSS. Use context-appropriate escaping (HTML, URL, JavaScript).
- **File uploads:** Validate file type, size, and content. Store uploaded files outside the web root or in object storage. Never execute uploaded files.
- **Schema validation:** Validate request bodies against a defined schema (e.g., using a validation library) before processing.

---

## Data Protection

### Encryption at Rest
- Sensitive fields (e.g., PII, credentials) stored in the database must be encrypted where the database provider does not provide transparent encryption.
- Encryption keys must be stored separately from the data they protect (e.g., in a secrets manager).

### Encryption in Transit
- All traffic must use TLS 1.2 or higher. TLS 1.0 and 1.1 are prohibited.
- HTTP must redirect to HTTPS. HSTS must be enabled.

### PII Handling
- Collect only the PII required for the application's function (data minimization).
- Document all PII fields and their purpose.
- Content Forge-specific PII fields: [List fields — name, email, phone, etc.]

### Data Retention
- Define and document retention periods for all data categories.
- Implement deletion workflows that purge records after the retention period expires.
- Content Forge-specific retention policy: [Describe or link to policy]

---

## API Security

Detailed API-level security controls are documented in:

**`06-security-team/guidelines/API-SECURITY.md`**

Key requirements:
- Authenticate every non-public endpoint.
- Apply rate limiting to all endpoints.
- Return generic error messages — do not expose stack traces or internal details.
- Set appropriate security headers on all responses.

---

## Secrets Management

- **Never commit secrets to version control.** This includes API keys, database credentials, JWT secrets, and private keys.
- Secrets must be stored in environment variables or a dedicated secrets manager (e.g., [SECRETS_MANAGER_NAME]).
- Rotate secrets on a schedule and immediately upon suspected compromise.
- Audit secret access logs regularly.
- Content Forge-specific secrets location: [Describe where secrets are stored for local dev vs. production]

---

## Dependency Security

- Audit third-party dependencies regularly using a vulnerability scanner (e.g., `npm audit`, `pip audit`, Snyk).
- Keep dependencies updated. Address critical and high-severity vulnerabilities promptly.
- Pin dependency versions in production to prevent unexpected updates.
- Review the license of new dependencies before adoption.

---

## Incident Response

### Reporting
- Security vulnerabilities must be reported to: [SECURITY_CONTACT_EMAIL or process description]
- Do not disclose vulnerabilities publicly before they are remediated.

### Escalation
1. Reporter notifies [SECURITY_LEAD] via [SECURE_CHANNEL].
2. [SECURITY_LEAD] assesses severity and assigns owner.
3. Owner remediates and verifies fix within [SLA_TIMELINE] based on severity.
4. Fix deployed; affected parties notified if required.

### Post-Mortem
- After any security incident, conduct a blameless post-mortem within [TIMEFRAME].
- Document root cause, timeline, impact, and corrective actions.
- Store post-mortem in `06-security-team/audits/`.
