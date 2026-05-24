# Content Forge - Project Instructions

## Project Overview

AI Agent 기반 콘텐츠 수집-가공-발행 자동화 플랫폼.
수집된 정보를 편집국 구조의 AI Agent 파이프라인이 가공하여 멀티 플랫폼에 발행한다.

---

## Project Structure

This project follows a **company-style organizational structure**. Always respect the layer separation.

```
01-management/        → Strategy (WHY/WHEN)        + versions/
02-research/          → R&D (WHAT)                 + versions/
03-implementation/    → Task Plans (HOW)           + tasks/ & bugfix/ & patch/
04-quality/           → QA (IS IT RIGHT?)          + test-plans/ & screenshots/
05-design-team/       → Design (LOOK & FEEL)       + guidelines/ & reviews/
06-security-team/     → Security (IS IT SECURE?)   + guidelines/ & audits/
07-deployment-team/   → Deployment (HOW TO SHIP)   + guidelines/ & releases/
08-db-migration-team/ → DB Migration (SCHEMA SYNC) + migrations/ & audits/
src/                  → Actual Code
cli/                  → CLI Agent Module
```

**Versioning:** Each layer maintains history via `versions/` subfolders and `CHANGELOG.md`.

See [PROJECT-STRUCTURE-TEMPLATE.md](PROJECT-STRUCTURE-TEMPLATE.md) for full documentation.

---

## Language Policy

**Documentation and planning documents MUST be written in English.** The application serves a Korean-language market, so the actual app UI uses Korean.

| Context | Language | Examples |
|---------|----------|---------|
| Code & comments | English | Variable names, code comments, commit messages |
| Planning docs | English | PRD, ARCHITECTURE, PLAN.md, SPEC.md, requirements docs |
| Task documents | English | CHECKLIST.md, NOTES.md, REFERENCES.md |
| Design guidelines | English | DESIGN-SYSTEM.md, UI-PATTERNS.md |
| App UI labels | Korean | Button text, form labels, error messages, tooltips |
| App UI content | Korean | User-facing strings in templates |

**When referencing Korean UI terms in docs**, use the format: `English term (Korean: native text)`.

---

## Key Reference Documents

구현 전 반드시 관련 문서를 읽어야 한다. 추측으로 구현하지 말 것.

| Document | Purpose | Location |
|----------|---------|----------|
| Overview | 프로젝트 전체 맥락 | `02-research/requirements/prd-original/00-overview.md` |
| Architecture | 시스템 구조, 도메인 모델 | `02-research/requirements/prd-original/01-architecture.md` |
| Source Collection | 소스 수집 기능 | `02-research/requirements/prd-original/02-source-collection.md` |
| AI Agent Pipeline | Agent 역할, 입출력 스펙 | `02-research/requirements/prd-original/03-ai-agent-pipeline.md` |
| Content Publishing | 발행 기능 | `02-research/requirements/prd-original/04-content-publishing.md` |
| Platform Preview | 프리뷰 컴포넌트 | `02-research/requirements/prd-original/05-platform-preview.md` |
| Quality Review | 검토/승인 시스템 | `02-research/requirements/prd-original/06-quality-review.md` |
| UI/UX | UI 레이아웃, 화면 설계 | `02-research/requirements/prd-original/07-ui-ux.md` |
| Business Model | 과금, 플랜 제한 | `02-research/requirements/prd-original/08-business-model.md` |
| Tech Stack | 기술 선택, 구조 | `02-research/requirements/prd-original/09-tech-stack.md` |
| Roadmap | 구현 순서, 우선순위 | `01-management/strategy/ROADMAP-original.md` |
| SEO Strategy | SEO 관련 | `02-research/requirements/prd-original/11-seo-strategy.md` |
| VISION | 프로젝트 비전 | `01-management/vision/VISION.md` |
| PRD (consolidated) | 통합 요구사항 | `02-research/requirements/PRD.md` |
| ARCHITECTURE | 시스템 아키텍처 | `02-research/architecture/ARCHITECTURE.md` |
| ROADMAP | 로드맵 & 마일스톤 | `01-management/strategy/ROADMAP.md` |

---

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui + Tailwind CSS 4
- **State**: Zustand + TanStack Query
- **API**: tRPC
- **DB**: PostgreSQL (Supabase) + Drizzle ORM
- **Queue**: BullMQ (Redis/Upstash)
- **AI**: Vercel AI SDK + Claude API (primary) + OpenAI (secondary)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Testing**: Vitest (unit) + Playwright (E2E)
- **CI/CD**: GitHub Actions (self-hosted runner)
- **Deployment**: Vercel (production) + Docker (local/on-prem)

---

## Domain Model

구현 시 이 이름과 관계를 일관되게 사용할 것.

```
Source → RawContent → PipelineRun → PipelineStep
                                  → ProcessedContent → Review → Publication
```

- **Source**: 수집 소스 (RSS, API, Research 등)
- **RawContent**: 수집된 원본 데이터
- **PipelineRun**: 파이프라인 1회 실행 단위
- **PipelineStep**: 파이프라인 내 Agent 1단계 (입력/출력/상태 기록)
- **ProcessedContent**: 플랫폼별 가공 완료 콘텐츠
- **Review**: 품질 평가 + 승인/반려
- **Publication**: 발행 기록 + 성과 메트릭

---

## AI Agent Roles (Editorial Room Structure)

| Agent | Role | Key Output |
|-------|------|------------|
| Analyst | 원본 분석, 인사이트 추출 | AnalysisReport |
| Writer | 플랫폼별 초안 작성 | DraftContents |
| Editor | 품질 교정, 점수 산출 | EditedContents + EditReport |
| Designer | 비주얼 에셋 생성 지시 | DesignSpecs |
| SEO Optimizer | 검색 최적화 | SEOReport |
| Fact Checker | 사실 관계 검증 | FactCheckReport |
| Compliance | 저작권/정책 준수 확인 | ComplianceReport |
| Localizer | 문화적/언어적 현지화 | LocalizedContents |
| Platform Formatter | 플랫폼 포맷 변환 | FormattedContents |

---

## Coding Conventions

### File Structure
- `src/app/` - Next.js App Router pages
- `src/components/` - UI components
- `src/server/` - Server logic (API, DB, Agents, Pipeline)
- `src/lib/` - Utilities, config
- `src/types/` - Shared type definitions
- `cli/` - CLI Agent Module
- `worker/` - Background worker processes

### Naming
- Files: kebab-case (`pipeline-monitor.tsx`)
- Components: PascalCase (`PipelineMonitor`)
- Functions/Variables: camelCase (`getPipelineRun`)
- DB Tables/Columns: snake_case (`pipeline_runs.started_at`)
- Types: PascalCase (`PipelineRun`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### Patterns
- Server Components by default. Client Components require `"use client"`
- DB queries via Drizzle ORM only. No raw SQL
- AI calls via Vercel AI SDK `generateText`/`streamText`
- Error handling via tRPC's `TRPCError`
- Environment variables validated with zod in `src/lib/env.ts`

### Quality Standards
- 5 quality metrics (UI display): Quality, Accuracy, Human-like, Platform-fit, Culture-fit
- Scores: 0-10 (1 decimal place)
- Pipeline event names must match the event catalog in ARCHITECTURE

---

## Design Team Policy (CRITICAL)

**All frontend-related work MUST comply with design team guidelines.**

### Before Any Frontend Work

1. **Review Design System** — Check `05-design-team/guidelines/DESIGN-SYSTEM.md`
2. **Follow UI Patterns** — Use patterns from `05-design-team/guidelines/UI-PATTERNS.md`
3. **Ensure Accessibility** — Meet requirements in `05-design-team/guidelines/ACCESSIBILITY.md`

### Frontend Implementation Checklist

- [ ] Colors match design system palette
- [ ] Typography follows the defined scale
- [ ] Spacing uses design tokens (4px base grid)
- [ ] Components follow design specifications
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Mobile-responsive
- [ ] Uses Lucide icons (no emojis in UI)

### Design Review Required

Frontend tasks require a design review document before completion:
1. Create review document: `05-design-team/reviews/TASK-NNN-review.md`
2. Use the template from: `05-design-team/reviews/REVIEW-TEMPLATE.md`

### App-Specific Guidelines

| App | UI Library | Key Guidelines |
|-----|------------|----------------|
| content-forge | shadcn/ui | Tailwind CSS 4, Server Components default, Korean UI labels |

---

## Security Team Policy (CRITICAL)

**All security-sensitive work MUST comply with security team guidelines.**

### Before Any Security-Related Work

1. **Review Security Policy** — Check `06-security-team/guidelines/SECURITY-POLICY.md`
2. **Follow API Security** — Use patterns from `06-security-team/guidelines/API-SECURITY.md`
3. **Ensure Data Protection** — Meet requirements in `06-security-team/guidelines/DATA-SECURITY.md`
4. **Check Deployment Security** — Follow `06-security-team/guidelines/DEPLOYMENT-SECURITY.md`

### Security Implementation Checklist

- [ ] Input validation on all user inputs
- [ ] Parameterized queries (Drizzle ORM — no SQL injection)
- [ ] Proper authentication checks (Supabase Auth)
- [ ] Role-based authorization
- [ ] Sensitive data encrypted at rest and in transit
- [ ] Rate limiting configured
- [ ] Security headers set
- [ ] No secrets committed to source control

---

## Deployment Team Policy (CRITICAL)

**All deployment-related work MUST comply with deployment team guidelines.**

### Before Any Deployment Work

1. **Review Deployment Strategy** — Check `07-deployment-team/guidelines/DEPLOYMENT-STRATEGY.md`
2. **Follow Infrastructure Guidelines** — Use patterns from `07-deployment-team/guidelines/INFRASTRUCTURE.md`
3. **Set Up Monitoring** — Meet requirements in `07-deployment-team/guidelines/MONITORING.md`

### Deployment Checklist

- [ ] All tests passing
- [ ] Security review completed
- [ ] Performance benchmarks met
- [ ] Database migrations tested on staging
- [ ] Rollback plan documented
- [ ] Monitoring and alerting configured

---

## DB Migration Team Policy (CRITICAL)

**All database schema changes MUST be tracked by the DB Migration Team.**

### Before Any Schema Change

1. **Review Migration Policy** — Check `08-db-migration-team/guidelines/MIGRATION-POLICY.md`
2. **Check Migration Tracking** — Review `08-db-migration-team/guidelines/MIGRATION-TRACKING.md`
3. **Verify Dependencies** — Ensure prerequisite migrations are documented

### Migration Checklist

- [ ] Migration script created with proper header
- [ ] Script is idempotent (`IF NOT EXISTS` / `IF EXISTS` guards)
- [ ] `MIGRATION-TRACKING.md` updated
- [ ] Tested on local database
- [ ] Cloud migration script prepared (if deploying to Vercel)
- [ ] Rollback SQL included

---

## Working with Tasks

### When Given a New Feature/Task

1. **Create a task folder** in `03-implementation/tasks/active/`:
   ```
   TASK-NNN-feature-name/
   ├── REFERENCES.md   # Links to PRD/ARCH versions (REQUIRED)
   ├── PLAN.md         # Implementation approach
   ├── SPEC.md         # Technical details
   ├── CHECKLIST.md    # Subtasks to track
   └── NOTES.md        # Observations and decisions
   ```
2. Write REFERENCES.md first — link to specific PRD and ARCHITECTURE versions
3. Write the PLAN.md before coding
4. Update CHECKLIST.md as you progress
5. Move to `tasks/completed/` when done

### When Given a Bug-Fix

1. Create in `03-implementation/bugfix/active/`:
   ```
   BUGFIX-NNN-description/
   ├── PLAN.md         # Root cause analysis and fix approach
   ├── CHECKLIST.md    # Fix steps and verification
   └── NOTES.md        # Investigation notes
   ```

### When Given a Patch (UI polish, cosmetic tweaks)

1. Create in `03-implementation/patch/active/`:
   ```
   PATCH-NNN-description/
   ├── PLAN.md         # What to change and why
   └── CHECKLIST.md    # Change items and verification
   ```

### Task Categories

| Scenario | Category | Folder |
|----------|----------|--------|
| New feature or enhancement | TASK | `tasks/active/` |
| Planned refactoring | TASK | `tasks/active/` |
| Production bug fix | BUGFIX | `bugfix/active/` |
| UI spacing / cosmetic | PATCH | `patch/active/` |
| Minor UX improvement | PATCH | `patch/active/` |

---

## GitHub Project Management

### Repository
- **Repo**: `kronenz/content-forge-next`
- **Project Board**: [Content Forge Roadmap](https://github.com/users/kronenz/projects/7) (Project #7)

### gh CLI
gh CLI is authenticated. Use it for issues, PRs, and project management.

```bash
gh issue list                              # All issues
gh issue view 1                            # Issue detail
gh pr create --title "feat: ..." --body "Closes #1"
gh project item-list 7 --owner kronenz     # Project board items
```

### Labels
- **Phase**: `phase:1-foundation` ~ `phase:8-saas`
- **Type**: `type:feature`, `type:infra`, `type:bug`, `type:docs`, `type:agent`, `type:ui`
- **Priority**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`

### Milestones
| Milestone | Scope | Deadline |
|-----------|-------|----------|
| M1: MVP | Phase 1-4 (#1~#12, #19~#20) | 2026-05-14 |
| M2: Publishing + Auto-Approval | Phase 5-6 (#13~#14) | 2026-06-14 |
| M3: Advanced + Polish | Phase 7 (#15~#16) | 2026-07-14 |
| M4: SaaS Launch | Phase 8 (#17~#18) | 2026-08-14 |

### Issue-Implementation Rules
- Check issue number before starting
- Branch: `feat/#issue-number-description`
- Commit message includes `#issue-number`
- PR: `Closes #issue-number` for auto-close
- After completion: update `03-implementation/IMPLEMENTATION_TRACKER.md`

---

## CI/CD

### GitHub Actions
| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | PR, push to main | lint → typecheck → test → build → docker → lighthouse(PR) |
| `deploy.yml` | push to main | Vercel production deploy |

### Self-Hosted Runner
- **Server**: `minikube-01` (192.168.101.193)
- **Runner**: `content-forge-local` (labels: `self-hosted,linux,x64,on-prem`)
- **Service**: `systemctl --user {status|stop|restart} actions-runner`
- Switch to cloud: set repo variable `CI_RUNNER=ubuntu-latest`

### Local CI
```bash
make ci            # Full CI (lint → typecheck → test → build → docker)
make ci-quick      # Quick check (lint + typecheck, ~10s)
make ci-test       # Tests only (Docker PG+Redis)
make ci-build      # Next.js build only
make ci-docker     # Docker image build only
```

### CI Pass Criteria
- `bun run lint` passes
- `bun run typecheck` passes
- `bun run test` passes (Postgres + Redis)
- `bun run build` succeeds
- Docker image build succeeds
- Lighthouse: SEO > 95, Performance > 90 (PR only)

---

## Docker & Local Development

### Docker Files
- `Dockerfile` - Multi-stage build
- `docker-compose.yml` - Local dev (app + Postgres + Redis)
- `docker-compose.test.yml` - Test-only (ephemeral)
- `docker-compose.prod.yml` - Production

### Makefile Commands
```bash
make dev           # Local dev server (bun dev)
make build         # Production build
make up            # Docker full stack
make down          # Docker stop
make db-push       # Drizzle schema push
make db-studio     # Drizzle Studio (DB GUI)
make db-generate   # Drizzle migration generate
make db-migrate    # Drizzle migration run
make prod-up       # Production Docker stack
```

### Service Ports
| Service | Port | Connection |
|---------|------|------------|
| app | 3000 | http://localhost:3000 |
| postgres | 5432 | forge:forge@localhost:5432/content_forge |
| redis | 6379 | redis://localhost:6379 |

### Environment Variables
- `.env.example` — all variable templates
- `.env.local` — local development values
- Docker auto-injects DATABASE_URL, REDIS_URL

---

## Testing

- Unit tests: Vitest
- E2E tests: Playwright
- Agent tests: fixed input → output snapshot verification
- Docker tests: `make test-docker` (Postgres + Redis integration)
- CI tests: auto-run on every PR via GitHub Actions

---

## Workflow

```
1. Check issue: gh issue view {number}
2. Create branch: git checkout -b feat/#{number}-description
3. Read PRD: check referenced documents
4. Create task folder: 03-implementation/tasks/active/TASK-NNN-name/
5. Write PLAN.md before coding
6. Implement
7. Local CI: make ci-quick or make ci
8. Commit: include #{number} in message
9. Push: pre-push hook runs lint + typecheck
10. Create PR: gh pr create --title "feat: ..." --body "Closes #{number}"
11. CI passes (self-hosted runner)
12. Merge → update IMPLEMENTATION_TRACKER.md → move task to completed/
```

---

## Session Management

After completing an issue (commit or PR created):

1. **Update MEMORY.md**: reflect completed work, next tasks, changes
2. **Session cleanup**: run `/clear` if conversation is long (1+ issues completed)

### Rules
- Always save memory before `/clear`
- Announce "memory saved, running /clear" before clearing
- New session: check CLAUDE.md + `gh issue list` + IMPLEMENTATION_TRACKER.md → proceed

---

## Process Safety Rules

**NEVER kill processes by port number blindly.** Find the specific process by name first.

### Dev Server
| Server | Directory | Start Command | Port |
|--------|-----------|---------------|------|
| content-forge | `.` | `bun dev` | 3000 |

---

## File Location Rules

| Type of Work | Where to Document | Where to Code |
|--------------|-------------------|---------------|
| Vision/Strategy | `01-management/` | — |
| Requirements | `02-research/requirements/` | — |
| Architecture | `02-research/architecture/` | — |
| Task Planning | `03-implementation/tasks/active/TASK-NNN/` | — |
| Bug-Fix Planning | `03-implementation/bugfix/active/BUGFIX-NNN/` | — |
| Patch Planning | `03-implementation/patch/active/PATCH-NNN/` | — |
| Actual Code | — | `src/` |
| Tests | `04-quality/test-plans/current/` | `src/` or `tests/` |
| Bug Reports | `04-quality/bug-reports/` | — |
| Screenshots | `04-quality/screenshots/` (gitignored) | — |
| Design/UI Guidelines | `05-design-team/guidelines/` | — |
| Security Guidelines | `06-security-team/guidelines/` | — |
| Deployment Guidelines | `07-deployment-team/guidelines/` | — |
| Migration Policy | `08-db-migration-team/guidelines/` | — |
