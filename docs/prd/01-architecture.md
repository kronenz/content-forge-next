# 시스템 아키텍처

## 전체 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        Content Forge                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌──────────┐   ┌─────────┐ │
│  │  Source   │──▶│  AI Agent    │──▶│  Review  │──▶│ Publish │ │
│  │ Collector │   │  Pipeline    │   │  & QA    │   │ Engine  │ │
│  └──────────┘   └──────────────┘   └──────────┘   └─────────┘ │
│       ▲              ▲ ▼                ▲ ▼            ▲       │
│       │         ┌──────────┐      ┌──────────┐    ┌────────┐  │
│       │         │ Pipeline │      │ Preview  │    │Platform│  │
│       │         │ Monitor  │      │ Renderer │    │  APIs  │  │
│       │         └──────────┘      └──────────┘    └────────┘  │
│  ┌──────────┐                                                  │
│  │ Research │                                                  │
│  │  Agent   │                                                  │
│  └──────────┘                                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard (Web App)                                            │
│  - 소스 관리 | 파이프라인 모니터 | 프리뷰 | 발행 관리 | 분석    │
└─────────────────────────────────────────────────────────────────┘
```

## 계층 구조

### Layer 1: Data Layer
- **Database**: 소스 메타데이터, 수집 데이터, 가공 결과, 발행 이력
- **Object Storage**: 이미지, 미디어 파일
- **Vector Store**: 수집 콘텐츠의 임베딩 (중복 감지, 유사 콘텐츠 검색)

### Layer 2: Core Engine
- **Source Collector**: RSS, API, 웹 크롤링 기반 소스 수집
- **Research Agent**: Claude API, Exa.ai 등을 통한 능동적 소스 탐색
- **AI Agent Pipeline**: 단계별 AI Agent 체인 (편집국 구조)
- **Pipeline Monitor**: 파이프라인 진행 상태 및 중간 데이터 추적

### Layer 3: Output Layer
- **Preview Renderer**: 플랫폼별 네이티브 프리뷰 생성
- **Review System**: 품질 평가 + 승인/반려 워크플로우
- **Publish Engine**: 플랫폼 API 연동 발행

### Layer 4: Presentation Layer
- **Dashboard**: 통합 관리 웹 애플리케이션

## 데이터 흐름

```
1. 소스 등록/수집
   User → Source Config → Scheduler → Collector → Raw Content DB

2. 가공 파이프라인
   Raw Content → [Analyst] → [Writer] → [Editor] → [Designer] → Processed Content DB
                     ↓            ↓          ↓           ↓
                 분석 결과     초안       교정본     디자인 에셋
                 (중간 데이터가 모두 저장되어 Pipeline Monitor에서 조회 가능)

3. 검토 및 발행
   Processed Content → Preview Render → Human Review → Publish Queue → Platform APIs
                                              ↓
                                    (자동 승인 ON이면 바로 발행)
```

## 핵심 도메인 모델

```
Source (소스)
├── id, name, type (RSS/API/Web/Research)
├── url, config, schedule
├── processing_prompt (사용자 지정 가공 지시)
└── collections[] → RawContent

RawContent (원본 수집 데이터)
├── id, source_id, title, body, metadata
├── collected_at, hash (중복 감지용)
└── pipeline_runs[] → PipelineRun

PipelineRun (파이프라인 실행)
├── id, raw_content_id, status
├── started_at, completed_at
├── steps[] → PipelineStep
└── outputs[] → ProcessedContent

PipelineStep (파이프라인 단계)
├── id, pipeline_run_id, agent_role
├── input, output, status
├── started_at, completed_at
└── metadata (토큰 사용량, 모델 정보 등)

ProcessedContent (가공 콘텐츠)
├── id, pipeline_run_id, platform
├── title, body, media[], metadata
├── format_config (플랫폼별 포맷 설정)
└── reviews[] → Review

Review (검토)
├── id, processed_content_id
├── quality_scores (품질, 정확도, human-like 등)
├── status (pending/approved/rejected)
├── feedback, reviewer (human/auto)
└── published_at

Publication (발행)
├── id, processed_content_id, platform
├── published_url, status
├── engagement_metrics (선택적 수집)
└── published_at
```

## 이벤트 기반 처리

파이프라인의 각 단계는 이벤트 기반으로 동작하여 실시간 모니터링이 가능합니다.

```
Events:
- source.content.collected    → 새 콘텐츠 수집됨
- pipeline.step.started       → Agent 단계 시작
- pipeline.step.completed     → Agent 단계 완료 (중간 결과 포함)
- pipeline.step.failed        → Agent 단계 실패
- pipeline.completed          → 전체 파이프라인 완료
- review.requested            → 검토 요청됨
- review.approved             → 검토 승인됨
- review.rejected             → 검토 반려됨
- content.published           → 콘텐츠 발행됨
```

이벤트는 WebSocket을 통해 Dashboard에 실시간 전달됩니다.
