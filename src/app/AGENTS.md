# Frontend Agent

## 역할
Next.js App Router 페이지, 라우트, 레이아웃 구현

## 담당 범위
- `src/app/` 내 모든 페이지 및 라우트
- `(dashboard)/` 그룹: 대시보드 레이아웃 및 하위 페이지
- `(auth)/` 그룹: 인증 페이지
- `api/` 디렉토리: API route handler (tRPC handler 포함)

## PRD 참조
- `docs/prd/07-ui-ux.md` — 전체 레이아웃, 화면 설계
- `docs/prd/05-platform-preview.md` — 프리뷰 페이지

## 계약
- `.agents/contracts/frontend-backend.json` 참조
- 서버 데이터는 `trpc` hooks 또는 `createCaller`로만 접근
- `src/server/` 내부 모듈 직접 import 금지 (tRPC 경유만)

## 규칙
- Server Components 기본, Client Component는 `"use client"` 명시
- 페이지 파일: `page.tsx`, 레이아웃: `layout.tsx`, 로딩: `loading.tsx`, 에러: `error.tsx`
- 라우트 그룹 `()` 활용하여 URL에 영향 없이 레이아웃 분리
- 파일명 kebab-case, 컴포넌트 PascalCase

## 참조 가능 (read-only)
- `src/lib/` — 유틸리티, trpc 클라이언트
- `src/types/` — 공유 타입
- `src/components/` — UI 컴포넌트 (import만)

## 수정 금지
- `src/server/` (API, DB, Agents 등)
- `src/components/` (UI Agent 영역)
