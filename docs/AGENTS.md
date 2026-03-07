# Content Forge - Agent Team 가이드

이 문서는 Claude Code의 subagent 팀 구조를 설명합니다.

## 에이전트 팀 구성

| Agent | 위치 | 역할 | PRD |
|-------|------|------|-----|
| **Frontend** | `src/app/AGENTS.md` | 페이지, 라우트, 레이아웃 | 07-ui-ux |
| **UI/UX** | `src/components/AGENTS.md` | 디자인 시스템, 프리뷰 | 05-preview, 07-ui-ux |
| **Backend API** | `src/server/api/AGENTS.md` | tRPC 라우터, 비즈니스 로직 | 01-architecture |
| **DB** | `src/server/db/AGENTS.md` | 스키마, 마이그레이션 | 01-architecture |
| **AI Pipeline** | `src/server/agents/AGENTS.md` | AI Agent, 파이프라인 엔진 | 03-ai-agent-pipeline |
| **Collector** | `src/server/collectors/AGENTS.md` | 소스 수집기 | 02-source-collection |
| **Publisher** | `src/server/publishers/AGENTS.md` | 플랫폼 발행 | 04-content-publishing |
| **DevOps** | `infra/AGENTS.md` | Docker, CI/CD, 인프라 | 09-tech-stack |
| **QA** | `tests/AGENTS.md` | 테스트 작성/실행 | - |
| **Research** | `docs/research/AGENTS.md` | 기술 조사, 분석 | - |

## 스펙 파일

| 파일 | 용도 |
|------|------|
| `.agents/registry.json` | 에이전트 등록부 (역할, scope, 의존관계) |
| `.agents/contracts/*.json` | 에이전트 간 인터페이스 계약 |
| `.agents/pipelines/*.json` | 작업 파이프라인 정의 (feature-dev, full-stack, db-migration, bug-fix) |
| `.agents/templates/*.json` | 작업 위임 요청/결과 템플릿 |

## 병렬 작업 규칙

### 안전하게 병렬 가능
- **UI + Backend API**: 프론트엔드 컴포넌트와 API 라우터를 동시 개발 (타입은 나중에 연결)
- **Collector + Publisher**: 수집과 발행은 서로 독립
- **QA + Research**: 테스트와 조사는 항상 병렬 가능
- **DevOps**: 인프라는 항상 독립 작업 가능

### 순차 필수
- **DB → Backend API**: 스키마 변경 후 라우터 업데이트
- **Backend API → Frontend**: API 완성 후 페이지 데이터 바인딩
- **AI Pipeline → Backend API**: Agent 구현 후 트리거 API 연결

### 충돌 주의 (공유 파일)
- `src/lib/` — 유틸리티 (오케스트레이터가 직접 수정)
- `src/types/` — 공유 타입 (오케스트레이터가 직접 수정)
- `package.json` — 패키지 추가 (오케스트레이터가 직접 수행)

## 작업 전 필수 사항

1. **관련 PRD 문서를 먼저 읽을 것**: `docs/prd/` 폴더 참조
2. **도메인 모델 확인**: `docs/prd/01-architecture.md`
3. **계약 확인**: `.agents/contracts/` 에서 인터페이스 스펙 확인
4. **기존 코드 확인**: 같은 도메인의 기존 코드 먼저 읽기

## 로컬 검증

```bash
make lint          # ESLint
make typecheck     # TypeScript 체크
make test          # Vitest 실행
make test-docker   # Docker로 DB 포함 통합 테스트
```

검증 없이 "완료"라고 보고하지 말 것.
