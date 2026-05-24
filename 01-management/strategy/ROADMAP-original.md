# 개발 로드맵

## Phase 1: Foundation (Week 1-3)
> 프로젝트 기반 구축 및 핵심 인프라 설정

### 목표
- 개발 환경 셋업
- 기본 CRUD 구조 완성
- 인증 + DB + 기본 UI 골격

### 작업 목록
- [ ] Next.js 15 프로젝트 초기화 (Bun, TypeScript, Tailwind, shadcn)
- [ ] Supabase 프로젝트 생성 (PostgreSQL, Auth, Storage)
- [ ] Drizzle ORM 스키마 설계 및 마이그레이션
- [ ] tRPC 라우터 기본 구조
- [ ] 인증 플로우 (소셜 로그인: Google, GitHub)
- [ ] 대시보드 기본 레이아웃 (사이드바, 헤더)
- [ ] 기본 랜딩 페이지

### 산출물
- 로그인 가능한 대시보드 셸
- DB 스키마 v1

---

## Phase 2: Source Collection (Week 3-5)
> 소스 등록 및 자동 수집 시스템

### 목표
- 소스 CRUD
- RSS 수집기 구현
- 수집 스케줄러

### 작업 목록
- [ ] 소스 등록/수정/삭제 UI
- [ ] RSS/Atom 피드 수집기
- [ ] 웹 스크래핑 수집기 (기본)
- [ ] 수집 스케줄러 (BullMQ Repeatable Job)
- [ ] 중복 감지 (해시 기반)
- [ ] 소스 그룹 관리
- [ ] 수집 상태 모니터링 UI
- [ ] processing_prompt 입력 UI

### 산출물
- 소스를 등록하면 자동으로 콘텐츠를 수집하는 기능

---

## Phase 3: AI Pipeline Core (Week 5-8)
> AI Agent 파이프라인 핵심 구현

### 목표
- 핵심 Agent 4종 구현 (Analyst, Writer, Editor, Formatter)
- 파이프라인 실행 엔진
- 실시간 모니터링

### 작업 목록
- [ ] AI SDK (Vercel AI SDK) 연동
- [ ] Analyst Agent 구현
- [ ] Writer Agent 구현 (멀티 플랫폼 초안)
- [ ] Editor Agent 구현 (교정 + 품질 점수)
- [ ] Platform Formatter Agent 구현
- [ ] 파이프라인 실행 엔진 (BullMQ Job Chain)
- [ ] 파이프라인 모니터 UI (실시간 진행 상태)
- [ ] 단계별 중간 데이터 열람 UI
- [ ] WebSocket 실시간 업데이트

### 산출물
- 수집된 콘텐츠가 AI 파이프라인을 거쳐 가공되는 E2E 플로우

---

## Phase 4: Preview & Review (Week 8-10)
> 플랫폼 프리뷰 및 품질 검토 시스템

### 목표
- 플랫폼별 프리뷰 컴포넌트
- 품질 평가 인터페이스
- 승인 워크플로우

### 작업 목록
- [ ] LinkedIn 프리뷰 컴포넌트
- [ ] X (Twitter) 프리뷰 컴포넌트
- [ ] 블로그 프리뷰 컴포넌트
- [ ] Instagram 프리뷰 컴포넌트
- [ ] 멀티 플랫폼 동시 비교 뷰
- [ ] 품질 스코어카드 UI (5대 지표)
- [ ] 검토 인터페이스 (승인/수정/반려)
- [ ] 인라인 피드백 (텍스트 선택 코멘트)
- [ ] 반응형 프리뷰 (Desktop/Tablet/Mobile)
- [ ] 다크모드/라이트모드 프리뷰 전환

### 산출물
- 실제 플랫폼과 동일한 프리뷰로 검토 후 승인 가능

---

## Phase 5: Publishing (Week 10-12)
> 멀티 플랫폼 발행 시스템

### 목표
- 주요 플랫폼 API 연동
- 발행 스케줄링
- 자체 블로그 발행

### 작업 목록
- [ ] 자체 블로그 시스템 (공개 페이지)
- [ ] LinkedIn API 연동 발행
- [ ] X (Twitter) API 연동 발행
- [ ] 발행 스케줄러 (예약/즉시/최적시간)
- [ ] 크로스 포스팅 전략 설정
- [ ] 발행 이력 관리
- [ ] 실패 재시도 및 알림
- [ ] OG 이미지 미리보기

### 산출물
- 승인된 콘텐츠가 실제 플랫폼에 발행

---

## Phase 6: Auto-Approval & Analytics (Week 12-14)
> 자동 승인 및 분석 대시보드

### 목표
- 자동 승인 시스템
- 발행 성과 분석
- 파이프라인 비용/효율 분석

### 작업 목록
- [ ] 자동 승인 조건 설정 UI
- [ ] 신뢰도 레벨 시스템 구현
- [ ] 사후 품질 모니터링
- [ ] 분석 대시보드 (개요, 플랫폼별, 콘텐츠별)
- [ ] 발행 성과 수집 (API 기반)
- [ ] 품질 추이 차트
- [ ] 비용 분석 (토큰 사용량, API 비용)
- [ ] 콘텐츠 캘린더 뷰

### 산출물
- 검증된 파이프라인은 자동으로 발행까지 완료

---

## Phase 7: Advanced Features (Week 14-17)
> 고급 기능 및 UX 향상

### 작업 목록
- [ ] Research Agent (Exa.ai, Claude 기반)
- [ ] 추가 Agent (SEO, Fact Checker, Compliance)
- [ ] 드래그앤드롭 파이프라인 빌더
- [ ] Command Palette (Cmd+K)
- [ ] AI Assistant Chat
- [ ] Instagram/Threads 발행 연동
- [ ] Medium/Hashnode 발행 연동
- [ ] 키보드 단축키 완성
- [ ] 알림 시스템 (Push, Email, Slack)
- [ ] Vector DB 유사 콘텐츠 검색

---

## Phase 8: SaaS & Launch (Week 17-20)
> SaaS화 및 퍼블릭 런칭

### 작업 목록
- [ ] Stripe 결제 연동
- [ ] 구독 플랜 구현 (Free/Creator/Pro)
- [ ] 사용량 제한 및 과금
- [ ] 온보딩 위저드
- [ ] 랜딩 페이지 완성
- [ ] 문서 사이트 (Docs)
- [ ] Product Hunt 런칭 준비
- [ ] 성능 최적화 및 보안 감사

---

## Phase 9: Growth (Week 20+)
> 성장 및 확장

### 작업 목록
- [ ] 팀 플랜 (멀티 유저, 역할 관리)
- [ ] 템플릿 마켓플레이스
- [ ] API 공개 (개발자용)
- [ ] 화이트 라벨 옵션
- [ ] 모바일 앱 (또는 PWA)
- [ ] 다국어 지원
- [ ] Enterprise 기능

---

## 마일스톤 요약

| 마일스톤 | 기간 | 핵심 결과물 |
|---------|------|-----------|
| **M1: MVP** | Week 1-10 | 소스 수집 → AI 가공 → 프리뷰 검토 E2E |
| **M2: Publishing** | Week 10-14 | 실제 플랫폼 발행 + 자동 승인 |
| **M3: Polish** | Week 14-17 | 고급 Agent + UX 향상 |
| **M4: Launch** | Week 17-20 | SaaS 런칭 + 결제 |
| **M5: Scale** | Week 20+ | 팀, 마켓플레이스, API |
