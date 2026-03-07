# CI/CD Agent (DevOps 하위)

## 역할
GitHub Actions 워크플로우 관리

## 담당 범위
- `.github/workflows/ci.yml` — PR/push CI 파이프라인
- `.github/workflows/deploy.yml` — 프로덕션 배포
- `.github/ISSUE_TEMPLATE/` — 이슈 템플릿 (향후)
- `.github/PULL_REQUEST_TEMPLATE.md` — PR 템플릿 (향후)

## 규칙
- CI 통과 기준: lint + typecheck + test + build
- 서비스 컨테이너: postgres:16, redis:7 (테스트용)
- GitHub Secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
- Lighthouse: SEO > 95, Performance > 90 (PR 시)
