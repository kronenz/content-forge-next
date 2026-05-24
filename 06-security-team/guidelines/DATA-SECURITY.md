# Data Security Guidelines

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Data Classification

| Class | Description | Examples | Handling |
|-------|-------------|---------|---------|
| Public | Intentionally public information | Marketing content, public pricing | No restrictions |
| Internal | Business data not intended for public | Operational reports, internal docs | Access controls required |
| Confidential | Sensitive business or user data | User PII, financial records | Encryption + strict access |
| Restricted | Highest sensitivity; legal or regulatory impact | Passwords (hashed), API keys, private keys | Encrypted, minimal access, audit log |

All new data fields must be classified before implementation. Document the classification in the relevant schema or data model documentation.

---

## Encryption

### At Rest

- **Database:** [Describe whether the database provider offers transparent encryption at rest. If yes, confirm it is enabled. If no, document which fields are application-level encrypted.]
- **Application-level encryption:** Fields classified as Restricted that are stored in the database must be encrypted at the application layer using a strong symmetric cipher (e.g., AES-256-GCM).
- **Encryption keys:** Store keys in a dedicated secrets manager or key management service (KMS), never alongside the encrypted data or in source code.
- **File storage:** Files stored on disk or in object storage must be stored in a bucket/volume with server-side encryption enabled.

### In Transit

- All data in transit must use TLS 1.2 or higher.
- Certificates must be from a trusted CA and renewed before expiry.
- Internal service-to-service communication must also use TLS where the network is not fully trusted.
- Disable weak cipher suites and TLS 1.0/1.1.

---

## PII Handling

**PII fields in this project:**

| Field | Classification | Stored Where | Notes |
|-------|---------------|-------------|-------|
| [FIELD_NAME] | [CLASS] | [TABLE/STORE] | [Notes] |

Rules:
- Collect only PII that is necessary for the application's stated purpose (data minimization).
- Do not log PII (names, emails, phone numbers, etc.) in application logs.
- Mask or truncate PII in error messages, audit logs, and monitoring dashboards.
- Obtain user consent before collecting PII, where required by applicable law.
- Content Forge-specific PII policy: [Describe any jurisdiction-specific requirements, e.g., GDPR, PDPA]

---

## Data Retention and Deletion

| Data Type | Retention Period | Deletion Method | Notes |
|-----------|-----------------|----------------|-------|
| User accounts | [PERIOD] after deactivation | [Hard delete / Anonymize] | [Notes] |
| Session logs | [PERIOD] | [Method] | [Notes] |
| Audit logs | [PERIOD] | [Method] | [Notes] |
| [OTHER_DATA_TYPE] | [PERIOD] | [Method] | [Notes] |

Rules:
- Implement automated processes to purge or anonymize data after its retention period expires.
- Deletion must cascade to all related records and associated files.
- Provide a user-initiated data deletion (right to erasure) workflow where required by law.
- Verify deletion is complete — do not leave orphaned records in related tables.

---

## Backup and Recovery

- **Backup frequency:** [e.g., Daily full backup, hourly incremental]
- **Backup retention:** [e.g., 30 days of daily backups, 7 days of hourly]
- **Backup encryption:** All backups must be encrypted using the same standards as production data.
- **Backup storage:** Store backups in a separate location or account from the primary database.
- **Recovery time objective (RTO):** [TARGET]
- **Recovery point objective (RPO):** [TARGET]
- **Recovery testing:** Test restore procedures at least [FREQUENCY] to verify backups are valid and recovery works.

---

## Access Control

- Apply the principle of least privilege to all database users and service accounts.
- Service accounts used by the application should have only the permissions required (e.g., SELECT, INSERT, UPDATE on specific tables — not full schema ownership).
- Direct production database access must be restricted to authorized personnel and logged.
- Use separate database credentials for each environment (development, staging, production).
- Rotate database credentials on a defined schedule and immediately on suspected compromise.
- Content Forge-specific DB users and permissions: [Document or link to credentials store]
