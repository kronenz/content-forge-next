# Database Migration Policy

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Migration Principles

All database schema changes must follow these principles:

1. **Idempotent** — Scripts must be safe to run multiple times without side effects. Use `IF NOT EXISTS` / `IF EXISTS` guards on all DDL statements.
2. **Reversible** — Every migration must include a rollback section documenting how to undo the change.
3. **Tested locally first** — All migrations must be validated against a local development database before being applied to staging or production.
4. **Reviewed** — All DDL changes require a migration review before deployment (see Review Process below).
5. **Tracked** — Every applied migration must be recorded in `MIGRATION-TRACKING.md`.

---

## Script Header Template

Every migration script must begin with the following header:

```sql
-- ============================================================
-- Migration: [NNN-SSS-description.sql]
-- Purpose:   [What this migration does and why]
-- Task:      [TASK-NNN or BUGFIX-NNN that requires this change]
-- Depends:   [List prerequisite migration scripts, or "none"]
-- Rollback:  [SQL or instructions to reverse this migration]
-- Author:    Kronenz
-- Date:      2026-03-19
-- ============================================================
```

Do not submit a migration script without a complete header.

---

## Naming Convention

Migration scripts use the following naming pattern:

```
NNN-SSS-description.sql
```

| Segment | Meaning | Example |
|---------|---------|---------|
| `NNN` | Task or patch number (3 digits) | `042` |
| `SSS` | Sequential script number within that task (3 digits) | `001` |
| `description` | Short kebab-case description of the change | `add-notifications-table` |

**Examples:**
- `042-001-add-notifications-table.sql`
- `042-002-add-notification-indexes.sql`
- `043-001-add-batch-id-to-notifications.sql`

---

## File Location Rules

| Script Type | Location |
|-------------|----------|
| Fresh database initialization | `[INIT_SCRIPTS_PATH]` |
| Incremental API migration | `src/apps/api/db/migrations/` |
| Cloud-specific migration | `08-db-migration-team/migrations/cloud/` |
| Local-only patch | `08-db-migration-team/migrations/local/` |

> Replace `[INIT_SCRIPTS_PATH]` with the path to your Docker or seed initialization scripts.

---

## Testing Requirements

Before any migration is applied to staging or production:

- [ ] Script runs successfully on a clean local database
- [ ] Script is idempotent (can be run twice without error or duplicate data)
- [ ] Dependent migrations have been applied first
- [ ] Application code that uses the new/modified schema has been tested locally
- [ ] Rollback SQL has been tested and confirmed to restore the previous state

---

## Review Process

All migrations involving DDL (CREATE, ALTER, DROP, RENAME) require a migration review:

1. Create a review document in `08-db-migration-team/reviews/` using the review template.
2. Include the full migration script and rollback SQL in the review document.
3. Obtain sign-off from [REVIEWER_ROLE] before applying to staging.
4. After staging validation, obtain sign-off from [REVIEWER_ROLE] before applying to production.
5. Record the review outcome in `MIGRATION-TRACKING.md`.

DML-only changes (INSERT, UPDATE, DELETE for seed/backfill data) may proceed without a formal review but must still be tracked.

---

## Cloud Deployment Procedure

> Replace `Supabase` with your cloud database provider (e.g., Supabase, Neon, PlanetScale, RDS).

1. **Verify local success** — Confirm the migration passes all testing requirements above.
2. **Apply to staging** — Use the Supabase management interface or API to run the migration against the staging database. Do not use direct psql connections if the provider restricts them.
3. **Validate staging** — Run application smoke tests against staging after the migration.
4. **Schedule production window** — Coordinate with the team to minimize user impact.
5. **Apply to production** — Use the same method as staging. Run one statement at a time for large or risky migrations.
6. **Validate production** — Run smoke tests and monitor error rates immediately after applying.
7. **Update tracking** — Record the migration in `MIGRATION-TRACKING.md` with the applied date and environment.

**Supabase-specific notes:** [Document any provider-specific constraints — e.g., connection method, transaction limitations, migration UI location]

---

## Rollback Procedures

Every migration script must include rollback SQL in its header comment. To roll back a migration:

1. Review the rollback SQL in the migration script header.
2. Test the rollback on a local or staging database first.
3. Apply the rollback in the target environment using the same method as the forward migration.
4. Verify application functionality after rollback.
5. Update `MIGRATION-TRACKING.md` to mark the migration as rolled back.

**Important:** Some migrations are not safely reversible after data has been written (e.g., dropping a column that contained data). Document these cases explicitly in the migration header and require explicit approval before applying to production.
