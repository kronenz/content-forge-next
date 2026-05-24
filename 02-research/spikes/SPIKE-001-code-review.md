# SPIKE-001: Code Review — src/ vs ARCHITECTURE.md Alignment

**Status:** Complete
**Date:** 2026-03-19
**Author:** Kronenz (via Claude)
**Time-box:** 1 session

---

## Question

Does the current `src/` codebase align with the newly written `ARCHITECTURE.md`? What are the gaps, inconsistencies, and technical debt items that need to be addressed?

---

## Context

The project has been re-scaffolded with an 8-layer organizational structure. A consolidated `ARCHITECTURE.md` was written based on the original 12 PRD documents and the current implementation state. This spike verifies that the code matches the documented architecture and identifies actionable discrepancies.

---

## Approach

1. Compared `ARCHITECTURE.md` project structure section with actual `src/` directory tree
2. Cross-referenced PRD agent list with implemented agents in `src/server/agents/`
3. Checked IMPLEMENTATION_TRACKER.md for declared "remaining" items
4. Analyzed collector, publisher, and service modules for completeness
5. Identified undocumented or prototype code

---

## Findings

### 1. Agent Implementation Gaps

**PRD specifies 9 editorial agents.** Code implements 8 agents + 1 non-editorial agent:

| PRD Agent | Code File | Status |
|-----------|-----------|--------|
| Analyst | `agents/analyst.ts` | Implemented |
| Writer | `agents/writer.ts` | Implemented |
| Editor | `agents/editor.ts` | Implemented |
| **Designer** | — | **NOT IMPLEMENTED** |
| SEO Optimizer | `agents/seo-optimizer.ts` | Implemented |
| Fact Checker | `agents/fact-checker.ts` | Implemented |
| Compliance | `agents/compliance.ts` | Implemented |
| **Localizer** | — | **NOT IMPLEMENTED** |
| Platform Formatter | `agents/formatter.ts` | Implemented |
| *(extra)* Researcher | `agents/researcher.ts` | Implemented (not one of the 9 editorial agents — it's a source collection agent) |

**Impact:** Designer and Localizer agents are referenced in PRD pipeline configurations but have no code. The pipeline builder UI may offer these as options without backend support.

### 2. Collector Implementation Gaps

**PRD specifies 6 source types.** Code implements 2 collectors:

| Source Type | Code File | Status |
|-------------|-----------|--------|
| RSS/Atom | `collectors/rss-collector.ts` | Implemented |
| Web Scraping | `collectors/web-collector.ts` | Implemented |
| **API** | — | **NOT IMPLEMENTED** (type exists in DB schema but no collector logic) |
| Research Agent | `agents/researcher.ts` | Implemented (separate from collectors) |
| **Newsletter/Email** | — | **NOT IMPLEMENTED** |
| **Manual Input** | — | **Partial** (via UI direct URL input, no dedicated collector) |

**Impact:** Users can register API/Newsletter source types in the UI, but collection will fail silently or throw errors.

### 3. Remaining Incomplete Features (from IMPLEMENTATION_TRACKER)

| Feature | Phase | Priority |
|---------|-------|----------|
| `processing_prompt` input UI | Phase 2 | High — data field exists, UI missing |
| WebSocket real-time events | Phase 3 | Medium — polling works as fallback |
| OG image preview/generation | Phase 5 | Medium — SEO impact |
| Post-publication quality monitoring | Phase 6 | Low — nice-to-have |
| Onboarding wizard | Phase 8 | High — critical for user activation |

### 4. Undocumented / Prototype Code

| Path | Description | Action Needed |
|------|-------------|---------------|
| `src/app/prototype/` | 7 prototype pages (analytics, contents, pipeline, publish, sources, design-system) | **Should be removed or documented.** Not referenced in ARCHITECTURE.md, likely exploration code |
| `src/server/ai/local-cli.ts` | Local AI SDK wrapper (Claude Agent SDK + Codex SDK) | Documented in MEMORY.md but not in ARCHITECTURE.md. Used by suggest-stream API |
| `src/app/api/suggest-stream/` | NDJSON streaming endpoint for AI source suggestions | Documented in MEMORY.md but not in ARCHITECTURE.md |
| `src/components/sources/source-suggest-panel.tsx` | AI source suggestion UI panel | Not in ARCHITECTURE.md |
| `src/components/sources/source-suggest-dialog.tsx` | AI source suggestion dialog | Not in ARCHITECTURE.md |
| `scripts/test-suggest.ts` | Test script for suggest feature | Should be in `src/__tests__/` or removed |

### 5. Architecture vs Code Structural Discrepancies

| ARCHITECTURE.md Says | Code Reality | Severity |
|---------------------|-------------|----------|
| `src/lib/redis.ts` and `src/lib/stripe.ts` implied | Redis config in `src/server/queue/connection.ts`; Stripe in `src/server/billing/stripe.ts` | Low — functionally correct, doc mismatch |
| `worker/` directory for background workers | `worker/` directory not present; queue worker is in `src/server/queue/worker.ts` | Low — architecture choice, not a bug |
| `tests/` directory | Tests are in `src/__tests__/` | Low — Vitest convention, acceptable |
| Dashboard home at `/dashboard` | Route is `(dashboard)/dashboard/page.tsx` | OK — route group with explicit dashboard path |
| 9 agents in pipeline | Pipeline builder UI may show Designer/Localizer options with no backend | Medium — UI/backend mismatch |

### 6. Cross-Cutting Consistency Issues (from IMPLEMENTATION_TRACKER)

All items below are unchecked in the tracker:

- [ ] Domain entity names consistent across code, DB, and API
- [ ] Event names match event catalog
- [ ] 5 quality metrics (Quality, Accuracy, Human-like, Platform-fit, Culture-fit) used consistently
- [ ] Public pages use SSG/ISR rendering
- [ ] Meta tags, OG tags, JSON-LD applied on public pages
- [ ] sitemap.xml and robots.txt configured (files exist: `src/app/sitemap.ts`, `src/app/robots.ts`)
- [ ] Core Web Vitals meeting targets

### 7. Test Coverage

| Area | Test Files | Coverage |
|------|-----------|----------|
| Agents | `analyst.test.ts`, `editor.test.ts`, `formatter.test.ts`, `writer.test.ts` | 4/8 implemented agents tested |
| Collectors | `base-collector.test.ts`, `rss-collector.test.ts`, `web-collector.test.ts` | 3/3 — good coverage |
| Pipeline Engine | — | **No tests** |
| API Routers | — | **No tests** |
| Publishers | — | **No tests** |
| Services | — | **No tests** |
| Components | — | **No tests** (no component tests at all) |

**Impact:** Critical business logic (pipeline engine, publishing, billing) has zero test coverage.

---

## Prioritized Action Items

### Priority 1 — Critical (Pre-Launch Blockers)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1.1 | **Implement `processing_prompt` input UI** in source dialog | Small | Enables per-source AI customization — core feature |
| 1.2 | **Build onboarding wizard** (Phase 8 remaining) | Medium | Critical for user activation and Time-to-First-Publish |
| 1.3 | **Guard against unimplemented source types** — disable API/Newsletter/Manual source type selection in UI, or show "coming soon" badge | Small | Prevents silent failures |
| 1.4 | **Guard against unimplemented agents** — remove Designer/Localizer from pipeline builder options, or mark as "coming soon" | Small | Prevents pipeline failures |

### Priority 2 — High (Quality & Reliability)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 2.1 | **Add pipeline engine tests** | Medium | Core business logic untested |
| 2.2 | **Add API router tests** (at least source, pipeline, review) | Medium | API correctness guarantee |
| 2.3 | **Run cross-cutting consistency audit** — verify domain names, quality metrics, event names | Medium | PRD compliance |
| 2.4 | **Register real OAuth keys** (Google, GitHub, LinkedIn, X) | Small | Required for production auth |
| 2.5 | **Next.js 16 middleware → proxy migration** | Small | Remove deprecation warnings |

### Priority 3 — Medium (Feature Completeness)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 3.1 | **Implement WebSocket events** for real-time pipeline monitoring | Medium | Better UX, eliminates polling |
| 3.2 | **Implement OG image generation** (next/og) | Medium | SEO and social sharing impact |
| 3.3 | **Implement Designer Agent** | Medium | Completes editorial pipeline |
| 3.4 | **Implement Localizer Agent** | Medium | Enables multi-market content |
| 3.5 | **Implement API source collector** | Medium | Expands source coverage |

### Priority 4 — Low (Cleanup & Polish)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 4.1 | **Remove or document `src/app/prototype/`** directory | Small | Reduces codebase confusion |
| 4.2 | **Document AI suggestion feature** in ARCHITECTURE.md | Small | Architecture completeness |
| 4.3 | **Move `scripts/test-suggest.ts`** to test directory or remove | Small | Code organization |
| 4.4 | **Add post-publication quality monitoring** | Medium | Phase 6 completion |
| 4.5 | **Add publisher tests** (LinkedIn, X, Blog) | Medium | Publishing reliability |

---

## Recommendation

The codebase is substantially complete for an MVP launch (Phase 1-8 largely implemented). The most critical gaps are:

1. **UI guards for unimplemented features** (source types, agents) — these are quick fixes that prevent user-facing errors
2. **Onboarding wizard** — essential for converting signups to active users
3. **Test coverage for pipeline engine and API routers** — business-critical code paths with zero tests

Focus Priority 1 items first, then run the cross-cutting consistency audit (Priority 2.3) to ensure the entire system is coherent before launch.

---

## References

- `02-research/architecture/ARCHITECTURE.md` — System architecture (this review's baseline)
- `02-research/requirements/PRD.md` — Consolidated product requirements
- `03-implementation/IMPLEMENTATION_TRACKER.md` — Implementation status tracking
- `02-research/requirements/prd-original/` — Original 12 PRD documents
