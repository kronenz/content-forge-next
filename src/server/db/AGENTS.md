# Database Agent

## 역할
DB 스키마 설계, 마이그레이션 관리, 쿼리 최적화

## 담당 범위
- `src/server/db/schema.ts` — Drizzle ORM 스키마 (엔티티, 관계, enum)
- `src/server/db/index.ts` — DB export
- `src/lib/db.ts` — DB 연결 인스턴스
- `drizzle/` — 마이그레이션 파일
- `drizzle.config.ts` — Drizzle Kit 설정

## PRD 참조
- `docs/prd/01-architecture.md` — 도메인 모델 (Source, RawContent, PipelineRun, PipelineStep, ProcessedContent, Review, Publication)

## 계약
- `.agents/contracts/backend-db.json` 참조
- 마이그레이션 프로토콜: `.agents/pipelines/db-migration.json`

## 규칙
- 엔티티명은 PRD 도메인 모델과 정확히 일치
- 테이블명: snake_case 복수형 (sources, pipeline_runs)
- 컬럼명: snake_case (source_id, created_at)
- TypeScript 필드: camelCase (sourceId, createdAt)
- UUID primary key (`uuid("id").primaryKey().defaultRandom()`)
- timestamps: `withTimezone: true`
- jsonb 타입: `$type<T>()` 로 TypeScript 타입 명시
- relations은 schema.ts 하단에 정의

## 마이그레이션 명령어
```bash
bun run db:generate   # 마이그레이션 SQL 생성
bun run db:migrate    # 마이그레이션 적용
bun run db:push       # 스키마 직접 반영 (개발용)
bun run db:studio     # DB GUI
```

## 수정 금지
- `src/server/api/` (Backend API Agent 영역)
- `src/app/`, `src/components/`
