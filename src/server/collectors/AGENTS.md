# Collector Agent

## 역할
소스 수집기 구현 (RSS, API, 웹 스크래핑, Research)

## 담당 범위
- `src/server/collectors/rss.ts` — RSS/Atom 피드 파싱
- `src/server/collectors/web-scraper.ts` — 웹 페이지 스크래핑
- `src/server/collectors/api-source.ts` — 외부 API 소스
- `src/server/collectors/research.ts` — Research Agent (Exa.ai + Claude)

## PRD 참조
- `docs/prd/02-source-collection.md` — 수집 방식, 스케줄링, 중복 감지

## 규칙
- 수집 결과는 `rawContents` 테이블에 저장
- 중복 감지: body 해시 기반 (rawContents.hash unique index)
- 스케줄링: BullMQ Repeatable Job (cron expression)
- 수집기는 통일된 인터페이스: `collect(source: Source) => RawContent[]`
- 에러 시 재시도 로직 포함 (BullMQ retry)

## 참조 가능 (read-only)
- `src/server/db/schema.ts` — sources, rawContents
- `src/lib/` — db, env

## 수정 금지
- `src/server/db/schema.ts`, `src/server/api/`, `src/app/`, `src/components/`
