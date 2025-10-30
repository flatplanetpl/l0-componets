# Repository Guidelines

## Project Structure & Module Organization
- `frontend/`: Next.js 14 app for the public UI; keep shared UI primitives in `frontend/components` and colocate feature code under `frontend/app`.
- `backend/`: NestJS API with Prisma; business logic lives in `backend/src`, database schema in `backend/prisma`, and integration specs under `backend/test`.
- `demo/`: EduPlatform admin demo (Next.js App Router) used as a reference implementation; keep demo-only integrations here.
- `uploads/`: Runtime storage for file uploads—do not commit contents. Docker, config, and root scripts live alongside `docker-compose.yml` and `config.js`.

## Build, Test, and Development Commands
- `npm run setup`: Install dependencies for all workspaces and run `prisma generate` + `db push`.
- `npm run dev`: Launches Docker Compose stack with frontend, backend, and supporting services.
- `npm run dev:backend`, `npm run dev:frontend`, `npm run dev:demo`: Start individual apps locally without Docker; useful for focused debugging.
- `npm run build`: Runs workspace builds in sequence (`build:frontend`, `build:backend`, `build:demo`).
- `npm run test`: Executes frontend Jest suite, backend Jest suite, and demo tests in order; run from repo root before opening a PR.

## Coding Style & Naming Conventions
- TypeScript is mandatory across apps; prefer explicit return types for exported functions and services.
- Stick to 2-space indentation in Next.js projects and 2-space indentation with NestJS defaults (`eslint --fix` will enforce).
- Use ESLint + Prettier via `npm run lint` inside each workspace (`next lint` for frontend/demo, `eslint` for backend). No manual formatting overrides.
- Component names follow PascalCase (`UserCard.tsx`); hooks and services use camelCase (`useDashboardData.ts`).
- Backend files mirror NestJS module structure (`*.module.ts`, `*.service.ts`, `*.controller.ts`).

## Testing Guidelines
- Frontend and demo use Jest (unit) and Playwright (demo e2e). Add tests under `frontend/__tests__` or colocated `*.test.tsx`.
- Backend unit tests live in `backend/src/**/*.spec.ts` and follow NestJS testing patterns. Use `npm run test:cov` for coverage targets ≥80%.
- Name Playwright specs `*.spec.ts` under `demo/tests`. Run `npm run test:e2e` from `demo/` before merging UI changes.

## Commit & Pull Request Guidelines
- Use Conventional Commit prefixes (`feat`, `fix`, `chore`, `docs`, `refactor`) with concise scopes, e.g. `feat(auth): refresh tokens`.
- Squash commits before merge; keep commit bodies limited to rationale and follow-up notes.
- Pull requests should include: summary of changes, manual/automated test evidence (`npm run test` output), linked issue or task ID, and screenshots/GIFs for UI work.
- Check that CI (if configured) and local checks pass, and ensure schema updates include regenerated Prisma artifacts.

## Environment & Security Notes
- Copy `.env.example` files before running any app (`demo/.env.local`, `backend/.env`); never commit secrets.
- Keep generated Prisma migrations or seed data under version control, but exclude actual SQLite files (`backend/prisma/dev.db`) from commits.
- When using Docker, prune volumes sparingly to avoid losing seeded data; document any required seed steps in PR descriptions.
