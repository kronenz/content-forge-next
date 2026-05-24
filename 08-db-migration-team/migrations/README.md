# Database Migrations

This directory contains migration scripts organized by target environment.

---

## Directory Structure

```
migrations/
├── local/    — Incremental migrations for the local development database
└── cloud/    — Cloud-specific migration scripts
```

---

## local/

Scripts in `local/` are applied incrementally to the local Docker-based development database. These are the canonical migration scripts that match `src/apps/api/db/migrations/`.

**When to add a script here:**
- Any schema change that needs to be applied to local dev environments.
- Patches or fixes that only affect local development (not intended for cloud).

**Naming convention:** `NNN-SSS-description.sql`

---

## cloud/

Scripts in `cloud/` are written specifically for cloud database providers (e.g., Supabase, Neon). They may differ from local scripts because:

- Cloud providers may not support all PostgreSQL syntax.
- Some operations require provider-specific APIs (e.g., Supabase Management API).
- Column names or constraints may differ between local and cloud schemas due to historical drift.
- `BEGIN` / `COMMIT` blocks may need to be stripped for certain cloud execution methods.

**When to add a script here:**
- When a local migration cannot be applied directly to the cloud provider.
- When a cloud-specific fix is needed that doesn't affect local dev.

**Naming convention:** `CLOUD-vMAJOR.MINOR-NNN-description.sql`

---

## Applying Migrations

### Local

```bash
# Apply via psql
psql -h localhost -p [PORT] -U [USER] -d [DATABASE] -f migrations/local/NNN-NNN-description.sql

# Or apply via the API migration runner (if configured)
npx tsx src/apps/api/db/migrate.ts
```

### Cloud

Refer to `08-db-migration-team/guidelines/MIGRATION-POLICY.md` for cloud-specific application procedures. Direct psql connections to cloud providers may not be available — use the provider's API or console instead.

---

## Tracking

All scripts must be registered in `08-db-migration-team/guidelines/MIGRATION-TRACKING.md` after creation, and the tracking table updated after each environment application.
