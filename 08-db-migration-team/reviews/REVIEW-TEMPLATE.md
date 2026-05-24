# Migration Review — [SCRIPT FILENAME]

**Script:** [NNN-NNN-description.sql]
**Task Reference:** [TASK-NNN or BUGFIX-NNN]
**Reviewer:** [NAME]
**Date:** 2026-03-19

---

## Script Details

| Field | Value |
|-------|-------|
| File | [NNN-NNN-description.sql] |
| Tables Affected | [TABLE_1, TABLE_2] |
| Operation Type | [CREATE TABLE / ALTER TABLE / ADD INDEX / etc.] |
| Dependencies | [List prerequisite migration scripts, or "None"] |
| Estimated Run Time | [e.g., < 1s / < 1min / may be slow on large tables] |
| Reversible | [ ] Yes  [ ] No |

---

## Review Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Script is idempotent (`IF NOT EXISTS` / `IF EXISTS` guards) | [ ] Pass  [ ] Fail  [ ] N/A | |
| Script header documents purpose, task, dependencies, rollback | [ ] Pass  [ ] Fail  [ ] N/A | |
| Rollback SQL included and tested | [ ] Pass  [ ] Fail  [ ] N/A | |
| Tested successfully on local database | [ ] Pass  [ ] Fail  [ ] N/A | |
| No data loss on existing rows | [ ] Pass  [ ] Fail  [ ] N/A | |
| Foreign keys reference correct columns | [ ] Pass  [ ] Fail  [ ] N/A | |
| Indexes added for new FK columns | [ ] Pass  [ ] Fail  [ ] N/A | |
| Cloud migration script prepared (if differences exist) | [ ] Pass  [ ] Fail  [ ] N/A | |
| `MIGRATION-TRACKING.md` updated | [ ] Pass  [ ] Fail  [ ] N/A | |

---

## Findings

| # | Severity | Description | Required Fix |
|---|----------|-------------|--------------|
| 1 | [Critical / Major / Minor] | [DESCRIPTION] | [ ] Yes  [ ] No |
| 2 | [Critical / Major / Minor] | [DESCRIPTION] | [ ] Yes  [ ] No |

---

## Rollback SQL

```sql
-- [ROLLBACK SQL HERE]
-- Example: DROP TABLE IF EXISTS [table_name];
-- Example: ALTER TABLE [table] DROP COLUMN IF EXISTS [column];
```

---

## Verdict

[ ] **Approved** — Safe to apply to staging and production.
[ ] **Needs Changes** — Required fixes listed above. Re-review after fixes.
[ ] **Rejected** — Script has critical issues. Must not be applied.

**Comments:**

[Any additional notes for the implementer or DB migration team.]
