# Product Requirements Document — Content Forge

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial consolidated version from 12 original PRD documents |

---

## Problem Statement

Content creators and marketers today face a fragmented workflow: they manually discover content from scattered sources, rewrite it for multiple platforms with different formats and constraints, review quality inconsistently, and publish through separate tools. This repetitive process wastes hours weekly and produces inconsistent quality. Content Forge solves this by providing an AI-powered editorial pipeline that automates the entire source-to-publish workflow.

---

## Target Users / Personas

| Persona | Description | Goals | Pain Points |
|---------|-------------|-------|-------------|
| **Personal Branding Creator** | Professional with domain expertise publishing on 3+ platforms | Efficient multi-platform presence with consistent quality | Manual rewriting for each platform, time-consuming curation |
| **Small Marketing Team** | 2-5 person team managing multiple client channels | Systematized production pipeline with quality controls | No unified workflow, inconsistent output quality |
| **SaaS Subscriber** | General user who wants self-service content automation | Build custom pipelines with minimal setup | Existing tools only cover fragments of the workflow |

---

## User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| US-001 | Creator | register RSS feeds, web pages, and API sources | content is automatically collected on schedule | Must Have |
| US-002 | Creator | configure AI processing instructions per source | collected content is processed according to my editorial voice | Must Have |
| US-003 | Creator | run content through an AI editorial pipeline (Analyst → Writer → Editor → Formatter) | raw content becomes platform-ready drafts automatically | Must Have |
| US-004 | Creator | preview content as it will appear on LinkedIn, X, Blog, and Instagram | I can verify formatting before publishing | Must Have |
| US-005 | Creator | review content with a quality scorecard (5 metrics) and approve/reject | only quality content gets published | Must Have |
| US-006 | Creator | publish approved content to multiple platforms simultaneously | I save time and maintain consistent presence | Must Have |
| US-007 | Creator | set up auto-approval rules based on quality thresholds | trusted pipelines run hands-free | Should Have |
| US-008 | Creator | view analytics on publishing performance across platforms | I can optimize my content strategy | Should Have |
| US-009 | Creator | customize pipeline steps by adding/removing/reordering Agents | the pipeline matches my specific workflow needs | Should Have |
| US-010 | Creator | use Research Agent to actively discover relevant content | I discover sources I wouldn't find manually | Should Have |
| US-011 | Team Lead | manage subscription plans and usage limits | costs are controlled and predictable | Should Have |
| US-012 | Creator | schedule publications for optimal times | content reaches the audience when engagement is highest | Should Have |
| US-013 | Creator | use AI-powered source suggestions | I can quickly discover relevant sources for my topics | Nice to Have |
| US-014 | Creator | use keyboard shortcuts and command palette (Cmd+K) | I can navigate the app efficiently | Nice to Have |
| US-015 | Creator | chat with an AI assistant about my content | I get contextual insights and can refine content conversationally | Nice to Have |

---

## Functional Requirements

### Source Collection (ref: 02-source-collection.md)

- **FR-001:** Support 6 source types: RSS/Atom, Web Scraping, API, Research Agent, Newsletter/Email, Manual Input
- **FR-002:** Source registration with name, type, URL, schedule (cron), filters (keywords, exclude), processing_prompt, tags, priority, and group assignment
- **FR-003:** Source group management — create, rename, delete groups; sources in deleted groups retain data with null group
- **FR-004:** Automated collection via BullMQ scheduler with configurable intervals and retry logic (3 retries)
- **FR-005:** Duplicate detection using SHA-256 content hashing with unique index
- **FR-006:** Source health monitoring — last collection time, success/failure counts, response time
- **FR-007:** AI-powered source suggestion — analyze user topics and recommend relevant sources via NDJSON streaming
- **FR-008:** Research Agent — active content discovery via Claude API, Exa.ai, with trend tracking, deep research, and competitor monitoring modes

### AI Pipeline (ref: 03-ai-agent-pipeline.md)

- **FR-009:** 9 Agent roles in editorial pipeline: Analyst, Writer, Editor, Designer, SEO Optimizer, Fact Checker, Compliance, Localizer, Platform Formatter
- **FR-010:** Each Agent produces structured output matching the PRD YAML spec (AnalysisReport, DraftContents, EditReport, DesignSpecs, SEOReport, FactCheckReport, ComplianceReport, LocalizedContents, FormattedContents)
- **FR-011:** Pipeline configurations: Full Pipeline (all 9 agents), Quick Pipeline (4 agents: Analyst → Writer → Editor → Formatter), Custom Pipeline (user-selected agents)
- **FR-012:** Pipeline template system — save, load, edit reusable pipeline configurations with source group linking (many-to-many)
- **FR-013:** Pipeline execution engine with sequential Agent chain, step-by-step DB recording, and intermediate data storage
- **FR-014:** Pipeline monitor UI — real-time progress bars, step details, token/time/cost statistics
- **FR-015:** Pipeline presets — Quick (4-step) and Full (9-step) one-click configurations

### Preview (ref: 05-platform-preview.md)

- **FR-016:** Platform-native preview components for LinkedIn, X (Twitter), Blog, and Instagram
- **FR-017:** Multi-platform simultaneous comparison view
- **FR-018:** Responsive preview modes — Desktop, Tablet, Mobile
- **FR-019:** Dark mode / Light mode preview toggle
- **FR-020:** Quality overlay showing per-section quality indicators

### Review & QA (ref: 06-quality-review.md)

- **FR-021:** 5-metric quality scorecard: Quality, Accuracy, Human-like, Platform-fit, Culture-fit (0-10, 1 decimal)
- **FR-022:** Review interface with 3 actions: Approve, Request Edit, Reject — with optional feedback text
- **FR-023:** Inline feedback — select text in preview to add contextual comments
- **FR-024:** Auto-approval system with configurable thresholds per quality metric
- **FR-025:** Trust level system (Level 0-3) — progressive automation based on historical quality

### Publishing (ref: 04-content-publishing.md)

- **FR-026:** Self-hosted blog system with public pages
- **FR-027:** LinkedIn API publishing integration
- **FR-028:** X (Twitter) API publishing integration
- **FR-029:** Publishing scheduler — immediate, scheduled time, or AI-recommended optimal time
- **FR-030:** Cross-posting strategy configuration per pipeline
- **FR-031:** Publishing history with success/failure tracking and retry logic

### Analytics (ref: 06-quality-review.md, 08-business-model.md)

- **FR-032:** Analytics dashboard — overview, per-platform, per-content, per-source views
- **FR-033:** Publishing performance metrics collection via platform APIs
- **FR-034:** Quality trend charts (weekly aggregation of 5 metrics)
- **FR-035:** Cost analysis — token usage, API costs per pipeline run
- **FR-036:** Content calendar view with drag-to-reschedule

### SaaS & Billing (ref: 08-business-model.md)

- **FR-037:** 5 subscription tiers: Free ($0), Creator ($29/mo), Pro ($79/mo), Team ($199/mo), Enterprise (custom)
- **FR-038:** Per-tier limits: sources (3/15/50/unlimited), pipeline runs (10/100/500/2000/unlimited), platforms (2/5/all)
- **FR-039:** Usage-based overage billing: $0.5/pipeline run, $1/research query, $0.3/image generation
- **FR-040:** Stripe integration — Checkout Sessions, Customer Portal, Webhook handling
- **FR-041:** Usage tracking and enforcement with graceful limit notifications

### UI/UX (ref: 07-ui-ux.md)

- **FR-042:** Dashboard layout — collapsible sidebar, header with notifications, main content area
- **FR-043:** Command Palette (Cmd+K) — keyboard-first navigation to all features
- **FR-044:** AI Assistant Chat — contextual content insights and natural language pipeline control
- **FR-045:** Drag-and-drop pipeline builder with visual flow canvas
- **FR-046:** Keyboard shortcuts for common actions (approve, navigate, switch tabs)

### SEO (ref: 11-seo-strategy.md)

- **FR-047:** SEO Optimizer Agent — keyword analysis, meta tags, heading structure, readability scoring
- **FR-048:** Dynamic OG image generation (next/og) for blog posts and user content
- **FR-049:** Sitemap.xml and robots.txt auto-generation
- **FR-050:** JSON-LD structured data (Article, FAQ, HowTo, SoftwareApplication)
- **FR-051:** SERP preview in review UI (Google/Naver format)

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Page load < 2s (LCP < 2.5s); Pipeline execution < 120s for Quick Pipeline |
| Availability | 99.9% uptime for web app; graceful degradation if AI providers are unavailable |
| Security | All data encrypted in transit (TLS 1.3); Supabase RLS for row-level security; no secrets in source control; rate limiting on all API endpoints |
| Scalability | Support 1,000 concurrent pipeline runs; horizontal scaling via BullMQ workers |
| Accessibility | WCAG 2.1 AA compliance; full keyboard navigation; screen reader support |
| Localization | Korean as primary UI language; English for code, comments, and documentation |
| SEO | Lighthouse SEO score > 95; Core Web Vitals passing; SSG/ISR for public pages |
| Testing | Unit tests via Vitest; E2E tests via Playwright; CI gate on all PRs |
| Monitoring | Sentry error tracking; health check endpoint; self-hosted runner CI/CD |

---

## Success Metrics

| Metric | Baseline | Target (6mo) | Measurement Method |
|--------|----------|--------|--------------------|
| MRR | $0 | $10K | Stripe dashboard |
| Weekly Active Pipeline Users | 0 | 500 | Pipeline runs per user per week |
| Free-to-Paid Conversion | N/A | 5% | Subscription analytics |
| Monthly Churn Rate | N/A | < 5% | Subscription retention tracking |
| Auto-Approval Adoption | N/A | 30% of paying users | Feature usage analytics |
| Time to First Publish | N/A | < 30 minutes | Onboarding funnel tracking |
| Pipeline Success Rate | N/A | > 95% | Pipeline completion monitoring |

---

## Out of Scope

The following items are explicitly excluded from this version (v1.0):

- Team/multi-user collaboration features (deferred to Phase 9)
- Template marketplace
- Public developer API
- White-label / OEM offering
- Mobile app or PWA
- Instagram/Threads, Medium/Hashnode publishing integrations
- Vector DB similarity search (pgvector)
- Push/Email/Slack notification system
- Video content support (YouTube)
- Multi-language UI (beyond Korean)

---

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | Should we support Instagram publishing via official API or third-party service? | Kronenz | 2026-04-15 |
| 2 | What is the minimum viable onboarding flow for first-time users? | Kronenz | 2026-04-01 |
| 3 | Should Research Agent support additional providers beyond Exa.ai and Claude? | Kronenz | 2026-04-15 |
| 4 | How should we handle Next.js 16 middleware-to-proxy migration timeline? | Kronenz | 2026-04-01 |

---

## Reference Documents

This PRD consolidates the following original documents (preserved in `prd-original/`):

| Original File | Content Area |
|---------------|-------------|
| `00-overview.md` | Service overview, vision, target users, differentiation |
| `01-architecture.md` | System architecture, domain model, events |
| `02-source-collection.md` | Source types, collection, groups, Research Agent |
| `03-ai-agent-pipeline.md` | 9 Agent roles, pipeline configs, monitoring |
| `04-content-publishing.md` | Publishing integrations, scheduling |
| `05-platform-preview.md` | Preview components, responsive modes |
| `06-quality-review.md` | Quality metrics, review workflow, auto-approval |
| `07-ui-ux.md` | Dashboard layout, UX features, accessibility |
| `08-business-model.md` | Subscription plans, pricing, KPIs, GTM |
| `09-tech-stack.md` | Technology choices, project structure |
| `10-roadmap.md` | Development phases and milestones |
| `11-seo-strategy.md` | Platform SEO, Content SEO, technical SEO |
