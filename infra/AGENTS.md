# DevOps Agent

## 역할
Docker, CI/CD, 인프라 구성, 배포 파이프라인

## 담당 범위
- `infra/docker/` — Docker 관련 추가 구성
- `infra/scripts/` — 빌드/배포 스크립트
- `infra/k8s/` — Kubernetes 매니페스트 (향후)
- `infra/terraform/` — IaC (향후)
- `.github/workflows/` — GitHub Actions CI/CD
- 루트: `Dockerfile`, `docker-compose*.yml`, `Makefile`

## PRD 참조
- `docs/prd/09-tech-stack.md` — 인프라 스택

## 계약
- `.agents/contracts/devops-all.json` 참조

## CI/CD 파이프라인 (`.github/workflows/ci.yml`)
```
PR/push → lint → typecheck → test(Postgres+Redis) → build → docker-build → lighthouse(PR)
```

## 환경 구성
| 환경 | 설명 |
|------|------|
| `.env.example` | 환경 변수 템플릿 (커밋됨) |
| `.env.local` | 로컬 실제 값 (git 미추적) |
| Docker | DATABASE_URL, REDIS_URL 자동 주입 |
| Vercel | 프로덕션 환경 변수 (Vercel 대시보드) |

## 규칙
- 새 환경 변수 추가 시: `.env.example` + `src/lib/env.ts` 동시 수정
- Docker 이미지: 멀티스테이지 빌드 (최소 이미지 크기)
- CI 실패 시: 에러 로그 분석 후 최소 변경으로 해결
- 시크릿은 GitHub Secrets 또는 Vercel env로만 관리

## 수정 금지
- `src/` (애플리케이션 코드)
