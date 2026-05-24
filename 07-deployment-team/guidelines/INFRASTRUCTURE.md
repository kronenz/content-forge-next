# Infrastructure

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Overview

This document describes the infrastructure components that run Content Forge in each environment.

**Hosting platform:** Vercel
**Primary region:** [PRIMARY_REGION]
**Secondary region (failover/CDN):** [SECONDARY_REGION] <!-- remove if not applicable -->

---

## Resource Inventory

### Compute

| Service | Environment | Provider | Tier / Size | Notes |
|---------|-------------|----------|-------------|-------|
| API Worker / Server | Staging | Vercel | [TIER] | [SERVICE_NAME_STAGING] |
| API Worker / Server | Production | Vercel | [TIER] | [SERVICE_NAME_PRODUCTION] |
| Frontend App | Staging | Vercel | [TIER] | [APP_NAME_STAGING] |
| Frontend App | Production | Vercel | [TIER] | [APP_NAME_PRODUCTION] |

### Database

| Service | Environment | Provider | Tier | Connection Method |
|---------|-------------|----------|------|-------------------|
| Primary DB | Local | Docker (PostgreSQL) | — | `localhost:[DB_PORT]` |
| Primary DB | Staging | [DB_PLATFORM] | [TIER] | [CONNECTION_METHOD] |
| Primary DB | Production | [DB_PLATFORM] | [TIER] | [CONNECTION_METHOD] |

### Storage

| Service | Environment | Provider | Bucket / Container | Purpose |
|---------|-------------|----------|--------------------|---------|
| Object Storage | Staging | Vercel | [BUCKET_NAME_STAGING] | [PURPOSE] |
| Object Storage | Production | Vercel | [BUCKET_NAME_PRODUCTION] | [PURPOSE] |

<!-- Remove storage section if not applicable -->

### Additional Services

| Service | Provider | Purpose | Environments |
|---------|----------|---------|--------------|
| [SERVICE_NAME] | [PROVIDER] | [PURPOSE] | Staging, Production |

<!-- Examples: CDN, email service, SMS, analytics, feature flags, etc. -->

---

## Networking and DNS

### Domain Configuration

| Domain | Environment | Points To | Notes |
|--------|-------------|-----------|-------|
| [PRODUCTION_DOMAIN] | Production | [TARGET] | Primary user-facing domain |
| [STAGING_DOMAIN] | Staging | [TARGET] | Internal QA only |
| [API_DOMAIN] | Production | [TARGET] | API endpoint |

### TLS / HTTPS

- All traffic must use HTTPS. HTTP requests redirect to HTTPS (301).
- TLS certificates managed by: [CERT_PROVIDER] (e.g., Cloudflare, Let's Encrypt, ACM)
- Certificate renewal: [RENEWAL_METHOD] (auto-renew or manual — specify)

### Firewall / Access Rules

- Staging environment is accessible to: [STAGING_ACCESS_POLICY] (e.g., VPN only, IP allowlist, public)
- Database ports are NOT exposed to the public internet.
- Admin endpoints protected by: [ADMIN_PROTECTION] (e.g., IP allowlist, auth middleware)

---

## Scaling Strategy

### Current Approach

<!-- Choose one and remove the others -->

**Option A: Serverless / Auto-scaling**
The application runs on Vercel which handles scaling automatically. No manual intervention required for typical traffic spikes.

**Option B: Fixed capacity**
The application runs on fixed-size instances. Scale up by upgrading the instance tier in Vercel console.

**Option C: Horizontal scaling**
The application runs behind a load balancer. Add/remove instances by adjusting the desired count in Vercel console.

**This project uses:** [CHOSEN_SCALING_APPROACH]

### Limits and Thresholds

| Resource | Soft Limit | Hard Limit | Action When Reached |
|----------|------------|------------|---------------------|
| API requests/minute | [SOFT_LIMIT] | [HARD_LIMIT] | Rate limiting triggers |
| DB connections | [SOFT_LIMIT] | [HARD_LIMIT] | Connection pooler queues |
| Storage | [SOFT_LIMIT] | [HARD_LIMIT] | Alert and review |

---

## Cost Considerations

### Monthly Cost Estimate

| Component | Environment | Estimated Cost | Billing Model |
|-----------|-------------|----------------|---------------|
| Compute | Staging | [COST] | [MODEL] |
| Compute | Production | [COST] | [MODEL] |
| Database | Staging | [COST] | [MODEL] |
| Database | Production | [COST] | [MODEL] |
| Storage | All | [COST] | [MODEL] |
| **Total** | | **[TOTAL_COST]** | |

### Cost Optimization Notes

- Staging environment can be paused/scaled down outside of business hours to reduce cost.
- Review usage dashboards on Vercel monthly.
- [Additional cost notes specific to the project]

---

## Secrets and Credentials

All credentials are documented in `06-security-team/credentials/` (gitignored).

| Secret | Used By | Storage Location |
|--------|---------|-----------------|
| Database password | API | [SECRETS_MANAGER] |
| JWT secret | API | [SECRETS_MANAGER] |
| [OTHER_SECRET] | [SERVICE] | [SECRETS_MANAGER] |

**Never commit secrets to source control.** See `06-security-team/guidelines/SECURITY-POLICY.md`.
