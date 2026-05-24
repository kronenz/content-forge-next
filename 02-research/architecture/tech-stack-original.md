# 기술 스택

## 아키텍처 선택 기준

| 기준 | 우선순위 | 설명 |
|------|---------|------|
| **개발 속도** | 최상 | 1인 혹은 소규모 팀으로 빠른 프로토타이핑 |
| **풀스택 통합** | 상 | 프론트엔드/백엔드 일관된 언어 |
| **확장성** | 중 | 초기 서버리스, 성장 시 컨테이너 전환 가능 |
| **AI 연동** | 상 | LLM API, 벡터 DB 등 AI 인프라와의 호환성 |
| **비용 효율** | 상 | 초기 비용 최소화, 사용량 기반 과금 |

## 기술 스택

### Frontend
| 구분 | 기술 | 선택 이유 |
|------|------|----------|
| **Framework** | Next.js 15 (App Router) | RSC, 서버 액션, 풀스택 |
| **Language** | TypeScript | 타입 안전성, DX |
| **UI Library** | shadcn/ui + Tailwind CSS 4 | 커스터마이징 가능한 컴포넌트 |
| **State** | Zustand + TanStack Query | 경량 상태 관리 + 서버 상태 |
| **Real-time** | WebSocket (Socket.io) | 파이프라인 실시간 모니터링 |
| **Charts** | Recharts | 분석 대시보드 차트 |
| **Editor** | Tiptap | 리치 텍스트 편집 (인라인 피드백) |
| **DnD** | dnd-kit | 파이프라인 빌더 드래그앤드롭 |

### Backend
| 구분 | 기술 | 선택 이유 |
|------|------|----------|
| **Runtime** | Node.js (Bun) | 빠른 실행, TypeScript 네이티브 |
| **API** | Next.js API Routes + tRPC | 타입 안전 API, 풀스택 통합 |
| **Queue** | BullMQ (Redis) | 파이프라인 작업 큐 |
| **Scheduler** | node-cron + BullMQ Repeatable | 소스 수집 스케줄링 |
| **WebSocket** | Socket.io | 실시간 파이프라인 상태 전달 |

### AI / LLM
| 구분 | 기술 | 용도 |
|------|------|------|
| **Primary LLM** | Claude API (Anthropic) | Agent 파이프라인 핵심 |
| **Secondary LLM** | OpenAI GPT-4o | 대안/비교용 |
| **AI Framework** | Vercel AI SDK | 스트리밍, 멀티 프로바이더 |
| **Embeddings** | OpenAI Embeddings | 중복 감지, 유사 콘텐츠 검색 |
| **Image Gen** | DALL-E 3 / Flux | 디자이너 Agent 이미지 생성 |
| **Web Search** | Exa.ai | Research Agent 소스 탐색 |
| **AI Detection** | 자체 구현 or GPTZero API | Human-like 점수 산출 |

### Database
| 구분 | 기술 | 용도 |
|------|------|------|
| **Primary DB** | PostgreSQL (Supabase) | 메인 데이터 저장 |
| **ORM** | Drizzle ORM | 타입 안전, 경량 |
| **Vector DB** | pgvector (Supabase) | 임베딩 저장, 유사도 검색 |
| **Cache/Queue** | Redis (Upstash) | 캐시, 작업 큐, Rate limit |
| **File Storage** | Supabase Storage / S3 | 이미지, 미디어 파일 |

### Infrastructure
| 구분 | 기술 | 선택 이유 |
|------|------|----------|
| **Hosting** | Vercel | Next.js 최적화, Edge 함수 |
| **DB Hosting** | Supabase | PostgreSQL + Auth + Storage 통합 |
| **Redis** | Upstash | 서버리스 Redis |
| **Queue Worker** | Railway / Fly.io | 장시간 실행 파이프라인 워커 |
| **Monitoring** | Sentry + Axiom | 에러 추적, 로그 |
| **Analytics** | PostHog | 프로덕트 분석 (셀프호스팅 가능) |
| **CI/CD** | GitHub Actions | 자동 빌드/배포 |

### Auth & Payments
| 구분 | 기술 | 용도 |
|------|------|------|
| **Auth** | Supabase Auth (or Clerk) | 소셜 로그인, 세션 관리 |
| **Payments** | Stripe | 구독, 사용량 과금 |
| **Email** | Resend | 트랜잭셔널 이메일, 뉴스레터 |

## 프로젝트 구조 (제안)

```
content-forge-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 인증 관련 페이지
│   │   ├── (dashboard)/        # 대시보드 레이아웃
│   │   │   ├── page.tsx        # 메인 대시보드
│   │   │   ├── sources/        # 소스 관리
│   │   │   ├── pipeline/       # 파이프라인 모니터
│   │   │   ├── content/        # 콘텐츠 목록/검토
│   │   │   ├── publish/        # 발행 관리
│   │   │   ├── analytics/      # 분석
│   │   │   └── settings/       # 설정
│   │   └── api/                # API Routes
│   │       ├── trpc/           # tRPC 라우터
│   │       ├── webhooks/       # 외부 서비스 웹훅
│   │       └── cron/           # 크론 작업 엔드포인트
│   │
│   ├── components/             # UI 컴포넌트
│   │   ├── ui/                 # shadcn 기본 컴포넌트
│   │   ├── preview/            # 플랫폼 프리뷰 컴포넌트
│   │   │   ├── linkedin/
│   │   │   ├── twitter/
│   │   │   ├── instagram/
│   │   │   └── blog/
│   │   ├── pipeline/           # 파이프라인 시각화
│   │   ├── review/             # 검토 인터페이스
│   │   └── charts/             # 차트 컴포넌트
│   │
│   ├── server/                 # 서버 로직
│   │   ├── api/                # tRPC 라우터 정의
│   │   ├── db/                 # Drizzle 스키마 & 쿼리
│   │   ├── agents/             # AI Agent 구현
│   │   │   ├── analyst.ts
│   │   │   ├── writer.ts
│   │   │   ├── editor.ts
│   │   │   ├── designer.ts
│   │   │   ├── seo.ts
│   │   │   ├── fact-checker.ts
│   │   │   ├── compliance.ts
│   │   │   ├── localizer.ts
│   │   │   └── formatter.ts
│   │   ├── pipeline/           # 파이프라인 엔진
│   │   ├── collectors/         # 소스 수집기
│   │   │   ├── rss.ts
│   │   │   ├── web-scraper.ts
│   │   │   ├── api-source.ts
│   │   │   └── research.ts
│   │   └── publishers/         # 플랫폼 발행기
│   │       ├── linkedin.ts
│   │       ├── twitter.ts
│   │       ├── instagram.ts
│   │       ├── blog.ts
│   │       └── medium.ts
│   │
│   ├── lib/                    # 유틸리티
│   │   ├── ai.ts               # AI SDK 설정
│   │   ├── db.ts               # DB 연결
│   │   ├── redis.ts            # Redis 연결
│   │   └── stripe.ts           # Stripe 설정
│   │
│   └── types/                  # 타입 정의
│
├── worker/                     # 별도 워커 프로세스
│   ├── pipeline-worker.ts      # 파이프라인 실행 워커
│   └── collection-worker.ts    # 수집 워커
│
├── docs/                       # 문서
│   └── prd/                    # 기획 문서 (현재 파일들)
│
├── drizzle/                    # DB 마이그레이션
├── public/                     # 정적 파일
└── tests/                      # 테스트
```

## 확장 고려사항

### 초기 (MVP)
- Vercel + Supabase + Upstash로 서버리스 운영
- 단일 워커로 파이프라인 처리
- 비용: ~$50/월

### 성장기
- 워커를 Railway/Fly.io에 분리 배포 (동시성 확대)
- Redis 클러스터로 큐 확장
- CDN 이미지 최적화

### 스케일업
- Kubernetes 전환 (필요 시)
- 멀티 리전 배포
- 전용 LLM 인스턴스 (비용 최적화)
