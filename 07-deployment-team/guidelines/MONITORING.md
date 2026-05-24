# Monitoring and Observability

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Strategy

Observability for Content Forge is built on three pillars: **metrics**, **logs**, and **alerts**. The goal is to detect and diagnose production issues before users report them.

**Monitoring platform:** [MONITORING_PLATFORM] (e.g., Cloudflare Analytics, Datadog, Grafana, Sentry)
**Log aggregation:** [LOG_PLATFORM] (e.g., Cloudflare Logpush, Logtail, CloudWatch)
**Error tracking:** [ERROR_TRACKING_PLATFORM] (e.g., Sentry, Rollbar, Bugsnag)
**On-call rotation:** [ON_CALL_TOOL] (e.g., PagerDuty, OpsGenie) <!-- remove if not applicable -->

---

## Key Metrics

### API / Backend

| Metric | Description | Target | Warning | Critical |
|--------|-------------|--------|---------|----------|
| Request rate | Requests per minute | — | [WARN_RPM] | [CRIT_RPM] |
| Error rate (5xx) | % of requests returning 5xx | < [TARGET]% | > [WARN]% | > [CRIT]% |
| P95 latency | 95th percentile response time | < [TARGET_MS] ms | > [WARN_MS] ms | > [CRIT_MS] ms |
| P99 latency | 99th percentile response time | < [TARGET_MS] ms | > [WARN_MS] ms | > [CRIT_MS] ms |
| DB query time | Average database query duration | < [TARGET_MS] ms | > [WARN_MS] ms | > [CRIT_MS] ms |
| DB connection pool | Active connections / pool size | < [TARGET]% | > [WARN]% | > [CRIT]% |

### Frontend

| Metric | Description | Target | Warning | Critical |
|--------|-------------|--------|---------|----------|
| Core Web Vitals — LCP | Largest Contentful Paint | < 2.5 s | > 2.5 s | > 4 s |
| Core Web Vitals — CLS | Cumulative Layout Shift | < 0.1 | > 0.1 | > 0.25 |
| Core Web Vitals — INP | Interaction to Next Paint | < 200 ms | > 200 ms | > 500 ms |
| JS error rate | Client-side JS errors/session | < [TARGET] | > [WARN] | > [CRIT] |

### Infrastructure

| Metric | Description | Warning | Critical |
|--------|-------------|---------|----------|
| Worker CPU time | Avg CPU time per request | > [WARN_MS] ms | > [CRIT_MS] ms |
| Memory usage | Worker / container memory | > [WARN]% | > [CRIT]% |
| Storage usage | Object / disk usage | > [WARN]% | > [CRIT]% |

---

## Alerting Rules

Alerts fire to [ALERT_DESTINATION] (e.g., #alerts Slack channel, PagerDuty).

| Alert Name | Condition | Severity | Action |
|------------|-----------|----------|--------|
| High error rate | 5xx rate > [CRIT]% for 5 min | P1 | Page on-call immediately |
| API latency spike | P95 > [CRIT_MS] ms for 5 min | P2 | Notify on-call |
| Deploy failure | CI/CD pipeline fails on main | P2 | Notify deploying engineer |
| DB connection saturation | Pool > [CRIT]% for 2 min | P1 | Page on-call immediately |
| Certificate expiry | TLS cert expires in < 14 days | P3 | Notify team |
| Elevated JS errors | Client error rate > [WARN] | P3 | Notify dev team |

### Alert Severity Definitions

| Severity | Response Time | Description |
|----------|---------------|-------------|
| P1 | Immediate (< 15 min) | Service down or data loss |
| P2 | < 1 hour | Degraded service, significant impact |
| P3 | Next business day | Minor degradation, no user impact |

---

## Log Management

### What to Log

- All API requests: method, path, status code, latency, user ID (masked)
- All authentication events: login, logout, token refresh, failed attempts
- All database errors and slow queries (> [SLOW_QUERY_THRESHOLD_MS] ms)
- All deployment events: version, deployer, timestamp
- Business-critical events: [LIST_KEY_BUSINESS_EVENTS]

### What NOT to Log

- Plaintext passwords or tokens
- Full credit card numbers or payment data
- Personally Identifiable Information (PII) beyond what is strictly necessary
- Request/response bodies containing sensitive fields

### Log Retention

| Environment | Retention Period | Storage |
|-------------|------------------|---------|
| Local | Session only | Local filesystem |
| Staging | [STAGING_RETENTION] | [LOG_PLATFORM] |
| Production | [PRODUCTION_RETENTION] | [LOG_PLATFORM] |

---

## Incident Response

### Detection

1. Automated alert fires (see alerting rules above), **or**
2. User report received via [SUPPORT_CHANNEL].

### Triage

1. On-call engineer acknowledges the alert within the P-level SLA.
2. Check dashboards on [MONITORING_PLATFORM] for affected services.
3. Check recent deploys — was there a deployment in the last [ROLLBACK_WINDOW]?
4. Assess impact: how many users affected, what data at risk?

### Mitigation

- If a recent deploy caused the issue: **roll back immediately** (see `DEPLOYMENT-STRATEGY.md`).
- If a database issue: follow runbook in `08-db-migration-team/guidelines/MIGRATION-POLICY.md`.
- If a third-party service is down: check the vendor status page and activate fallback if available.

### Communication

| Audience | Channel | When |
|----------|---------|------|
| Engineering team | [INTERNAL_CHANNEL] | Immediately on P1/P2 |
| Stakeholders | [STAKEHOLDER_CHANNEL] | Within [TIME] for P1 |
| Users | [STATUS_PAGE] | If user-facing impact > [TIME] |

### Post-Mortem

- Required for all P1 incidents and any P2 incident with user impact.
- Complete within [POSTMORTEM_DEADLINE] of resolution.
- Use the blameless post-mortem format: timeline, root cause, impact, action items.
- Store in `07-deployment-team/releases/` or a dedicated `incidents/` subfolder.

---

## Dashboards

| Dashboard | Platform | Purpose | URL |
|-----------|----------|---------|-----|
| API overview | [MONITORING_PLATFORM] | Request rate, error rate, latency | [URL] |
| Database health | [MONITORING_PLATFORM] | Query time, connection pool | [URL] |
| Frontend vitals | [MONITORING_PLATFORM] | Core Web Vitals, JS errors | [URL] |
| Infrastructure | [MONITORING_PLATFORM] | CPU, memory, storage | [URL] |
