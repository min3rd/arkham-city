# Copilot / AI agent instructions for arkham-city

Purpose: give an AI coding agent the minimal, actionable knowledge to be productive in this repo.

## Quick summary ✅
- Architecture: NestJS microservices (backend) + RabbitMQ (message broker) + Angular dashboard (frontend).
- Repos to work in: `arkham-city-core/` (backend), `arkham-city-dashboard/` (frontend), `arkham-city-websdk/` (lib), `docs/`.
- Key env var: `RABBITMQ_URL` (see `arkham-city-core/.env.example` & `docker-compose*.yml`).

## How to run / test (concrete commands) 🔧
- Start required infra for local dev/tests:
  - docker-compose -f docker-compose-dev.yml up -d
- Backend (core)
  - Install / run: cd `arkham-city-core` && npm install
  - Dev: cd `arkham-city-core` && npm run start:dev
  - Build: `npm run build` (runs `nest build`)
  - Tests: `npm test` (unit), `npm run test:e2e` (e2e — requires dev infra)
  - Lint: `npm run lint`
- Frontend (dashboard)
  - cd `arkham-city-dashboard` && npm install
  - Dev server: `npm run start` (ng serve)
  - Build: `npm run build` (ng build)
  - Tests (Karma): `npm run test`

## Project-specific conventions & patterns 📐
- Architecture
  - Gateway layer: `src/gateway/**` (HTTP controllers) → routes to services or sends messages to microservices.
  - Services: `src/modules/**` (business logic, used by both gateway and microservices).
  - Microservices: `src/microservices/**` (async workers via RabbitMQ).
  - See: `README.md` and `docs/STORAGE_API_IMPLEMENTATION.md` for message patterns.
- RabbitMQ
  - Clients use `RABBITMQ_URL`. Many modules configure ClientProxy using that env var (`arkham-city-core/src/main.ts`, various `*.module.ts`).
- NestJS
  - Use module boundaries and DI. DTOs use `class-validator`. Global guards (AuthGuard) are configured (`src/core/guards/auth/auth.guard.ts`).
- Angular
  - Prefer standalone components and Signals for local state. Use Transloco for i18n (`arkham-city-dashboard/src/assets/i18n` / transloco configuration).
  - Guards and auth utilities live in `arkham-city-dashboard/src/core/auth/` (see `auth.guard.ts`, `no-auth.guard.ts`).
  - Services: prefer `providedIn: 'root'` and `inject()` in new code where appropriate.

## Chức năng tương tự Firebase (mô tả ngắn) 🔥
- Authentication (Auth): hệ thống dùng JWT và module `auth` để đăng nhập/ủy quyền; xem `arkham-city-core/src/modules/auth` và gateway `gateway/gw-auth` (token handling, middleware, refresh logic).
- Firestore-like (document DB): triển khai dưới dạng module Firestore kết nối MongoDB (Mongoose) và microservice `ms-firestore`; xem `arkham-city-core/src/modules/firestore` và `src/microservices/ms-firestore` — bao gồm rule modules (`*firestore-rule`) để xử lý trigger/validation.
- Storage (file hosting): upload / storage pipeline và message handlers sống trong `src/modules/storage`, gateway `gateway/gw-storage` và microservice `ms-storage` (xem `gw-storage/README.md`).
- Realtime / Pub-Sub: các hoạt động bất đồng bộ, notification, và job queue dùng RabbitMQ; message patterns & queue names được mô tả trong `docs/STORAGE_API_IMPLEMENTATION.md` và trong README các module liên quan.
- Web SDK: `arkham-city-websdk/` cung cấp API client (auth helpers, firestore, manager, utils) tương tự Firebase SDK để frontend tương tác với gateway và microservices.

> Tip: khi sửa các phần này, hãy kiểm tra đồng thời `gateway` (API surface), `modules` (logic), `microservices` (workers) và `websdk` để giữ tương thích API và message shapes.

## Coding rules (enforced / not-optional) ⚠️
- Do NOT add console.log / console.error / debugger to committed code.
- Do NOT leave explanatory comments in code; update `docs/` or `README.md` instead (the project discourages non-essential inline comments).
- Do not hard-code secrets — use environment variables and `.env` files.
- Do not add dependencies without updating `package.json` and justifying them in PR description.

## What to check when making changes ✅
- Update docs when behaviour or API changes (`docs/` or module README files e.g., `src/modules/*/README.md`).
- Run lint/build/tests locally and mention failing steps if you cannot run them.
- For microservice changes, verify message shapes and queue names (see `docs/STORAGE_API_IMPLEMENTATION.md` and `gateway`/`microservices` README sections).
- For breaking changes, update consumable interfaces and call sites across `gateway` and `microservices`.

## Useful references (examples in repo) 📚
- Agent-level rules: `.github/agents/gpt5-agent.md` (contains project_instructions — preserve those rules)
- Architecture & dev workflow: `README.md` (root)
- RabbitMQ config & env: `docker-compose-dev.yml`, `docker-compose.yml`, `arkham-city-core/.env.example`
- Message patterns: `docs/STORAGE_API_IMPLEMENTATION.md` and module READMEs (e.g., `arkham-city-core/src/modules/storage/README.md`)
- Backend scripts: `arkham-city-core/package.json` (scripts: build, start:dev, test, lint)
- Frontend scripts: `arkham-city-dashboard/package.json` (start, build, test)
