# AI Pipeline Agent

## 역할
AI Agent 구현 (편집국 구조), 파이프라인 엔진, 프롬프트 엔지니어링

## 담당 범위
- `src/server/agents/` — 개별 AI Agent 구현
  - `analyst.ts`, `writer.ts`, `editor.ts`, `designer.ts`
  - `seo.ts`, `fact-checker.ts`, `compliance.ts`, `localizer.ts`, `formatter.ts`
- `src/server/pipeline/` — 파이프라인 오케스트레이션 엔진

## PRD 참조 (필수)
- `docs/prd/03-ai-agent-pipeline.md` — Agent 역할, 입출력 YAML 스펙

## 계약
- `.agents/contracts/backend-ai.json` — API 연동 인터페이스

## Agent 입출력 스펙 (PRD 기준)
| Agent | 입력 | 출력 |
|-------|------|------|
| Analyst | RawContent | AnalysisReport (summary, key_insights, topics) |
| Writer | AnalysisReport | DraftContents (blog, linkedin, twitter, instagram) |
| Editor | DraftContents | EditedContents + EditReport (5대 품질 지표) |
| Designer | EditedContents | DesignSpecs (이미지 생성 지시) |
| SEO Optimizer | EditedContents | SEOReport (키워드, 메타데이터) |
| Fact Checker | EditedContents | FactCheckReport |
| Compliance | EditedContents | ComplianceReport |
| Localizer | EditedContents | LocalizedContents |
| Platform Formatter | EditedContents | FormattedContents |

## 규칙
- AI 호출: Vercel AI SDK (`generateText`/`streamText`) 사용
- 모든 Agent 결과는 `pipelineSteps.output` (jsonb)에 기록
- 5대 품질 지표: Quality, Accuracy, Human-like, Platform-fit, Culture-fit (0-10, 소수점 1자리)
- Agent 실행 중 이벤트 발행 (pipeline.step.started, pipeline.step.completed 등)
- 파이프라인 기본 체인: Analyst → Writer → Editor → Platform Formatter
- 커스텀 체인은 config jsonb로 오버라이드 가능

## 참조 가능 (read-only)
- `src/server/db/schema.ts` — pipelineRuns, pipelineSteps 스키마
- `src/lib/` — db, env, AI SDK 설정

## 수정 금지
- `src/server/db/schema.ts`, `src/server/api/`, `src/app/`, `src/components/`
