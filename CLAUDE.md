# Content Forge - Claude Code 프로젝트 가이드

## 프로젝트 개요

AI Agent 기반 콘텐츠 수집-가공-발행 자동화 플랫폼.
수집된 정보를 편집국 구조의 AI Agent 파이프라인이 가공하여 멀티 플랫폼에 발행한다.

## 필수 참조 문서

구현 전 반드시 관련 PRD를 읽어야 한다. 추측으로 구현하지 말 것.

| 문서 | 언제 참조 |
|------|----------|
| `docs/prd/00-overview.md` | 프로젝트 전체 맥락 파악 시 |
| `docs/prd/01-architecture.md` | 시스템 구조, 도메인 모델, 이벤트 설계 |
| `docs/prd/02-source-collection.md` | 소스 수집 기능 구현 시 |
| `docs/prd/03-ai-agent-pipeline.md` | AI Agent 구현 시 (역할, 입출력 스펙) |
| `docs/prd/04-content-publishing.md` | 발행 기능 구현 시 |
| `docs/prd/05-platform-preview.md` | 프리뷰 컴포넌트 구현 시 |
| `docs/prd/06-quality-review.md` | 검토/승인 시스템 구현 시 |
| `docs/prd/07-ui-ux.md` | UI 레이아웃, 화면 설계 시 |
| `docs/prd/08-business-model.md` | 과금, 플랜 제한 구현 시 |
| `docs/prd/09-tech-stack.md` | 기술 선택, 프로젝트 구조 |
| `docs/prd/10-roadmap.md` | 구현 순서, 우선순위 판단 시 |
| `docs/prd/11-seo-strategy.md` | SEO 관련 구현 시 |

## 기술 스택 (확정)

- **Runtime**: Bun
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: shadcn/ui + Tailwind CSS 4
- **State**: Zustand + TanStack Query
- **API**: tRPC
- **DB**: PostgreSQL (Supabase) + Drizzle ORM
- **Queue**: BullMQ (Redis/Upstash)
- **AI**: Vercel AI SDK + Claude API (primary) + OpenAI (secondary)
- **Auth**: Supabase Auth
- **Payments**: Stripe

## 도메인 모델 (핵심 엔티티)

구현 시 이 이름과 관계를 일관되게 사용할 것. `docs/prd/01-architecture.md`의 도메인 모델 섹션 참조.

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

## AI Agent 역할 (편집국 구조)

Agent 구현 시 `docs/prd/03-ai-agent-pipeline.md`의 입출력 스펙을 정확히 따를 것.

| Agent | 역할 | 핵심 출력 |
|-------|------|----------|
| Analyst | 원본 분석, 인사이트 추출 | AnalysisReport |
| Writer | 플랫폼별 초안 작성 | DraftContents |
| Editor | 품질 교정, 점수 산출 | EditedContents + EditReport |
| Designer | 비주얼 에셋 생성 지시 | DesignSpecs |
| SEO Optimizer | 검색 최적화 | SEOReport |
| Fact Checker | 사실 관계 검증 | FactCheckReport |
| Compliance | 저작권/정책 준수 확인 | ComplianceReport |
| Localizer | 문화적/언어적 현지화 | LocalizedContents |
| Platform Formatter | 플랫폼 포맷 변환 | FormattedContents |

## 코딩 컨벤션

### 파일 구조
- `src/app/` - Next.js App Router 페이지
- `src/components/` - UI 컴포넌트
- `src/server/` - 서버 로직 (API, DB, Agents, Pipeline)
- `src/lib/` - 유틸리티, 설정
- `src/types/` - 공유 타입 정의
- `worker/` - 별도 워커 프로세스

### 네이밍
- 파일: kebab-case (`pipeline-monitor.tsx`)
- 컴포넌트: PascalCase (`PipelineMonitor`)
- 함수/변수: camelCase (`getPipelineRun`)
- DB 테이블/컬럼: snake_case (`pipeline_runs.started_at`)
- 타입: PascalCase (`PipelineRun`)
- 상수: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)

### 패턴
- Server Components를 기본으로 사용. Client Component는 `"use client"` 명시
- DB 쿼리는 Drizzle ORM으로만. raw SQL 금지
- AI 호출은 Vercel AI SDK의 `generateText`/`streamText` 사용
- 에러 핸들링은 tRPC의 TRPCError 사용
- 환경 변수는 `src/lib/env.ts`에서 zod로 검증 후 export

### 품질 기준
- 5대 품질 지표를 UI에 표시할 때 반드시 통일: Quality, Accuracy, Human-like, Platform-fit, Culture-fit
- 점수는 0-10 (소수점 1자리)
- 파이프라인 이벤트명은 `docs/prd/01-architecture.md`의 이벤트 목록과 일치시킬 것

## 구현 체크리스트 참조

각 Phase 구현 시 `docs/prd/10-roadmap.md`의 작업 목록을 체크리스트로 사용할 것.
Phase 순서를 건너뛰지 말 것.

## GitHub 프로젝트 관리

### 리포지토리
- **Repo**: `kronenz/content-forge-next`
- **Project Board**: [Content Forge Roadmap](https://github.com/users/kronenz/projects/7) (Project #7)

### gh CLI 사용법
gh CLI가 인증되어 있다. 이슈, PR, 프로젝트 관리에 적극 활용할 것.

```bash
# 이슈 조회
gh issue list                              # 전체 이슈 목록
gh issue list --label "phase:1-foundation" # Phase별 필터
gh issue list --milestone "M1: MVP (소스수집→가공→프리뷰)" # Milestone별
gh issue view 1                            # 이슈 상세

# 이슈 상태 관리
gh issue close 1 --reason completed        # 구현 완료 시 닫기
gh issue reopen 1                          # 재오픈
gh issue edit 1 --add-label "priority:critical"  # 라벨 추가

# PR 생성 (기능 구현 후)
gh pr create --title "feat: ..." --body "Closes #1"  # 이슈 자동 닫기 연결

# 프로젝트 보드
gh project item-list 7 --owner kronenz     # 프로젝트 아이템 목록
```

### 라벨 체계
- **Phase**: `phase:1-foundation` ~ `phase:8-saas` (구현 단계)
- **Type**: `type:feature`, `type:infra`, `type:bug`, `type:docs`, `type:agent`, `type:ui`
- **Priority**: `priority:critical`, `priority:high`, `priority:medium`, `priority:low`
- **PRD 참조**: `prd:architecture`, `prd:source`, `prd:pipeline`, `prd:publishing`, `prd:preview`, `prd:review`, `prd:ui-ux`, `prd:business`, `prd:seo`

### Milestones
| Milestone | 이슈 범위 | 기한 |
|-----------|----------|------|
| M1: MVP | Phase 1-4 (#1~#12, #19~#20) | 2026-05-14 |
| M2: Publishing + Auto-Approval | Phase 5-6 (#13~#14) | 2026-06-14 |
| M3: Advanced + Polish | Phase 7 (#15~#16) | 2026-07-14 |
| M4: SaaS Launch | Phase 8 (#17~#18) | 2026-08-14 |

### 이슈-구현 연동 규칙
- 기능 구현 시작 전: 해당 이슈 번호 확인
- 브랜치명: `feat/#이슈번호-간단설명` (예: `feat/#1-project-init`)
- 커밋 메시지에 `#이슈번호` 포함
- PR 생성 시 `Closes #이슈번호`로 자동 닫기 연결
- 구현 완료 후: `docs/prd/IMPLEMENTATION_TRACKER.md` 해당 항목 체크

## CI/CD

### GitHub Actions 워크플로우
| 워크플로우 | 트리거 | 동작 |
|-----------|--------|------|
| `.github/workflows/ci.yml` | PR, push to main | lint → typecheck → test(Postgres+Redis) → build → docker build → lighthouse(PR only) |
| `.github/workflows/deploy.yml` | push to main | Vercel 프로덕션 배포 |

### CI 통과 조건
- `bun run lint` 통과
- `bun run typecheck` 통과
- `bun run test` 통과 (Postgres + Redis 서비스 컨테이너)
- `bun run build` 성공
- Docker 이미지 빌드 성공
- Lighthouse: SEO > 95, Performance > 90 (PR 시)

### 필요한 GitHub Secrets
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

## Docker 로컬 환경

### 구성 파일
- `Dockerfile` - 멀티스테이지 빌드 (deps → builder → runner)
- `docker-compose.yml` - 로컬 개발 (app + Postgres + Redis)
- `docker-compose.test.yml` - 테스트 전용 (일회성 실행)

### Makefile 명령어
```bash
make dev           # 로컬 개발 서버 (bun dev)
make build         # 프로덕션 빌드
make lint          # ESLint 실행
make typecheck     # TypeScript 타입 체크
make test          # 로컬 테스트 실행
make up            # Docker 전체 스택 실행 (app + postgres + redis)
make up-build      # Docker 빌드 후 실행
make down          # Docker 중지
make test-docker   # Docker로 테스트 실행 (DB+Redis 포함, 일회성)
make clean         # Docker 중지 + 볼륨 삭제
make db-push       # Drizzle 스키마를 DB에 반영
make db-studio     # Drizzle Studio 실행 (DB GUI)
make db-generate   # Drizzle 마이그레이션 생성
make db-migrate    # Drizzle 마이그레이션 실행
make logs          # Docker 로그 확인
```

### Docker 서비스 포트
| 서비스 | 포트 | 접속 정보 |
|--------|------|----------|
| app | 3000 | http://localhost:3000 |
| postgres | 5432 | forge:forge@localhost:5432/content_forge |
| redis | 6379 | redis://localhost:6379 |

### 환경 변수
- `.env.example`에 모든 필요한 환경 변수 템플릿이 있다
- 로컬 개발 시 `.env.local`에 실제 값을 넣어 사용
- Docker 사용 시 DATABASE_URL, REDIS_URL은 docker-compose.yml에서 자동 주입

## 테스트

- 단위 테스트: Vitest
- E2E 테스트: Playwright
- Agent 테스트: 고정된 입력 → 출력 스냅샷 검증
- Docker 테스트: `make test-docker` (Postgres + Redis 포함 통합 테스트)
- CI 테스트: GitHub Actions에서 PR마다 자동 실행

## 작업 흐름 (워크플로우)

```
1. 이슈 확인: gh issue view {번호}
2. 브랜치 생성: git checkout -b feat/#{번호}-설명
3. PRD 읽기: 이슈에 명시된 PRD 문서 확인
4. 구현
5. 로컬 검증: make lint && make typecheck && make test
6. Docker 검증 (필요 시): make test-docker
7. 커밋: 메시지에 #{번호} 포함
8. PR 생성: gh pr create --title "feat: ..." --body "Closes #{번호}"
9. CI 통과 확인
10. 머지 후: IMPLEMENTATION_TRACKER.md 해당 항목 체크 + 파일 경로 기록
```
