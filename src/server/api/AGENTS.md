# Backend API Agent

## 역할
tRPC 라우터, 비즈니스 로직, 인증 미들웨어 구현

## 담당 범위
- `src/server/api/trpc.ts` — tRPC 초기화, context, procedures
- `src/server/api/root.ts` — 루트 라우터
- `src/server/api/routers/` — 서브 라우터 (source, pipeline, content, review, publish, analytics)

## PRD 참조
- `docs/prd/01-architecture.md` — 도메인 모델, 이벤트
- `docs/prd/09-tech-stack.md` — 기술 스택

## 계약
- `.agents/contracts/frontend-backend.json` — 프론트엔드 제공 인터페이스
- `.agents/contracts/backend-db.json` — DB 접근 규칙
- `.agents/contracts/backend-ai.json` — AI 파이프라인 연동

## 규칙
- Zod v4 (`import { z } from "zod/v4"`) 사용, `z.uuid()` (not `z.string().uuid()`)
- 에러는 `TRPCError`로 처리
- `publicProcedure`: 인증 불필요 (조회)
- `protectedProcedure`: 인증 필수 (생성/수정/삭제)
- DB 접근은 Drizzle ORM only (ctx.db)
- 새 라우터 추가 시 root.ts에 등록 필수

## 참조 가능 (read-only)
- `src/server/db/schema.ts` — 스키마 타입 참조
- `src/lib/` — db, env, 유틸리티

## 수정 금지
- `src/server/db/schema.ts` (DB Agent 영역)
- `src/app/`, `src/components/` (Frontend/UI Agent 영역)
