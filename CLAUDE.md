# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack web application boilerplate with three main components:
1. **backend/**: NestJS API with Prisma ORM, WebSocket support, and file upload capabilities
2. **demo/**: EduPlatform admin dashboard (Next.js 14 with App Router) - reference implementation
3. **frontend/**: Next.js 14 application with authentication and real-time features

The architecture follows a monorepo pattern with independent frontend and backend services that communicate via REST API and WebSockets.

## Development Commands

### Setup & Installation
```bash
# Initial setup (installs all dependencies, generates Prisma client, pushes schema)
npm run setup

# Individual workspace setup
npm run setup:frontend  # Installs frontend dependencies
npm run setup:backend   # Installs backend deps + runs Prisma generate & db push
npm run setup:demo      # Installs demo dependencies
```

### Running the Application
```bash
# Full Docker Compose stack (recommended)
npm run dev

# Individual services (for focused debugging)
npm run dev:backend   # Starts NestJS on port 3001
npm run dev:frontend  # Starts frontend Next.js on port 3000 (configured in frontend/)
npm run dev:demo      # Starts demo Next.js on port 3000 (configured in demo/)
```

### Building
```bash
# Build all workspaces
npm run build

# Individual builds
npm run build:frontend
npm run build:backend
npm run build:demo
```

### Testing
```bash
# Run all tests (frontend Jest + backend Jest + demo Playwright)
npm test

# Backend tests
cd backend
npm test              # Run unit tests
npm run test:watch    # Watch mode
npm run test:cov      # With coverage (target ≥80%)
npm run test:e2e      # End-to-end tests

# Frontend tests
cd frontend
npm test              # Run Jest tests
npm run test:watch    # Watch mode

# Demo tests
cd demo
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:headed  # Run with browser visible
```

### Linting & Formatting
```bash
# Backend
cd backend
npm run lint    # ESLint with auto-fix
npm run format  # Prettier formatting

# Frontend/Demo
cd frontend  # or cd demo
npm run lint    # Next.js lint
```

## Architecture & Key Patterns

### Backend (NestJS + Prisma)
- **Module structure**: Features organized as NestJS modules (`*.module.ts`, `*.service.ts`, `*.controller.ts`)
- **Database**: Prisma ORM with SQLite (dev) - schema at `backend/prisma/schema.prisma`
  - **User model**: Google OAuth integration with `googleId`, stores user profile and avatar
  - **File model**: Related to User, tracks uploaded files with metadata (mimetype, size, path)
- **Authentication**:
  - Passport.js strategies: Google OAuth 2.0 (`backend/src/auth/google.strategy.ts`) and JWT (`backend/src/auth/jwt.strategy.ts`)
  - JWT tokens for stateless auth between frontend and backend
  - Auth module structure in `backend/src/auth/`
- **WebSocket**: Socket.io gateway in `backend/src/websocket/` for real-time features
- **File Upload**: Multer-based system in `backend/src/upload/` - files stored in `/uploads`
- **Database Service**: Centralized Prisma client in `backend/src/prisma/prisma.service.ts`

After modifying `prisma/schema.prisma`, always run:
```bash
cd backend
npx prisma generate  # Regenerate Prisma Client
npx prisma db push   # Push schema changes to database
```

### Frontend & Demo (Next.js 14)
- **App Router**: Uses Next.js 14 App Router (not Pages Router)
- **Authentication**: NextAuth.js with Google OAuth provider
  - API routes in `demo/app/api/auth/[...nextauth]/route.ts`
  - Session management and auth callbacks configured for JWT
  - Role-based access: User, Operator, Admin (RBAC)
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Components**:
  - `demo/components/ui/`: Reusable UI primitives (buttons, forms, cards, etc.)
  - `demo/components/admin/`: Admin-specific components
  - `demo/components/general/`: General purpose components
  - Top-level components: `Sidebar.tsx`, `DashboardStats.tsx`, `UserChart.tsx`, etc.
- **Real-time**: Socket.io client connects to backend WebSocket gateway
- **Data Visualization**: Recharts library for charts and analytics

### Demo App Structure
The demo app (`demo/`) implements an EduPlatform admin dashboard with:
- **Routes** (in `demo/app/`):
  - `/admin/dashboard` - Main admin dashboard with stats and charts
  - `/admin/users` - User management
  - `/admin/courses` - Course management
  - `/admin/finance` - Financial reports
  - `/admin/content` - Content management
  - `/admin/reports` - Analytics and reporting
  - `/admin/analytics` - Advanced data analysis
  - `/admin/backup` - Backup/restore functionality
  - `/admin/monitoring` - System monitoring
  - `/admin/settings` - Configuration
- **Authentication Flow**: Protected routes use `ProtectedRoute.tsx` wrapper
- **Permissions**: `UserPermissions.tsx` handles RBAC checks

### Docker Configuration
- `docker-compose.yml` orchestrates: backend service, demo service, database
- Both frontend services (frontend & demo) run on port 3000 internally (mapped externally)
- Backend runs on port 3001
- Volume mounts enable hot reloading during development
- `/uploads` directory is mounted as a volume

## Environment Configuration

### Required Environment Variables

**demo/.env.local**:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
ADMIN_EMAIL=admin@example.com
```

**backend/.env**:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=<change-in-production>
GOOGLE_CLIENT_ID=<same-as-frontend>
GOOGLE_CLIENT_SECRET=<same-as-frontend>
```

### Google OAuth Setup
1. Google Cloud Console → Create OAuth 2.0 credentials
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. Use same `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in both frontend and backend

**Security**: Never commit real credentials. Use `.env.example` files as templates.

## Code Conventions

### TypeScript
- Explicit return types for exported functions and services
- Strict type checking enabled
- 2-space indentation (enforced by ESLint/Prettier)

### Naming
- Components: PascalCase (`UserCard.tsx`, `DashboardStats.tsx`)
- Hooks: camelCase with `use` prefix (`useDashboardData.ts`)
- Services: camelCase (`auth.service.ts`)
- Backend: NestJS conventions (`*.module.ts`, `*.service.ts`, `*.controller.ts`)

### File Organization
- Backend: Feature-based modules in `backend/src/`
- Frontend/Demo: App Router pages in `app/`, components in `components/`
- Colocate feature code: Keep related components, hooks, and services together
- Tests: Unit tests as `*.spec.ts` (backend) or `*.test.tsx` (frontend); E2E as `*.spec.ts` in `demo/tests/`

### Commit Conventions
- Use Conventional Commits: `feat(auth): add refresh tokens`, `fix(ui): button alignment`
- Prefixes: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- Squash commits before merging

## Common Development Tasks

### Adding a New Backend Module
```bash
cd backend
nest generate module feature-name
nest generate service feature-name
nest generate controller feature-name
```
Then register module in `app.module.ts` imports.

### Adding a New Prisma Model
1. Edit `backend/prisma/schema.prisma`
2. Run `npx prisma generate` (updates Prisma Client)
3. Run `npx prisma db push` (updates database)
4. If needed for production, create migration: `npx prisma migrate dev --name description`

### Adding Protected Routes
Wrap Next.js page components with `ProtectedRoute`:
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      {/* page content */}
    </ProtectedRoute>
  );
}
```

### Working with WebSockets
- Backend gateway: `backend/src/websocket/websocket.gateway.ts`
- Frontend client: Connect using Socket.io client with `NEXT_PUBLIC_WS_URL`
- Events are emitted from gateway and listened to on client

## Prisma Database Notes

- Development uses SQLite (`backend/prisma/dev.db`) - excluded from git
- Production should use PostgreSQL/MySQL (update `DATABASE_URL` and `provider`)
- After schema changes, regenerate client: `npx prisma generate`
- Push changes to DB: `npx prisma db push` (dev) or `npx prisma migrate dev` (with migrations)
- Prisma client is singleton, injected via `PrismaService`

## Important Files & Directories

- `backend/src/main.ts` - NestJS application entry point, configures CORS, port
- `demo/app/layout.tsx` - Root layout with AuthProvider and global styles
- `demo/app/api/auth/[...nextauth]/route.ts` - NextAuth.js configuration
- `config.js` - Root configuration for ports and URLs (if using config file)
- `docker-compose.yml` - Container orchestration
- `.dockerignore`, `.gitignore` - File exclusion patterns
- `uploads/` - Runtime file storage (excluded from git, mounted in Docker)

## Testing Strategy

- **Backend**: Jest unit tests (`*.spec.ts`) for services/controllers; E2E tests in `backend/test/`
- **Frontend**: Jest + React Testing Library for component tests
- **Demo**: Playwright for end-to-end tests covering authentication and admin flows
- Target: ≥80% coverage for backend services
- Run full test suite (`npm test` from root) before opening PRs

## Role-Based Access Control (RBAC)

Three-tier system implemented in demo app:
- **User**: Basic dashboard access
- **Operator**: Content management and reports
- **Admin**: Full administrative access

Admin email configured via `ADMIN_EMAIL` environment variable in `demo/.env.local`.

## Additional Guidance Files

This repository includes additional context files for other AI assistants:
- `AGENTS.md` - Cursor/Copilot-style coding guidelines and conventions
- `QWEN.md` - Comprehensive architectural overview

Refer to these for more detailed coding patterns and security notes.
