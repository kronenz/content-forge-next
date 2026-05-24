# Deployment Strategy

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Philosophy

Deployments must be **repeatable, reversible, and observable**. Every production change goes through a staging environment first. No manual steps that are not documented in this guide.

<!-- Choose one strategy below and remove the others, or describe a hybrid. -->

### Option A: Blue-Green Deployment

Maintain two identical production environments (blue and green). At any time, one is live and the other is idle. Deploy to the idle environment, validate, then switch the router.

- Zero downtime cutover
- Instant rollback by switching the router back
- Doubles infrastructure cost during transition
- Suited for: Vercel edge worker deployments, serverless

### Option B: Rolling Deployment

Incrementally replace instances of the old version with the new version. Traffic is served by a mix of old and new instances during the transition.

- Gradual rollout reduces blast radius
- No spare environment needed
- Rollback requires a re-deploy
- Suited for: containerized services, Kubernetes

### Option C: Canary Deployment

Route a small percentage of traffic (e.g., 5%) to the new version, monitor, then gradually increase to 100%.

- Fine-grained risk control
- Requires feature-flag or traffic-split infrastructure
- Suited for: high-traffic applications where risk is greatest

**This project uses:** [CHOSEN_STRATEGY]

---

## Environment Matrix

| Environment | Platform | URL | Purpose | Who Deploys |
|-------------|----------|-----|---------|-------------|
| Local | Developer machine | `localhost` | Development & unit testing | Developer |
| Staging | Vercel | [STAGING_URL] | Integration & QA testing | CI/CD or developer |
| Production | Vercel | [PRODUCTION_URL] | Live users | CI/CD (gated) |

### Environment Promotion Flow

```
Local → Staging → Production
```

Changes must pass automated tests on staging before production promotion. Hotfixes may bypass staging only with lead approval and must be back-ported immediately.

---

## Release Process

### Standard Release

1. **Feature complete on a branch** — all code reviewed and approved.
2. **Merge to main** — triggers CI pipeline.
3. **CI runs tests** — unit, integration, lint. Fail = block deploy.
4. **Deploy to staging** — automatic on main merge.
5. **QA verification on staging** — smoke tests and acceptance criteria.
6. **Deploy to production** — manual approval gate or tagged release.
7. **Post-deploy smoke test** — verify critical paths are live.
8. **Update release log** — add entry to `07-deployment-team/releases/`.

### Hotfix Release

1. Branch from the current production tag.
2. Apply minimal fix.
3. Test locally and on staging (expedited).
4. Deploy to production with lead approval.
5. Merge hotfix back to main.

---

## Rollback Procedures

### When to Rollback

Roll back immediately when any of the following occur within [ROLLBACK_WINDOW] of deploy:
- Error rate exceeds [ERROR_RATE_THRESHOLD]%
- P95 latency exceeds [LATENCY_THRESHOLD_MS] ms
- Critical user-facing feature is broken
- Data integrity issue detected

### How to Rollback

**Blue-Green:** Switch the router back to the previous environment.

```bash
# Example: Cloudflare Workers rollback
wrangler rollback --env production
```

**Rolling / Canary:** Re-deploy the previous tagged version.

```bash
# Re-deploy last known good tag
git checkout [LAST_GOOD_TAG]
[DEPLOY_COMMAND]
```

**Database migrations:** See `08-db-migration-team/guidelines/MIGRATION-POLICY.md` for rollback SQL procedures. Application rollback and schema rollback must be coordinated.

---

## Deployment Checklist

Before every production deployment:

- [ ] All tests passing in CI
- [ ] Security review completed (if applicable)
- [ ] Database migrations tested on staging
- [ ] Environment variables verified on target environment
- [ ] Rollback plan confirmed and documented
- [ ] On-call engineer notified
- [ ] Monitoring dashboards open and baseline recorded
- [ ] Deploy window approved (avoid peak hours: [PEAK_HOURS])
- [ ] Post-deploy smoke test script ready

After every production deployment:

- [ ] Smoke test passed
- [ ] Error rate is within normal range
- [ ] Latency is within normal range
- [ ] Release entry added to `07-deployment-team/releases/`
- [ ] Team notified via [NOTIFICATION_CHANNEL]
