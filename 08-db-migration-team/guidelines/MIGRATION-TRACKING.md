# Migration Tracking Registry

This file is the single source of truth for all database migration scripts. Update it every time a migration script is created or applied.

---

## How to Use This File

1. **When creating a new migration script:** Add a row to the table below with `Applied Local`, `Applied Staging`, and `Applied Production` all set to `[ ]`.
2. **After applying locally:** Mark `Applied Local` as `[x]` and record the date in Notes.
3. **After applying to staging:** Mark `Applied Staging` as `[x]`.
4. **After applying to production:** Mark `Applied Production` as `[x]`.
5. **Never delete rows** — the full history must be preserved.

---

## Script Registry

| # | Script | Purpose | Task | Applied Local | Applied Staging | Applied Production | Notes |
|---|--------|---------|------|---------------|-----------------|-------------------|-------|
| 001 | `001-001-example.sql` | Example entry — replace with real scripts | TASK-000 | [ ] | [ ] | [ ] | |

---

## Column Definitions

| Column | Description |
|--------|-------------|
| # | Sequential script number |
| Script | Filename relative to `src/apps/api/db/migrations/` |
| Purpose | One-line description of what the script does |
| Task | The TASK-NNN or BUGFIX-NNN that introduced this migration |
| Applied Local | Checked when applied to local development DB |
| Applied Staging | Checked when applied to staging DB |
| Applied Production | Checked when applied to production DB |

---

## Naming Convention

```
NNN-SSS-description.sql
│    │   └─ Short kebab-case description
│    └───── Sub-sequence within a task (001, 002, ...)
└────────── Task number (e.g., 041 for TASK-041)
```

**Example:** `041-001-add-notifications-table.sql`

---

## Notes

- Scripts in `src/apps/api/db/migrations/` are applied incrementally to the local Docker DB.
- Scripts in `08-db-migration-team/migrations/cloud/` are cloud-specific and may differ from local scripts due to provider quirks.
- Scripts in `08-db-migration-team/migrations/local/` are local-only patches not intended for cloud environments.
- All scripts must be idempotent (`IF NOT EXISTS` / `IF EXISTS` guards).
- All scripts must include a rollback SQL block in comments or a companion `*-rollback.sql` file.
