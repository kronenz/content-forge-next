# Deployment Security Guidelines

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Environment Separation

| Environment | Purpose | Access |
|-------------|---------|--------|
| Development | Local developer machines | Developer only |
| Staging | Pre-production testing | Team + QA |
| Production | Live user-facing system | Restricted — ops/lead only |

Rules:
- Each environment must have its own isolated infrastructure, credentials, and configuration.
- Production data must never be copied to development or staging without sanitization/anonymization.
- Staging must mirror production configuration as closely as possible.
- Developers must not have direct write access to the production database or servers.

---

## Secrets Management

- **No secrets in source code or version control.** This includes `.env` files committed to the repository, hardcoded API keys, and inline credentials.
- Use environment variables injected at deploy time by a CI/CD system or secrets manager.
- Secrets manager / secrets store for this project: **[SECRETS_MANAGER_NAME]**
- Secret rotation schedule: **[ROTATION_PERIOD]** (or immediately upon suspected compromise)
- Secrets required per environment:

| Secret | Dev | Staging | Production |
|--------|-----|---------|-----------|
| [SECRET_NAME] | [SOURCE] | [SOURCE] | [SOURCE] |

> Replace rows with actual secret names and their source for each environment.

---

## Network Security

- All public-facing services must be behind a load balancer or reverse proxy with TLS termination.
- Database servers and internal services must not be directly reachable from the public internet.
- Use a firewall or security group to restrict inbound traffic to only required ports and sources.
- Restrict outbound traffic from application servers to only required destinations where feasible.
- Content Forge-specific network topology: [Describe or link to infrastructure diagram]

---

## Container and Server Hardening

If using containers:
- Use minimal base images (e.g., distroless, Alpine) to reduce attack surface.
- Run containers as a non-root user.
- Do not mount the Docker socket into containers.
- Scan container images for vulnerabilities before deployment (e.g., Trivy, Snyk, Docker Scout).
- Pin base image versions — do not use `:latest` tags in production.

If using servers:
- Apply OS security patches promptly.
- Disable unused services and close unused ports.
- Use SSH key authentication; disable password-based SSH login.
- Enable automatic security updates for critical patches.

---

## CI/CD Pipeline Security

- CI/CD systems must not have broader permissions than needed to deploy the application.
- Secrets injected into the pipeline must be masked in logs and not echoed in output.
- Pull request pipelines must not have access to production secrets.
- Require code review and approval before merging to the branch that triggers production deployments.
- Audit CI/CD system access logs periodically.
- Content Forge-specific CI/CD platform: **GitHub Actions** (e.g., GitHub Actions, GitLab CI)
- Deployment approval required: **[YES / NO]** — [describe approval gate if yes]

---

## Monitoring and Alerting

- **Application logs:** Log all authentication events (login success, login failure, logout, token refresh). Log authorization failures. Do not log PII or secrets.
- **Error tracking:** Route uncaught exceptions and 5xx errors to an error tracking service (e.g., [ERROR_TRACKING_TOOL]).
- **Uptime monitoring:** Monitor the health endpoint of each service. Alert on downtime within [ALERT_THRESHOLD].
- **Security alerting:** Alert on:
  - Repeated authentication failures from the same IP (potential brute force)
  - Rate limit violations above a threshold
  - Unexpected spikes in 4xx or 5xx errors
  - [Additional project-specific alerts]
- **Alerting channel:** [ALERTING_CHANNEL] (e.g., email, Slack, PagerDuty)
- **On-call rotation:** [Describe or link to on-call policy]

---

## Pre-Deployment Security Checklist

Before every production deployment:

- [ ] No secrets committed to version control
- [ ] Dependency vulnerability scan completed and critical issues resolved
- [ ] Security headers verified in staging
- [ ] TLS certificate valid and not near expiry
- [ ] Database migrations tested in staging
- [ ] Authentication and authorization smoke-tested in staging
- [ ] Rate limiting verified in staging
- [ ] Rollback plan documented and tested
- [ ] Monitoring and alerting confirmed active
- [ ] Content Forge-specific checks: [Add any project-specific items]
