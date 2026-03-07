.PHONY: dev build test test-docker up down clean lint typecheck db-push db-studio \
       ci ci-quick ci-test ci-build ci-docker setup-runner setup-hooks \
       prod-up prod-down prod-build prod-logs

# Local development
dev:
	bun dev

build:
	bun run build

lint:
	bun run lint

typecheck:
	bun run typecheck

test:
	bun run test

# CI Pipeline (local)
ci:
	./scripts/ci-local.sh full

ci-quick:
	./scripts/ci-local.sh quick

ci-test:
	./scripts/ci-local.sh test

ci-build:
	./scripts/ci-local.sh build

ci-docker:
	./scripts/ci-local.sh docker

# Docker
up:
	docker compose up -d

down:
	docker compose down

up-build:
	docker compose up -d --build

test-docker:
	docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from test

clean:
	docker compose down -v
	docker compose -f docker-compose.test.yml down -v

# Database
db-push:
	bun drizzle-kit push

db-studio:
	bun drizzle-kit studio

db-generate:
	bun drizzle-kit generate

db-migrate:
	bun drizzle-kit migrate

# Logs
logs:
	docker compose logs -f

logs-app:
	docker compose logs -f app

# Production
prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-build:
	docker compose -f docker-compose.prod.yml build

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

# Setup
setup-runner:
	./scripts/setup-runner.sh

setup-hooks:
	git config core.hooksPath .githooks
	@echo "Git hooks configured to use .githooks/"
