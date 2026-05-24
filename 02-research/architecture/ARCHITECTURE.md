# Architecture — Content Forge

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-19 | Kronenz | Initial consolidated version from original architecture and tech-stack documents |

---

## System Overview

Content Forge is an AI-powered content automation platform that collects information from trusted sources, processes it through a multi-agent editorial pipeline, and publishes optimized content to multiple platforms. The system serves content creators, marketing teams, and SaaS subscribers through a web-based dashboard. It combines automated source collection, an editorial-room AI pipeline with 9 specialized agents, a platform-native preview and review system, and multi-platform publishing — all managed through a unified Next.js application.

---

## High-Level Architecture

```
+-----------------------------------------------------------------------+
|                          Content Forge                                  |
+-----------------------------------------------------------------------+
|                                                                         |
|  +-------------+   +----------------+   +-----------+   +-----------+  |
|  |   Source     |-->|   AI Agent     |-->|  Review   |-->|  Publish  |  |
|  |  Collector   |   |   Pipeline     |   |   & QA    |   |  Engine   |  |
|  +-------------+   +----------------+   +-----------+   +-----------+  |
|       ^                 ^ |                  ^ |             ^          |
|       |            +----------+         +----------+    +--------+     |
|       |            | Pipeline |         | Preview  |    |Platform|     |
|       |            | Monitor  |         | Renderer |    |  APIs  |     |
|       |            +----------+         +----------+    +--------+     |
|  +-------------+                                                       |
|  |  Research   |                                                       |
|  |   Agent     |                                                       |
|  +-------------+                                                       |
|                                                                         |
+-----------------------------------------------------------------------+
|  Dashboard (Web App — Next.js 16 App Router)                           |
|  Sources | Pipeline Monitor | Preview | Review | Publish | Analytics   |
+-----------------------------------------------------------------------+
|                                                                         |
|  +----------+  +------------+  +--------+  +--------+  +-----------+  |
|  |PostgreSQL|  |   Redis    |  |Supabase|  | Stripe |  |  AI APIs  |  |
|  | (Drizzle)|  | (BullMQ)   |  |  Auth  |  |Billing |  |Claude/GPT |  |
|  +----------+  +------------+  +--------+  +--------+  +-----------+  |
+-----------------------------------------------------------------------+
```

---

## Layer Architecture

### Layer 1: Data Layer

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Primary Database** | PostgreSQL (Supabase) + Drizzle ORM | Source metadata, collected data, pipeline results, publishing history |
| **Cache / Queue** | Redis (Upstash) + BullMQ | Job queue for collection and pipeline, caching, rate limiting |
| **File Storage** | Supabase Storage | Images, media files, generated assets |
| **Vector Store** | pgvector (Supabase) — planned | Content embeddings for duplicate detection and similarity search |

### Layer 2: Core Engine

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Source Collector** | RSS parser, Cheerio, custom API clients | RSS/Atom, web scraping, API-based source collection |
| **Research Agent** | Claude API, Exa.ai | Active content discovery, trend tracking, competitor monitoring |
| **AI Agent Pipeline** | Vercel AI SDK, Claude API (primary), OpenAI (secondary) | 9-agent editorial pipeline with step-by-step processing |
| **Pipeline Engine** | BullMQ job chain | Sequential agent execution, retry logic, intermediate storage |
| **Pipeline Monitor** | tRPC subscriptions | Real-time pipeline progress and step-by-step data |

### Layer 3: Output Layer

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Preview Renderer** | React components (shadcn/ui) | Platform-native preview for LinkedIn, X, Blog, Instagram |
| **Review System** | tRPC + Zustand | Quality scorecard (5 metrics), approve/reject workflow, inline feedback |
| **Publish Engine** | Platform SDKs / APIs | LinkedIn API, X API, self-hosted blog publishing |
| **Auto-Approval** | Custom service | Trust-level system (0-3), quality threshold configuration |

### Layer 4: Presentation Layer

| Component | Technology | Responsibility |
|-----------|-----------|----------------|
| **Dashboard** | Next.js 16 App Router, React Server Components | Unified web app for all user interactions |
| **CLI Module** | Bun CLI (cli/) | Local development/operations CLI with service flow automation |
| **Landing / Marketing** | Next.js SSG | Public pages, pricing, SEO-optimized content |

---

## Domain Model

```
Source (Collection Source)
├── id, name, type (RSS/API/Web/Research)
├── url, config, schedule, filters, tags, priority
├── processing_prompt, group_name
└── collections[] → RawContent

RawContent (Collected Raw Data)
├── id, source_id, title, body, metadata
├── collected_at, content_hash (duplicate detection)
└── pipeline_runs[] → PipelineRun

PipelineRun (Pipeline Execution)
├── id, raw_content_id, pipeline_template_id, status
├── started_at, completed_at
├── steps[] → PipelineStep
└── outputs[] → ProcessedContent

PipelineStep (Single Agent Step)
├── id, pipeline_run_id, agent_role
├── input, output, status
├── started_at, completed_at
└── metadata (token usage, model info, cost)

PipelineTemplate (Reusable Pipeline Config)
├── id, name, description, steps_config
└── sources[] → Source (many-to-many via pipeline_template_sources)

ProcessedContent (Platform-Ready Content)
├── id, pipeline_run_id, platform
├── title, body, media[], metadata
├── format_config (platform-specific settings)
└── reviews[] → Review

Review (Quality Assessment)
├── id, processed_content_id
├── quality_scores {quality, accuracy, humanLike, platformFit, cultureFit}
├── status (pending/approved/rejected)
├── feedback, reviewer (human/auto)
└── reviewed_at

Publication (Publishing Record)
├── id, processed_content_id, platform
├── published_url, status
├── engagement_metrics (optional collection)
└── published_at

Subscription (SaaS Billing)
├── id, user_id, plan (free/creator/pro/team/enterprise)
├── stripe_customer_id, stripe_subscription_id
└── usage_counts {sources, pipelineRuns, researchQueries}
```

### Entity Relationships

```
Source ──1:N──> RawContent ──1:N──> PipelineRun ──1:N──> PipelineStep
                                       |
                                       └──1:N──> ProcessedContent ──1:N──> Review
                                                       |
                                                       └──1:1──> Publication

PipelineTemplate ──M:N──> Source (via pipeline_template_sources)
User ──1:1──> Subscription
```

---

## Data Flows

### Flow 1: Source Collection

1. User registers a source (RSS/Web/API/Research) with schedule configuration
2. BullMQ scheduler creates a repeatable job based on the cron schedule
3. Collector worker picks up the job, fetches content from the source
4. Content is hashed (SHA-256) and checked against existing hashes for duplicates
5. New content is stored as RawContent with extracted metadata
6. Source health metrics are updated (last collection time, success/failure count)

### Flow 2: AI Pipeline Processing

1. User (or auto-trigger) initiates a pipeline run for a RawContent item
2. Pipeline engine loads the pipeline template configuration (agent list and settings)
3. For each agent step in sequence:
   a. Agent receives input (previous step's output or raw content)
   b. Vercel AI SDK calls Claude API with agent-specific system prompt
   c. Structured output is parsed and validated
   d. PipelineStep record is created with input, output, timing, and token usage
4. Final step produces ProcessedContent entries (one per target platform)
5. Pipeline status is updated to "completed"

### Flow 3: Review & Publishing

1. ProcessedContent enters review queue with status "pending"
2. User views content with platform-native preview and quality scorecard
3. User approves, requests edits, or rejects the content
   - **If auto-approval is enabled:** system checks quality scores against thresholds; if all pass, auto-approves
4. Approved content enters the publish queue
5. Publish engine calls the appropriate platform API (LinkedIn, X, Blog)
6. Publication record is created with published URL and status
7. (Optional) Engagement metrics are collected periodically via platform APIs

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Runtime** | Bun | Fast execution, native TypeScript, npm-compatible |
| **Framework** | Next.js 16 (App Router) | RSC, server actions, full-stack TypeScript |
| **Language** | TypeScript (strict mode) | Type safety across frontend and backend |
| **UI** | shadcn/ui + Tailwind CSS 4 | Customizable components, utility-first CSS |
| **State** | Zustand + TanStack Query | Lightweight client state + server state caching |
| **API** | tRPC v11 | End-to-end type-safe API layer |
| **Database** | PostgreSQL (Supabase) + Drizzle ORM | Managed hosting, type-safe queries, no raw SQL |
| **Queue** | BullMQ (Redis / Upstash) | Reliable job queue for pipelines and collection |
| **AI (Primary)** | Claude API via Vercel AI SDK | Primary LLM for all agent roles |
| **AI (Secondary)** | OpenAI GPT-4o | Fallback and comparison |
| **Auth** | Supabase Auth | Social login (Google, GitHub), session management |
| **Payments** | Stripe | Subscriptions, usage-based billing, webhooks |
| **Hosting** | Vercel (production) | Next.js-optimized, Edge functions, CDN |
| **CI/CD** | GitHub Actions (self-hosted runner) | Automated lint, typecheck, test, build, deploy |
| **Testing** | Vitest (unit) + Playwright (E2E) | Fast unit tests, browser-based E2E |
| **Monitoring** | Sentry + health endpoint | Error tracking, uptime monitoring |

---

## Event Catalog

Pipeline stages communicate through events for real-time monitoring:

```
Events:
- source.content.collected    → New content collected from source
- pipeline.step.started       → Agent step execution began
- pipeline.step.completed     → Agent step completed (includes intermediate output)
- pipeline.step.failed        → Agent step failed (includes error details)
- pipeline.completed          → Full pipeline run completed
- review.requested            → Content ready for review
- review.approved             → Content approved (human or auto)
- review.rejected             → Content rejected with feedback
- content.published           → Content successfully published to platform
- content.publish.failed      → Publishing failed (includes error and retry info)
```

**Transport:** Currently via tRPC polling. WebSocket (Socket.io) integration planned for true real-time updates.

---

## Security Architecture

- **Authentication:** Supabase Auth with social login (Google, GitHub); JWT-based sessions
- **Authorization:** tRPC protectedProcedure middleware; development bypass for local testing
- **Row-Level Security:** Supabase RLS policies for multi-tenant data isolation
- **Data Encryption:** TLS 1.3 in transit; Supabase manages encryption at rest
- **Secrets Management:** Environment variables via `.env.local` (local) and Vercel environment variables (production); validated with Zod in `src/lib/env.ts`
- **Rate Limiting:** Planned via Redis-based rate limiter on API endpoints
- **Security Headers:** X-Content-Type-Options, X-Frame-Options, Referrer-Policy via next.config.ts

---

## Deployment Architecture

| Environment | Infrastructure | URL / Endpoint |
|-------------|----------------|----------------|
| **Local Dev** | Bun + Supabase Local (Docker) + Redis (Docker) | http://localhost:3000 |
| **CI** | GitHub Actions self-hosted runner (`minikube-01`) | N/A |
| **Production** | Vercel + Supabase Cloud + Upstash Redis | TBD (contentforge.io) |

### Local Development Setup

```
App:       bun dev → http://localhost:3000
Supabase:  bunx supabase start → API: 127.0.0.1:54321, DB: 127.0.0.1:54322, Studio: 127.0.0.1:54323
Redis:     docker start content-forge-redis → 127.0.0.1:6379
```

---

## Project Structure

```
content-forge-next/
├── 01-management/          # Strategy, vision, decisions (8-layer docs)
├── 02-research/            # Requirements, architecture, spikes
├── 03-implementation/      # Task plans, bugfix, patch tracking
├── 04-quality/             # Test plans, bug reports, screenshots
├── 05-design-team/         # Design system, UI patterns, reviews
├── 06-security-team/       # Security policy, audits, reviews
├── 07-deployment-team/     # Deployment strategy, releases
├── 08-db-migration-team/   # Migration policy, scripts, tracking
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Login, signup pages
│   │   ├── (dashboard)/    # Dashboard layout + all dashboard pages
│   │   ├── (marketing)/    # Landing page, pricing
│   │   └── api/            # API routes (tRPC, webhooks, health, suggest-stream)
│   ├── components/         # UI components
│   │   ├── ui/             # shadcn base components
│   │   ├── layout/         # Sidebar, header
│   │   ├── sources/        # Source management UI
│   │   ├── pipeline/       # Pipeline cards, step details
│   │   ├── pipeline-builder/ # Visual pipeline builder
│   │   ├── preview/        # Platform preview components
│   │   ├── review/         # Review interface, scorecard
│   │   ├── publish/        # Publishing, calendar, cross-post
│   │   ├── analytics/      # Analytics charts, auto-approval settings
│   │   ├── ai-chat/        # AI assistant chat
│   │   ├── command-palette/ # Cmd+K command palette
│   │   └── insight-panel/  # AI contextual insight panel
│   ├── server/
│   │   ├── api/            # tRPC router definitions
│   │   │   └── routers/    # source, pipeline, content, review, publish, analytics, billing, pipeline-template
│   │   ├── db/             # Drizzle schema & connection
│   │   ├── agents/         # AI Agent implementations (9 agents)
│   │   ├── pipeline/       # Pipeline execution engine
│   │   ├── collectors/     # Source collectors (RSS, web, API)
│   │   ├── publishers/     # Platform publishers (LinkedIn, X, blog)
│   │   ├── services/       # Business logic (auto-approval, subscription)
│   │   ├── billing/        # Stripe integration (plans, usage, webhooks)
│   │   ├── queue/          # BullMQ queue and worker setup
│   │   └── ai/             # Local AI SDK wrapper (local-cli.ts)
│   ├── lib/                # Utilities (env, db, redis, stripe, trpc, utils)
│   ├── hooks/              # React hooks
│   └── types/              # Shared TypeScript types
├── cli/                    # CLI Agent Module (standalone)
├── worker/                 # Background worker processes
├── drizzle/                # DB migrations
├── scripts/                # Build/CI scripts
├── .github/workflows/      # CI/CD pipelines
└── docs/prd/               # Original PRD documents (legacy, migrated to 02-research/)
```

---

## Key Architecture Decisions

| Decision | Summary |
|----------|---------|
| **Next.js App Router over Pages Router** | Server Components by default, streaming, co-located API routes |
| **tRPC over REST** | End-to-end type safety, no code generation, auto-completion |
| **Drizzle ORM over Prisma** | Lighter weight, SQL-like API, better Bun compatibility |
| **BullMQ over Inngest/Trigger.dev** | Full control, Redis-based, proven at scale for job queues |
| **Claude API as primary LLM** | Superior instruction-following for structured agent outputs |
| **Vercel AI SDK** | Multi-provider support, streaming, structured output generation |
| **Supabase over self-hosted PostgreSQL** | Managed hosting, built-in Auth/Storage/RLS, local dev support |
| **shadcn/ui over Material UI** | Copy-paste components, full customization, Tailwind native |
| **Monorepo (single Next.js app)** | Simplicity for solo developer; split when team grows |

---

## Known Constraints & Trade-offs

- **Single-process pipeline:** Currently pipelines run sequentially within a single BullMQ worker; horizontal scaling requires worker separation (planned for growth phase)
- **No WebSocket yet:** Real-time updates use tRPC polling; Socket.io planned for Phase 9
- **Claude Code session limitation:** Claude Agent SDK's `outputFormat: json_schema` is unreliable inside Claude Code sessions; Codex SDK used as fallback for AI suggestions
- **Next.js 16 deprecation:** `middleware` → `proxy` migration pending; no functional impact currently
- **No multi-tenancy isolation:** Single database with user_id filtering; Supabase RLS provides row-level isolation but no schema-level separation
- **AI cost exposure:** Users on higher plans may generate significant AI API costs; usage-based billing mitigates but requires careful monitoring
