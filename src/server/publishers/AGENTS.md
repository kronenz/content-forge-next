# Publisher Agent

## 역할
플랫폼별 발행 연동 (Blog, LinkedIn, X, Instagram)

## 담당 범위
- `src/server/publishers/blog.ts` — 자체 블로그 발행
- `src/server/publishers/linkedin.ts` — LinkedIn API
- `src/server/publishers/twitter.ts` — X (Twitter) API
- `src/server/publishers/instagram.ts` — Instagram API
- `src/server/publishers/medium.ts` — Medium API (향후)

## PRD 참조
- `docs/prd/04-content-publishing.md` — 발행 방식, API 연동, 스케줄링

## 규칙
- 발행기 통일 인터페이스: `publish(content: ProcessedContent) => Publication`
- OAuth2 토큰 관리는 DB에 암호화 저장
- Rate limiting 준수 (각 플랫폼 API 제한)
- 발행 결과는 `publications` 테이블에 기록
- 스케줄 발행: 즉시 / 예약 / 최적 시간 자동 선택

## 참조 가능 (read-only)
- `src/server/db/schema.ts` — processedContents, publications
- `src/lib/` — db, env

## 수정 금지
- `src/server/db/schema.ts`, `src/server/api/`, `src/app/`, `src/components/`
