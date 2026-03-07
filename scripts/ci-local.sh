#!/usr/bin/env bash
set -euo pipefail

# Content Forge - Local CI Pipeline
# Mirrors GitHub Actions CI workflow locally
# Usage:
#   ./scripts/ci-local.sh          # full CI (lint + typecheck + test + build)
#   ./scripts/ci-local.sh quick    # quick check (lint + typecheck only)
#   ./scripts/ci-local.sh test     # test only (with Docker PG+Redis)
#   ./scripts/ci-local.sh build    # build only
#   ./scripts/ci-local.sh docker   # full Docker image build test

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

MODE="${1:-full}"
FAILED=0
RESULTS=()

step() {
  echo -e "\n${CYAN}${BOLD}[$1/${TOTAL}] $2${NC}"
}

pass() {
  local duration=$1
  RESULTS+=("${GREEN}PASS${NC} $2 (${duration}s)")
}

fail() {
  local duration=$1
  RESULTS+=("${RED}FAIL${NC} $2 (${duration}s)")
  FAILED=1
}

run_step() {
  local name="$1"
  local step_num="$2"
  shift 2
  step "$step_num" "$name"
  local start=$SECONDS
  if "$@" 2>&1; then
    pass $((SECONDS - start)) "$name"
  else
    fail $((SECONDS - start)) "$name"
    if [[ "$MODE" != "full" ]]; then
      print_summary
      exit 1
    fi
  fi
}

print_summary() {
  echo -e "\n${BOLD}========== CI Results ==========${NC}"
  for r in "${RESULTS[@]}"; do
    echo -e "  $r"
  done
  echo -e "${BOLD}=================================${NC}"

  if [[ $FAILED -eq 0 ]]; then
    echo -e "\n${GREEN}${BOLD}All checks passed!${NC}\n"
  else
    echo -e "\n${RED}${BOLD}Some checks failed.${NC}\n"
  fi
}

# Ensure dependencies are installed
ensure_deps() {
  if [[ ! -d "node_modules" ]]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    bun install --frozen-lockfile
  fi
}

# Start Docker services for test (PG + Redis)
start_test_services() {
  echo -e "${CYAN}Starting test services (Postgres + Redis)...${NC}"
  docker compose -f docker-compose.test.yml up -d postgres redis 2>/dev/null

  # Wait for healthy
  local retries=30
  while [[ $retries -gt 0 ]]; do
    local pg_ready redis_ready
    pg_ready=$(docker compose -f docker-compose.test.yml exec -T postgres pg_isready -U test 2>/dev/null && echo "yes" || echo "no")
    redis_ready=$(docker compose -f docker-compose.test.yml exec -T redis redis-cli ping 2>/dev/null | grep -q PONG && echo "yes" || echo "no")
    if [[ "$pg_ready" == "yes" && "$redis_ready" == "yes" ]]; then
      echo -e "${GREEN}Test services ready.${NC}"
      return 0
    fi
    retries=$((retries - 1))
    sleep 1
  done
  echo -e "${RED}Test services failed to start.${NC}"
  return 1
}

stop_test_services() {
  docker compose -f docker-compose.test.yml down 2>/dev/null || true
}

# --- Modes ---

case "$MODE" in
  quick)
    TOTAL=2
    ensure_deps
    run_step "Lint" 1 bun run lint
    run_step "TypeCheck" 2 bun run typecheck
    ;;

  test)
    TOTAL=1
    ensure_deps
    start_test_services
    trap stop_test_services EXIT
    export DATABASE_URL="postgresql://test:test@localhost:5432/content_forge_test"
    export REDIS_URL="redis://localhost:6379"
    export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
    export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
    run_step "Test" 1 bun run test
    ;;

  build)
    TOTAL=1
    ensure_deps
    export NEXT_PHASE=phase-production-build
    export DATABASE_URL="https://placeholder.db"
    export REDIS_URL="https://placeholder.redis"
    export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
    export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
    run_step "Build" 1 bun run build
    ;;

  docker)
    TOTAL=1
    run_step "Docker Build" 1 docker build --build-arg NEXT_PHASE=phase-production-build -t content-forge:local-test .
    ;;

  full)
    TOTAL=5
    ensure_deps
    run_step "Lint" 1 bun run lint
    run_step "TypeCheck" 2 bun run typecheck

    start_test_services
    trap stop_test_services EXIT
    export DATABASE_URL="postgresql://test:test@localhost:5432/content_forge_test"
    export REDIS_URL="redis://localhost:6379"
    export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
    export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
    run_step "Test" 3 bun run test

    export NEXT_PHASE=phase-production-build
    export DATABASE_URL="https://placeholder.db"
    export REDIS_URL="https://placeholder.redis"
    run_step "Build" 4 bun run build

    run_step "Docker Build" 5 docker build --build-arg NEXT_PHASE=phase-production-build -t content-forge:local-test .
    ;;

  *)
    echo "Usage: $0 {full|quick|test|build|docker}"
    exit 1
    ;;
esac

print_summary
exit $FAILED
