# Roadmap — Content Forge

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial version — consolidated from original roadmap with current implementation status |

---

## Phase Overview

| Phase | Timeline | Goals | Status |
|-------|----------|-------|--------|
| 1 — Foundation | Week 1-3 | Project init, Auth, DB, Dashboard shell | Complete |
| 2 — Source Collection | Week 3-5 | Source CRUD, RSS/Web collectors, scheduler | Complete (2 items remaining) |
| 3 — AI Pipeline Core | Week 5-8 | 4 core Agents, pipeline engine, monitor UI | Complete (1 item remaining) |
| 4 — Preview & Review | Week 8-10 | Platform previews, quality scorecard, review UI | Complete |
| 5 — Publishing | Week 10-12 | Blog/LinkedIn/X publishing, scheduler | Complete (1 item remaining) |
| 6 — Auto-Approval & Analytics | Week 12-14 | Auto-approval, analytics dashboard, calendar | Complete (1 item remaining) |
| 7 — Advanced Features | Week 14-17 | Research Agent, extra Agents, pipeline builder, Cmd+K | Complete |
| 8 — SaaS & Launch | Week 17-20 | Stripe, subscriptions, landing page | Complete (1 item remaining) |
| 9 — Growth | Week 20+ | Team plans, marketplace, API, mobile | Not Started |

---

## Phase 1 — Foundation

**Timeline:** Week 1-3
**Status:** Complete

- [x] Next.js project initialization (Bun, TypeScript, Tailwind CSS 4, shadcn/ui)
- [x] Supabase project setup (PostgreSQL, Auth, Storage)
- [x] Drizzle ORM schema design and migration
- [x] tRPC router base structure (v11, publicProcedure + protectedProcedure)
- [x] Authentication flow (Supabase Auth — Google, GitHub social login)
- [x] Dashboard base layout (sidebar, header, dark mode)

**Deliverable:** Authenticated dashboard shell with DB schema v1.

---

## Phase 2 — Source Collection

**Timeline:** Week 3-5
**Status:** Complete (2 items remaining)

- [x] Source CRUD API and UI (create, edit, delete, list with filters)
- [x] RSS/Atom feed collector (rss-parser, keyword filtering, image extraction)
- [x] Web scraping collector (cheerio, CSS selectors, single/list page modes)
- [x] Collection scheduler (BullMQ Repeatable Job, concurrency 5, retry 3)
- [x] Duplicate detection (SHA-256 hash, unique index)
- [x] Source group management (group CRUD, rename, delete, autocomplete)
- [ ] **Remaining: processing_prompt input UI** — UI for per-source AI processing instructions
- [x] AI source suggestion feature (local-cli SDK, NDJSON streaming)

**Deliverable:** Sources automatically collect content on schedule.

---

## Phase 3 — AI Pipeline Core

**Timeline:** Week 5-8
**Status:** Complete (1 item remaining)

### Agents
- [x] Analyst Agent — raw content analysis, insight extraction
- [x] Writer Agent — multi-platform draft generation
- [x] Editor Agent — quality editing + 5-metric scoring
- [x] Platform Formatter Agent — platform-specific formatting

### Pipeline Engine
- [x] Pipeline execution engine (Agent chain, step-by-step DB recording)
- [x] Pipeline monitor UI (progress bars, step details, token/time stats)
- [x] Step-by-step intermediate data viewer
- [x] Custom pipeline configuration (drag-and-drop, presets)
- [x] Pipeline templates + source group linking (DB: pipeline_templates, join table)
- [ ] **Remaining: WebSocket real-time events** — Event-driven pipeline status updates

**Deliverable:** Collected content processed through AI pipeline E2E.

---

## Phase 4 — Preview & Review

**Timeline:** Week 8-10
**Status:** Complete

- [x] LinkedIn preview component
- [x] X (Twitter) preview component
- [x] Blog preview component
- [x] Instagram preview component
- [x] Multi-platform simultaneous comparison view
- [x] 5-metric quality scorecard UI (Quality, Accuracy, Human-like, Platform-fit, Culture-fit)
- [x] Review interface (approve/edit/reject)
- [x] Inline feedback (text selection comments)
- [x] Responsive preview (Desktop/Tablet/Mobile)
- [x] Dark mode/Light mode preview toggle

**Deliverable:** Review content with platform-native previews before publishing.

---

## Phase 5 — Publishing

**Timeline:** Week 10-12
**Status:** Complete (1 item remaining)

- [x] Self-hosted blog system (public pages)
- [x] LinkedIn API publishing integration
- [x] X (Twitter) API publishing integration
- [x] Publishing scheduler (immediate/scheduled/optimal time)
- [x] Cross-posting strategy configuration
- [x] Publishing history management
- [ ] **Remaining: OG image preview** — Dynamic Open Graph image generation

**Deliverable:** Approved content published to real platforms.

---

## Phase 6 — Auto-Approval & Analytics

**Timeline:** Week 12-14
**Status:** Complete (1 item remaining)

- [x] Auto-approval condition settings UI
- [x] Trust level system (Level 0-3)
- [x] Analytics dashboard (overview, per-platform, per-content)
- [x] Publishing performance collection (API-based)
- [x] Content calendar view
- [x] Cost analysis (token usage, API costs)
- [ ] **Remaining: Post-publication quality monitoring** — Track quality metrics after publishing

**Deliverable:** Verified pipelines auto-publish; analytics dashboard operational.

---

## Phase 7 — Advanced Features

**Timeline:** Week 14-17
**Status:** Complete

- [x] Research Agent (Exa.ai + Claude-based)
- [x] SEO Optimizer Agent
- [x] Fact Checker Agent
- [x] Compliance Agent
- [x] Drag-and-drop pipeline builder (visual flow canvas, presets)
- [x] Command Palette (Cmd+K)
- [x] AI Assistant Chat
- [x] AI Contextual Insight Panel
- [x] CLI Agent Module (cli/ — status, sources, contents, collect, pipeline, flow, review)

**Deliverable:** Full Agent roster + advanced UX features.

---

## Phase 8 — SaaS & Launch

**Timeline:** Week 17-20
**Status:** Complete (1 item remaining)

- [x] Stripe payment integration (Checkout, Customer Portal, Webhooks)
- [x] Subscription plans (Free/Creator/Pro/Team/Enterprise)
- [x] Usage limits and metered billing
- [x] Landing page (SSG, SEO optimized)
- [x] Pricing page
- [ ] **Remaining: Onboarding wizard** — Step-by-step first-use guide

**Deliverable:** SaaS-ready with payment integration.

---

## Phase 9 — Growth (Not Started)

**Timeline:** Week 20+

- [ ] Team plans (multi-user, role management)
- [ ] Template marketplace
- [ ] Public API (developer access)
- [ ] White-label option
- [ ] Mobile app (or PWA)
- [ ] Multi-language support
- [ ] Enterprise features

**Deliverable:** Scale revenue and expand market.

---

## Milestones

| Milestone | Scope | Deadline | Status |
|-----------|-------|----------|--------|
| **M1: MVP** | Phase 1-4 (Issues #1-#12, #19-#20) | 2026-05-14 | Complete |
| **M2: Publishing + Auto-Approval** | Phase 5-6 (Issues #13-#14) | 2026-06-14 | Complete |
| **M3: Advanced + Polish** | Phase 7 (Issues #15-#16) | 2026-07-14 | Complete |
| **M4: SaaS Launch** | Phase 8 (Issues #17-#18) | 2026-08-14 | In Progress |
| **M5: Scale** | Phase 9 | TBD | Not Started |

---

## Current Priorities

> Updated: 2026-03-19

1. **Complete remaining Phase 2-8 items** — processing_prompt UI, WebSocket events, OG image preview, post-pub quality monitoring, onboarding wizard
2. **Infrastructure hardening** — Next.js 16 middleware-to-proxy migration, real OAuth keys (Google, GitHub, LinkedIn, X)
3. **Code quality pass** — Cross-cutting consistency checks (domain model, events, quality metrics, SEO)
4. **Pre-launch preparation** — Production deployment, security audit, performance optimization
5. **Personal branding launch** — Build-in-public content strategy using Content Forge itself

---

## Deferred / Out of Scope (this cycle)

- Team plans and multi-user collaboration (Phase 9)
- Template marketplace
- Public API for third-party developers
- White-label / OEM offering
- Mobile app / PWA
- Instagram/Threads, Medium/Hashnode publishing integrations
- Vector DB similarity search (pgvector)
- Notification system (Push, Email, Slack)
