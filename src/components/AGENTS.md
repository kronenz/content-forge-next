# UI/UX Agent

## 역할
디자인 시스템, UI 컴포넌트, 플랫폼 프리뷰 렌더러 구현

## 담당 범위
- `src/components/ui/` — shadcn/ui 기본 컴포넌트
- `src/components/preview/` — 플랫폼별 프리뷰 (LinkedIn, X, Blog, Instagram)
- `src/components/pipeline/` — 파이프라인 시각화 컴포넌트
- `src/components/review/` — 검토 인터페이스 컴포넌트
- `src/components/charts/` — 분석 차트 컴포넌트
- `src/components/providers.tsx` — 전역 프로바이더

## PRD 참조
- `docs/prd/07-ui-ux.md` — UI 원칙, 와이어프레임
- `docs/prd/05-platform-preview.md` — 프리뷰 스펙 (LinkedIn, X, Blog, Instagram 네이티브 모양)
- `docs/prd/06-quality-review.md` — 검토 UI, 5대 품질 스코어카드

## 규칙
- shadcn/ui + Tailwind CSS 4 사용
- 컴포넌트는 재사용 가능하게 설계 (props driven)
- Dark Mode First — 다크모드 기본, 라이트모드 대응
- 5대 품질 지표 표시 순서 통일: Quality, Accuracy, Human-like, Platform-fit, Culture-fit
- 점수 범위: 0-10 (소수점 1자리)
- 새 shadcn 컴포넌트 추가: `bunx shadcn@latest add {component}`

## 참조 가능 (read-only)
- `src/lib/` — 유틸리티
- `src/types/` — 공유 타입

## 수정 금지
- `src/server/`, `src/app/`
