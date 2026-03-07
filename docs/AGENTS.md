# Content Forge - Subagent 가이드

이 문서는 Claude Code의 subagent(Agent tool)가 작업할 때 참조하는 가이드입니다.

## 프로젝트 컨텍스트

Content Forge는 AI Agent 기반 콘텐츠 수집-가공-발행 자동화 플랫폼입니다.

## 작업 전 필수 사항

1. **관련 PRD 문서를 먼저 읽을 것**: `docs/prd/` 폴더에 기획 문서가 있다. 구현할 기능의 PRD를 읽지 않고 추측으로 코드를 작성하지 말 것.
2. **도메인 모델 확인**: `docs/prd/01-architecture.md`의 도메인 모델 섹션에서 엔티티 이름과 관계를 확인할 것.
3. **기존 코드 확인**: 같은 도메인의 기존 코드가 있는지 `src/server/`, `src/components/`를 먼저 확인할 것.

## PRD 문서 매핑

| 작업 영역 | 참조할 PRD |
|----------|-----------|
| DB 스키마, 엔티티 | `docs/prd/01-architecture.md` |
| 소스 수집기 (RSS, API, Research) | `docs/prd/02-source-collection.md` |
| AI Agent (Analyst, Writer 등) | `docs/prd/03-ai-agent-pipeline.md` |
| 발행 API 연동 | `docs/prd/04-content-publishing.md` |
| 프리뷰 컴포넌트 | `docs/prd/05-platform-preview.md` |
| 검토/승인 UI | `docs/prd/06-quality-review.md` |
| 화면 레이아웃, UX | `docs/prd/07-ui-ux.md` |
| 구독/과금 로직 | `docs/prd/08-business-model.md` |
| SEO 관련 | `docs/prd/11-seo-strategy.md` |

## 기술 규칙

- Bun + Next.js 15 App Router + TypeScript strict
- UI: shadcn/ui + Tailwind CSS 4
- DB: Drizzle ORM (raw SQL 금지)
- API: tRPC
- AI: Vercel AI SDK
- 파일명: kebab-case, 컴포넌트: PascalCase
- Server Components 기본, Client는 `"use client"` 명시

## GitHub 이슈 연동

- Repo: `kronenz/content-forge-next`
- 기능 구현 시 관련 이슈 번호를 확인할 것: `gh issue list --label "phase:N-xxx"`
- 이슈에는 PRD 참조와 체크리스트가 포함되어 있으므로 반드시 확인
- 구현 완료 후 `docs/prd/IMPLEMENTATION_TRACKER.md` 해당 항목 체크

## 로컬 검증 명령어

```bash
make lint          # ESLint
make typecheck     # TypeScript 체크
make test          # Vitest 실행
make test-docker   # Docker로 DB 포함 통합 테스트
```

검증 없이 "완료"라고 보고하지 말 것. 최소한 lint + typecheck는 통과시킬 것.
