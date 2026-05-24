# Project Structure — Content Forge

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version |

---

## Overview

Content Forge uses a **company-style organizational structure** that mirrors real software team disciplines. Each numbered folder represents a distinct team or concern. Work flows from strategy through implementation to deployment, with each layer maintaining versioned history.

---

## Full Folder Tree

```
Content Forge/
│
├── 01-management/                  # Strategy & leadership (WHY / WHEN)
│   ├── vision/
│   │   └── VISION.md               # Project north star, mission, long-term goals
│   ├── strategy/
│   │   ├── ROADMAP.md              # Priorities, milestones, timeline
│   │   └── OKRs.md                 # Objectives and key results
│   ├── decisions/
│   │   └── ADR-001-*.md            # Architecture decision records (immutable)
│   ├── meetings/
│   │   └── YYYY-MM-DD-topic.md     # Meeting notes
│   ├── versions/                   # Archived versions of strategy docs
│   └── CHANGELOG.md                # History of management-layer changes
│
├── 02-research/                    # R&D & requirements (WHAT)
│   ├── requirements/
│   │   └── PRD.md                  # Product requirements document
│   ├── architecture/
│   │   └── ARCHITECTURE.md         # System design, component boundaries, data flow
│   ├── spikes/
│   │   └── SPIKE-001-topic.md      # Time-boxed research investigations
│   ├── versions/                   # Archived versions of PRD & ARCHITECTURE
│   └── CHANGELOG.md                # History of research-layer changes
│
├── 03-implementation/              # Task plans & execution tracking (HOW)
│   ├── tasks/
│   │   ├── active/
│   │   │   └── TASK-NNN-name/      # In-progress feature tasks
│   │   │       ├── REFERENCES.md   # PRD/ARCH version links (REQUIRED)
│   │   │       ├── PLAN.md         # Implementation approach
│   │   │       ├── SPEC.md         # Technical specification
│   │   │       ├── CHECKLIST.md    # Subtask tracking
│   │   │       └── NOTES.md        # Decisions & observations
│   │   └── completed/              # Finished task folders (moved here when done)
│   ├── bugfix/
│   │   ├── active/
│   │   │   └── BUGFIX-NNN-name/    # In-progress bug fixes
│   │   │       ├── PLAN.md         # Root cause & fix approach
│   │   │       ├── CHECKLIST.md    # Fix steps & verification
│   │   │       └── NOTES.md        # Investigation notes
│   │   └── completed/
│   └── patch/
│       ├── active/
│       │   └── PATCH-NNN-name/     # In-progress UI patches
│       │       ├── PLAN.md         # What to change and why
│       │       └── CHECKLIST.md    # Change items
│       └── completed/
│
├── 04-quality/                     # QA & testing (IS IT RIGHT?)
│   ├── test-plans/
│   │   └── current/
│   │       └── TASK-NNN-tests.md   # Test plans with pass/fail results
│   ├── bug-reports/                # Filed bug reports
│   ├── screenshots/                # Visual evidence captures (gitignored)
│   └── test-scripts/               # Automation scripts and helpers
│
├── 05-design-team/                 # Design system & UI (LOOK & FEEL)
│   ├── guidelines/
│   │   ├── DESIGN-SYSTEM.md        # Color palette, typography, spacing tokens
│   │   ├── UI-PATTERNS.md          # Reusable UI patterns and component specs
│   │   ├── ICON-LIBRARY.md         # Lucide icon mappings and usage
│   │   ├── ACCESSIBILITY.md        # WCAG 2.1 AA requirements
│   │   └── LOCALIZATION.md         # Language and locale guidelines
│   ├── brand/
│   │   └── assets/                 # Logo files, color swatches, brand assets
│   └── reviews/
│       ├── REVIEW-TEMPLATE.md      # Standard design review template
│       └── TASK-NNN-review.md      # Per-task design review records
│
├── 06-security-team/               # Security policy & audits (IS IT SECURE?)
│   ├── guidelines/
│   │   ├── SECURITY-POLICY.md      # Overall security standards and requirements
│   │   ├── API-SECURITY.md         # API authentication, authorization patterns
│   │   ├── DATA-SECURITY.md        # Data handling, encryption, PII policy
│   │   └── DEPLOYMENT-SECURITY.md  # Secrets management, environment hardening
│   ├── audits/                     # Completed security audit reports
│   └── reviews/                    # Per-task security review records
│
├── 07-deployment-team/             # Deployment & infrastructure (HOW TO SHIP)
│   ├── guidelines/
│   │   ├── DEPLOYMENT-STRATEGY.md  # Deployment process, environments, rollback
│   │   ├── INFRASTRUCTURE.md       # Vercel setup, configuration, scaling
│   │   └── MONITORING.md           # Logging, alerting, observability
│   ├── releases/                   # Release history with version notes
│   └── reviews/                    # Per-deployment review records
│
├── 08-db-migration-team/           # Database schema evolution (SCHEMA SYNC)
│   ├── guidelines/
│   │   ├── MIGRATION-POLICY.md     # Migration standards, naming, rollback rules
│   │   └── MIGRATION-TRACKING.md   # Audit log of all applied migrations
│   ├── migrations/
│   │   ├── local/                  # Local-only patch migrations
│   │   └── cloud/                  # Supabase cloud-specific migrations
│   ├── audits/                     # Schema audit reports
│   └── reviews/                    # Per-migration review records
│
└── src/                            # All source code
    └── apps/
        ├── content-forge/             # e.g., admin, api, student, teacher
        └── ...
```

---

## Layer Descriptions

| Layer | Team | Responsibility | Key Documents |
|-------|------|----------------|---------------|
| `01-management/` | Leadership | Strategy, vision, decisions | VISION.md, ROADMAP.md, ADR-NNN |
| `02-research/` | Product & Architecture | Requirements, system design | PRD.md, ARCHITECTURE.md, SPIKE-NNN |
| `03-implementation/` | Engineering | Task planning, execution tracking | TASK-NNN, BUGFIX-NNN, PATCH-NNN |
| `04-quality/` | QA | Testing, verification, bug tracking | Test plans, bug reports, screenshots |
| `05-design-team/` | Design | UI guidelines, design system | DESIGN-SYSTEM.md, UI-PATTERNS.md |
| `06-security-team/` | Security | Security policy, audits | SECURITY-POLICY.md, API-SECURITY.md |
| `07-deployment-team/` | DevOps | Deployment, infrastructure | DEPLOYMENT-STRATEGY.md, releases |
| `08-db-migration-team/` | Database | Schema evolution, migrations | MIGRATION-TRACKING.md, SQL scripts |

---

## Document Flow

Work flows from strategy through implementation to deployment:

```
01-management/vision/VISION.md          (WHY — the north star)
        |
        v
01-management/strategy/ROADMAP.md       (WHEN — priorities & timeline)
        |
        v
02-research/requirements/PRD.md         (WHAT — product requirements)
        |
        v
02-research/architecture/ARCHITECTURE.md (HOW — system design)
        |
        v
03-implementation/tasks/active/TASK-NNN/ (DO — implementation plan)
   REFERENCES.md  <-- links back to PRD & ARCH versions
   PLAN.md + SPEC.md + CHECKLIST.md
        |
        v
src/  (code)
        |
        v
04-quality/test-plans/                  (VERIFY — test results)
        |
        +---> 05-design-team/reviews/   (if frontend work)
        +---> 06-security-team/reviews/ (if security-sensitive)
        +---> 08-db-migration-team/     (if schema changes)
        |
        v
07-deployment-team/releases/            (SHIP — release record)
```

---

## Naming Conventions

| Document Type | Pattern | Example |
|---------------|---------|---------|
| Architecture Decision Record | `ADR-NNN-short-title.md` | `ADR-001-use-postgresql.md` |
| Research Spike | `SPIKE-NNN-topic.md` | `SPIKE-003-auth-options.md` |
| Feature Task folder | `TASK-NNN-description/` | `TASK-012-user-login/` |
| Bug Fix folder | `BUGFIX-NNN-description/` | `BUGFIX-004-null-pointer-crash/` |
| UI Patch folder | `PATCH-NNN-description/` | `PATCH-002-fix-button-padding/` |
| Meeting notes | `YYYY-MM-DD-topic.md` | `2026-02-19-sprint-review.md` |
| Design review | `TASK-NNN-review.md` | `TASK-012-review.md` |
| Test plan | `TASK-NNN-tests.md` | `TASK-012-tests.md` |

**NNN is a zero-padded 3-digit number.** Numbers are globally unique across TASK/BUGFIX/PATCH/ADR/SPIKE within each category.

---

## Key File Locations

| Purpose | File Path |
|---------|-----------|
| Project north star | `01-management/vision/VISION.md` |
| Current roadmap | `01-management/strategy/ROADMAP.md` |
| Product requirements | `02-research/requirements/PRD.md` |
| System architecture | `02-research/architecture/ARCHITECTURE.md` |
| Active tasks | `03-implementation/tasks/active/` |
| Active bug fixes | `03-implementation/bugfix/active/` |
| Active patches | `03-implementation/patch/active/` |
| Design system | `05-design-team/guidelines/DESIGN-SYSTEM.md` |
| Icon mappings | `05-design-team/guidelines/ICON-LIBRARY.md` |
| Security policy | `06-security-team/guidelines/SECURITY-POLICY.md` |
| API security | `06-security-team/guidelines/API-SECURITY.md` |
| Deployment strategy | `07-deployment-team/guidelines/DEPLOYMENT-STRATEGY.md` |
| Infrastructure docs | `07-deployment-team/guidelines/INFRASTRUCTURE.md` |
| Migration policy | `08-db-migration-team/guidelines/MIGRATION-POLICY.md` |
| Migration audit log | `08-db-migration-team/guidelines/MIGRATION-TRACKING.md` |

---

## Versioning Rules

### Versioned Documents

The following documents are **versioned** and must not be modified in-place without archiving:

- `02-research/requirements/PRD.md`
- `02-research/architecture/ARCHITECTURE.md`
- Any document in `01-management/`

**Update procedure:**
1. Copy current version to `versions/` with a version suffix: e.g., `PRD-v1.1.md`
2. Increment the version header in the main document
3. Add an entry to the layer's `CHANGELOG.md`
4. Check `REFERENCES.md` in active tasks for alignment

### ADRs Are Immutable

Architecture Decision Records (`ADR-NNN-*.md`) are **never modified** after creation. To reverse or update a decision, create a new ADR with a `Supersedes: ADR-NNN` line in its header.

### REFERENCES.md (Required for Feature Tasks)

Every `TASK-NNN` folder must include a `REFERENCES.md` that links to the specific versions of PRD and ARCHITECTURE that the task is based on. This creates a traceable audit trail.

```markdown
# References

## Based On
| Document | Version | Date |
|----------|---------|------|
| PRD | v1.2 | 2026-03-19 |
| ARCHITECTURE | v1.0 | 2026-03-19 |

## Alignment Status
- [ ] Still aligned with current PRD
- [ ] Still aligned with current ARCHITECTURE
```

---

## Task Categories — Quick Reference

| Scenario | Category | Folder |
|----------|----------|--------|
| New feature or enhancement | TASK | `tasks/active/` |
| Planned refactoring | TASK | `tasks/active/` |
| Production bug | BUGFIX | `bugfix/active/` |
| Deployment incident | BUGFIX | `bugfix/active/` |
| Performance regression | BUGFIX | `bugfix/active/` |
| UI spacing / cosmetic | PATCH | `patch/active/` |
| Removing redundant UI | PATCH | `patch/active/` |
| Minor UX improvement | PATCH | `patch/active/` |

Move the folder to the corresponding `completed/` subfolder when done.
