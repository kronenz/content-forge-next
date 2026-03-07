# 구현 추적기 (Implementation Tracker)

PRD 문서의 각 요구사항이 구현되었는지 추적합니다.
구현 완료 시 `[ ]`를 `[x]`로 변경하고 관련 파일 경로를 기록합니다.

---

## Phase 1: Foundation (Week 1-3)
> PRD 참조: `01-architecture.md`, `09-tech-stack.md`

- [x] Next.js 15 프로젝트 초기화
  - 파일: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `.prettierrc`, `components.json`
  - 앱: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
  - 유틸: `src/lib/env.ts` (Zod v4), `src/lib/utils.ts`
  - UI: `src/components/ui/button.tsx` (shadcn)
  - 참고: Next.js 16 (latest), Tailwind CSS 4, shadcn/ui, ESLint 9
- [x] Drizzle ORM 스키마 설계
  - 파일: `src/server/db/schema.ts`, `src/server/db/index.ts`, `src/lib/db.ts`, `drizzle.config.ts`, `drizzle/0000_curved_gravity.sql`
  - 체크: Source, RawContent, PipelineRun, PipelineStep, ProcessedContent, Review, Publication 엔티티가 `01-architecture.md` 도메인 모델과 일치하는가? ✅
- [x] tRPC 라우터 기본 구조
  - 파일: `src/server/api/trpc.ts` (context, procedures), `src/server/api/root.ts` (root router), `src/server/api/routers/{source,pipeline,content,review,publish,analytics}.ts`, `src/app/api/trpc/[trpc]/route.ts` (API handler), `src/lib/trpc.ts` (React client), `src/components/providers.tsx` (TanStack Query + tRPC provider)
  - tRPC v11, @tanstack/react-query, superjson, publicProcedure + protectedProcedure
- [x] Supabase Auth 연동
  - 파일: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`, `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`, `src/app/auth/callback/route.ts`
  - 체크: Google/GitHub OAuth, tRPC protectedProcedure 세션 연동, 보호 라우트 미들웨어 ✅
- [x] 대시보드 기본 레이아웃
  - 파일: `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/theme-provider.tsx`, `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/page.tsx`, `src/hooks/use-mobile.ts`
  - 체크: `07-ui-ux.md`의 전체 레이아웃 (사이드바 구조)과 일치하는가? ✅

---

## Phase 2: Source Collection (Week 3-5)
> PRD 참조: `02-source-collection.md`

- [x] Source CRUD API
  - 파일: `src/server/api/routers/source.ts`, `src/server/db/schema.ts`, `drizzle/0001_woozy_toad_men.sql`
  - 체크: Source 엔티티 필드가 PRD의 소스 등록 YAML 스펙과 일치하는가? ✅ (name, type, url, schedule, filters, tags, priority, processingPrompt, groupName)
- [x] 소스 등록 UI
  - 파일: `src/app/(dashboard)/sources/page.tsx`, `src/components/sources/source-card.tsx`, `src/components/sources/source-dialog.tsx`, `src/components/sources/delete-source-dialog.tsx`
  - 체크: `07-ui-ux.md`의 Source Manager 화면과 일치하는가? ✅ (검색, 타입 필터, 그룹별 목록, 소스 카드, CRUD 다이얼로그)
- [x] RSS/Atom 수집기
  - 파일: `src/server/collectors/rss-collector.ts`, `src/server/collectors/base-collector.ts`
  - 체크: rss-parser, 키워드/제외 필터링, 이미지 추출, 메타데이터 수집 ✅
- [x] 웹 스크래핑 수집기
  - 파일: `src/server/collectors/web-collector.ts`
  - 체크: cheerio CSS 셀렉터, 단일/목록 페이지 모드, 커스텀 셀렉터 ✅
- [x] 수집 스케줄러 (BullMQ)
  - 파일: `src/server/queue/connection.ts`, `src/server/queue/collect-queue.ts`, `src/server/queue/worker.ts`
  - 체크: Redis 연결, Repeatable Job, concurrency 5, 재시도 3회 ✅
- [x] 중복 감지 (해시 기반)
  - 파일: `src/server/collectors/base-collector.ts`, `src/server/collectors/index.ts`
  - 체크: SHA-256 해시, raw_contents_hash_idx unique index ✅
- [ ] 소스 그룹 관리
  - 파일: -
- [ ] processing_prompt 입력 UI
  - 파일: -

---

## Phase 3: AI Pipeline Core (Week 5-8)
> PRD 참조: `03-ai-agent-pipeline.md`

### Agent 구현
각 Agent의 입출력이 PRD 스펙과 일치하는지 반드시 검증할 것.

- [x] Analyst Agent
  - 파일: `src/server/agents/analyst.ts`, `src/server/agents/types.ts`
  - 체크: 출력이 PRD의 `analysis_report` YAML 구조와 일치하는가? ✅
- [x] Writer Agent
  - 파일: `src/server/agents/writer.ts`
  - 체크: 출력이 PRD의 `drafts` YAML 구조와 일치하는가? (blog, linkedin, twitter, instagram) ✅
- [x] Editor Agent
  - 파일: `src/server/agents/editor.ts`
  - 체크: 출력이 PRD의 `edit_report` YAML 구조와 일치하는가? (5대 품질 지표 포함) ✅
- [x] Platform Formatter Agent
  - 파일: `src/server/agents/formatter.ts`

### 파이프라인 엔진
- [x] 파이프라인 실행 엔진 (Agent Chain)
  - 파일: `src/server/pipeline/engine.ts`, `src/server/api/routers/pipeline.ts`
  - 체크: Analyst → Writer → Editor → Formatter 순차 실행, 단계별 DB 기록 ✅
- [ ] 이벤트 발행 (WebSocket)
  - 파일: -
  - 체크: 이벤트명이 `01-architecture.md`의 이벤트 목록과 일치하는가?
- [x] 파이프라인 모니터 UI
  - 파일: `src/app/(dashboard)/pipelines/page.tsx`, `src/components/pipeline/pipeline-run-card.tsx`, `src/components/pipeline/pipeline-step-detail.tsx`
  - 체크: `07-ui-ux.md`의 Pipeline Monitor 화면과 일치하는가? ✅ (진행 바, 단계별 상세, 토큰/시간 통계)
- [x] 단계별 중간 데이터 열람 UI
  - 파일: `src/components/pipeline/pipeline-step-detail.tsx`
- [x] 커스텀 파이프라인 구성
  - 파일: `src/components/pipeline-builder/pipeline-builder.tsx`, `src/app/(dashboard)/pipelines/builder/page.tsx`
  - 체크: 드래그앤드롭 Agent 재배치, 활성화/비활성화 ✅

---

## Phase 4: Preview & Review (Week 8-10)
> PRD 참조: `05-platform-preview.md`, `06-quality-review.md`

### 프리뷰
- [x] LinkedIn 프리뷰 컴포넌트
  - 파일: `src/components/preview/linkedin-preview.tsx`
- [x] X (Twitter) 프리뷰 컴포넌트
  - 파일: `src/components/preview/x-preview.tsx`
- [x] 블로그 프리뷰 컴포넌트
  - 파일: `src/components/preview/blog-preview.tsx`
- [x] Instagram 프리뷰 컴포넌트
  - 파일: `src/components/preview/instagram-preview.tsx`
- [x] 멀티 플랫폼 동시 비교 뷰
  - 파일: `src/components/preview/multi-platform-preview.tsx`
- [x] 반응형 프리뷰 (Desktop/Tablet/Mobile)
  - 파일: `src/components/preview/preview-toolbar.tsx`
- [x] 다크모드/라이트모드 전환
  - 파일: `src/components/theme-provider.tsx`

### 검토
- [x] 5대 품질 스코어카드 UI
  - 파일: `src/components/review/quality-scorecard.tsx`
  - 체크: Quality, Accuracy, Human-like, Platform-fit, Culture-fit (0-10, 소수점 1자리) ✅
- [x] 검토 인터페이스 (승인/수정/반려)
  - 파일: `src/components/review/review-panel.tsx`, `src/app/(dashboard)/reviews/page.tsx`, `src/app/(dashboard)/reviews/[id]/page.tsx`
- [x] 인라인 피드백 (텍스트 선택 코멘트)
  - 파일: `src/components/review/inline-feedback.tsx`
- [x] 품질 지표 오버레이
  - 파일: `src/components/preview/quality-overlay.tsx`

---

## Phase 5: Publishing (Week 10-12)
> PRD 참조: `04-content-publishing.md`

- [x] 자체 블로그 시스템
  - 파일: `src/server/publishers/blog-publisher.ts`
- [x] LinkedIn API 연동
  - 파일: `src/server/publishers/linkedin-publisher.ts`
- [x] X (Twitter) API 연동
  - 파일: `src/server/publishers/x-publisher.ts`
- [x] 발행 스케줄러 (즉시/예약/최적시간)
  - 파일: `src/server/api/routers/publish.ts`, `src/app/(dashboard)/publish/page.tsx`
- [x] 크로스 포스팅 전략
  - 파일: `src/components/publish/cross-post-dialog.tsx`
- [ ] OG 이미지 미리보기
  - 파일: -
  - 체크: `11-seo-strategy.md`의 OG 이미지 생성 스펙과 일치하는가?

---

## Phase 6: Auto-Approval & Analytics (Week 12-14)
> PRD 참조: `06-quality-review.md`

- [x] 자동 승인 조건 설정 UI
  - 파일: `src/components/analytics/auto-approval-settings.tsx`
  - 체크: PRD의 `auto_approval` YAML 구조와 일치하는가? ✅
- [x] 신뢰도 레벨 시스템 (Level 0-3)
  - 파일: `src/server/services/auto-approval.ts`
- [ ] 사후 품질 모니터링
  - 파일: -
- [x] 분석 대시보드
  - 파일: `src/app/(dashboard)/analytics/page.tsx`, `src/server/api/routers/analytics.ts`
  - 체크: `07-ui-ux.md`의 Analytics 화면과 일치하는가? ✅
- [x] 콘텐츠 캘린더 뷰
  - 파일: `src/components/publish/content-calendar.tsx`

---

## Phase 7: Advanced Features (Week 14-17)
> PRD 참조: `02-source-collection.md`, `03-ai-agent-pipeline.md`

- [x] Research Agent (Exa.ai + Claude)
  - 파일: `src/server/agents/researcher.ts`
- [x] SEO Optimizer Agent
  - 파일: `src/server/agents/seo-optimizer.ts`
- [x] Fact Checker Agent
  - 파일: `src/server/agents/fact-checker.ts`
- [x] Compliance Agent
  - 파일: `src/server/agents/compliance.ts`
- [x] 드래그앤드롭 파이프라인 빌더
  - 파일: `src/components/pipeline-builder/pipeline-builder.tsx`, `src/app/(dashboard)/pipelines/builder/page.tsx`
- [x] Command Palette (Cmd+K)
  - 파일: `src/components/command-palette/command-palette.tsx`
- [x] AI Assistant Chat
  - 파일: `src/components/ai-chat/ai-chat.tsx`
- [x] AI Contextual Insight Panel
  - 파일: `src/components/insight-panel/ai-insight-panel.tsx`, `src/components/insight-panel/insight-panel-wrapper.tsx`

---

## Phase 8: SaaS & Launch (Week 17-20)
> PRD 참조: `08-business-model.md`

- [x] Stripe 결제 연동
  - 파일: `src/server/billing/stripe.ts`, `src/app/api/webhooks/stripe/route.ts`
  - 체크: Checkout Session, Customer Portal, Webhook (checkout.session.completed, invoice.paid 등) ✅
- [x] 구독 플랜 구현
  - 파일: `src/server/services/subscription.ts`, `src/server/billing/plans.ts`, `src/server/billing/index.ts`
  - 체크: Free/Creator/Pro/Team/Enterprise 플랜이 PRD 가격표와 일치하는가? ✅
- [x] 사용량 제한 및 과금
  - 파일: `src/server/billing/usage.ts`, `src/server/api/routers/billing.ts`
  - 체크: 소스/파이프라인/리서치 사용량 추적, 플랜별 제한 ✅
- [ ] 온보딩 위저드
  - 파일: -
- [x] 랜딩 페이지
  - 파일: `src/app/(marketing)/page.tsx`, `src/app/(marketing)/layout.tsx`, `src/app/(marketing)/pricing/page.tsx`
  - 체크: `11-seo-strategy.md`의 SEO 설정 (SSG, JSON-LD, OG) 적용되었는가? ✅

---

## 크로스커팅 체크리스트 (모든 Phase 공통)

### 도메인 일관성
- [ ] 모든 엔티티 이름이 `01-architecture.md` 도메인 모델과 일치
- [ ] DB 컬럼명이 도메인 모델의 필드명과 일치
- [ ] API 응답 타입이 도메인 모델과 일치

### 이벤트 일관성
- [ ] 이벤트명이 `01-architecture.md` 이벤트 목록과 일치
- [ ] WebSocket 이벤트가 대시보드 실시간 피드와 연결

### 품질 지표 일관성
- [ ] 5대 지표명 통일: Quality, Accuracy, Human-like, Platform-fit, Culture-fit
- [ ] 점수 범위 통일: 0-10 (소수점 1자리)
- [ ] 모든 UI에서 동일한 지표 순서로 표시

### SEO 일관성 (`11-seo-strategy.md`)
- [ ] 공개 페이지는 SSG/ISR 렌더링
- [ ] 메타 태그, OG 태그, JSON-LD 적용
- [ ] sitemap.xml, robots.txt 설정
- [ ] Core Web Vitals 기준 충족
