# Implementation Policy

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Team | Initial version |

---

## Overview

The `03-implementation/` layer organizes all active and completed development work into three categories:

```
03-implementation/
├── tasks/          # Feature tasks and planned enhancements (TASK-NNN)
│   ├── active/
│   ├── backlog/
│   ├── completed/
│   └── templates/
│       ├── TASK-TEMPLATE/
│       ├── BUGFIX-TEMPLATE/
│       └── PATCH-TEMPLATE/
├── bugfix/         # Bug-fix work (BUGFIX-NNN)
│   ├── active/
│   ├── backlog/
│   └── completed/
└── patch/          # Cosmetic and minor UX patches (PATCH-NNN)
    ├── active/
    └── completed/
```

Each category has different documentation requirements scaled to the complexity and risk of the work.

---

## Task Categories

### Feature Tasks (TASK-NNN)

Used for new features, planned enhancements, and non-trivial refactors that require alignment with the PRD and architecture.

**Required documents:**

| File | Purpose |
|------|---------|
| `REFERENCES.md` | Links to PRD/ARCH versions used (REQUIRED) |
| `PLAN.md` | Implementation approach and strategy |
| `SPEC.md` | Technical specification (data model, API, UI) |
| `CHECKLIST.md` | Subtasks and completion tracking |
| `NOTES.md` | Decisions, blockers, and learnings |

**Folder structure:**

```
TASK-NNN-feature-name/
├── REFERENCES.md
├── PLAN.md
├── SPEC.md
├── CHECKLIST.md
└── NOTES.md
```

---

### Bug-Fix Tasks (BUGFIX-NNN)

Used for production bugs, deployment issues, and regressions. Lighter documentation — focus is on root cause analysis and verification.

**Required documents:**

| File | Purpose |
|------|---------|
| `PLAN.md` | Bug description, root cause, fix approach |
| `CHECKLIST.md` | Fix steps and verification criteria |
| `NOTES.md` | Investigation findings |

No `REFERENCES.md` or `SPEC.md` required. Bug-fixes don't need PRD/ARCH alignment.

**Folder structure:**

```
BUGFIX-NNN-description/
├── PLAN.md
├── CHECKLIST.md
└── NOTES.md
```

---

### Patch Tasks (PATCH-NNN)

Used for small cosmetic tweaks, spacing fixes, and minor UX improvements that don't fix bugs and don't add features. The lightest category.

**Required documents:**

| File | Purpose |
|------|---------|
| `PLAN.md` | What to change and why |
| `CHECKLIST.md` | Change items and verification |

No other files required.

**Folder structure:**

```
PATCH-NNN-description/
├── PLAN.md
└── CHECKLIST.md
```

---

## Decision Guide

Use this table to choose the right category:

| Scenario | Type | Example |
|----------|------|---------|
| New feature from roadmap | TASK-NNN | TASK-001-user-authentication |
| Enhancement to existing feature | TASK-NNN | TASK-002-search-improvement |
| Planned refactoring | TASK-NNN | TASK-003-api-layer-refactor |
| Production bug | BUGFIX-NNN | BUGFIX-001-login-failure |
| Deployment issue | BUGFIX-NNN | BUGFIX-002-cloud-timeout |
| Performance regression | BUGFIX-NNN | BUGFIX-003-slow-query |
| UI polish / spacing fix | PATCH-NNN | PATCH-001-button-spacing |
| Minor UX improvement | PATCH-NNN | PATCH-002-loading-indicator |
| Removing redundant UI elements | PATCH-NNN | PATCH-003-cleanup-nav-icons |

**When in doubt:** If it fixes a broken behavior, use BUGFIX. If it adds or changes functionality, use TASK. If it only adjusts appearance or minor UX feel, use PATCH.

---

## Workflows

### Feature Task Workflow

```
1. Create folder in 03-implementation/tasks/active/TASK-NNN-name/
2. Write REFERENCES.md — link to specific PRD and ARCHITECTURE versions
3. Write PLAN.md — implementation approach before coding
4. Write SPEC.md — technical details (data model, API, UI changes)
5. Create CHECKLIST.md — subtasks to track
6. Implement in src/
7. Update CHECKLIST.md as you progress
8. Document learnings in NOTES.md
9. Move folder to tasks/completed/ when done
```

### Bug-Fix Workflow

```
1. Create folder in 03-implementation/bugfix/active/BUGFIX-NNN-description/
2. Write PLAN.md — bug description, root cause analysis, fix approach
3. Create CHECKLIST.md — fix steps and verification criteria
4. Implement fix in src/
5. Update CHECKLIST.md as you progress
6. Document investigation findings in NOTES.md
7. Move folder to bugfix/completed/ when done
```

### Patch Workflow

```
1. Create folder in 03-implementation/patch/active/PATCH-NNN-description/
2. Write PLAN.md — cosmetic/UX issues and fix approach
3. Create CHECKLIST.md — change items
4. Implement changes in src/
5. Update CHECKLIST.md as you progress
6. Move folder to patch/completed/ when done
```

---

## Task Lifecycle

```
                  TASK / BUGFIX / PATCH
                        │
                        ▼
                    [backlog/]          ← optional staging area
                        │
                        ▼
                    [active/]           ← current work
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          blocked?           all done?
          (stay active,      move to
           add blocker       [completed/]
           to CHECKLIST)
```

---

## Quality Checklists

### Feature Task Quality Checklist

Before marking a TASK complete:

- [ ] REFERENCES.md links to correct PRD/ARCH versions
- [ ] Alignment status checked in REFERENCES.md
- [ ] Code implemented in `src/`
- [ ] CHECKLIST.md shows all items done
- [ ] Tests written (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Frontend follows design system guidelines
- [ ] Design review completed (if frontend work)
- [ ] Security review completed (if security-sensitive)
- [ ] Migration tracking updated (if schema changes)
- [ ] Test results documented
- [ ] Moved to `tasks/completed/`

### Bug-Fix Quality Checklist

Before marking a BUGFIX complete:

- [ ] Root cause documented in PLAN.md
- [ ] Fix implemented in `src/`
- [ ] CHECKLIST.md shows all fix steps done
- [ ] Bug is verified fixed (manual or automated test)
- [ ] No regressions introduced
- [ ] Investigation findings captured in NOTES.md
- [ ] Moved to `bugfix/completed/`

### Patch Quality Checklist

Before marking a PATCH complete:

- [ ] Changes described in PLAN.md
- [ ] Changes implemented in `src/`
- [ ] CHECKLIST.md shows all items done
- [ ] Visual verification (page loads, looks correct)
- [ ] No regressions introduced
- [ ] Moved to `patch/completed/`

---

## Numbering Policy

- Each category maintains its own independent numeric sequence:
  - TASK-001, TASK-002, TASK-003, …
  - BUGFIX-001, BUGFIX-002, BUGFIX-003, …
  - PATCH-001, PATCH-002, PATCH-003, …
- Numbers are never reused, even after a task is deleted or abandoned.
- Use zero-padded three-digit numbers (001, 002, …, 099, 100).
- Assign the next available number at folder creation time.

---

## PLAN.md Templates

### Feature Task PLAN.md

```markdown
# TASK-NNN: [Feature Name]

## Objective
What we are building and why.

## Approach

### Step 1: [Phase Name]
Description of this phase.

### Step 2: [Phase Name]
Description of this phase.

## Technical Considerations
- Consideration 1
- Consideration 2

## Testing Strategy
How we will verify this feature works correctly.

## Rollback Plan
How to revert if this causes problems.
```

### Bug-Fix PLAN.md

```markdown
# BUGFIX-NNN: [Bug Description]

## Bug Report
- **Reported**: YYYY-MM-DD
- **Environment**: [local/staging/production/all]
- **Severity**: [critical/high/medium/low]
- **Symptoms**: What the user experiences

## Root Cause Analysis
What is causing the bug and why.

## Fix Approach
How we plan to fix it.

## Verification
How we will confirm the fix works and no regressions are introduced.
```

### Patch PLAN.md

```markdown
# PATCH-NNN: [Description]

## What to Change
List the cosmetic/UX issues to address.

## Why
Why these changes improve the user experience.

## Changes
1. Change one
2. Change two

## Verification
How to visually confirm the changes look correct.
```
