.PHONY: dev build test test-docker up down clean lint typecheck db-push db-studio

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
