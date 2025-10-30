# Qwen Code Context File

## Project Overview

This is a comprehensive modern web application boilerplate that provides a full technology stack for building web applications. The project consists of three main components:

1. **Frontend (demo directory)**: Next.js 14 application implementing an e-learning platform admin dashboard
2. **Backend (backend directory)**: NestJS API with authentication, file upload, and WebSocket functionality
3. **Docker Compose configuration**: For containerized development and deployment

The project is designed as a complete starter kit with authentication, real-time features, and role-based access control.

## Architecture

### Frontend (demo/eduplatform-admin)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Google OAuth via NextAuth.js
- **State Management**: React with custom hooks
- **Data Visualization**: Recharts for analytics
- **Icons**: Lucide React
- **Real-time**: Socket.io Client for WebSocket communication
- **Testing**: Jest + React Testing Library, Playwright for e2e tests

### Backend (backend)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (development)
- **Authentication**: Passport.js with Google OAuth and JWT
- **File Upload**: Multer
- **Real-time**: Socket.io for WebSocket communication
- **Testing**: Jest with e2e test support
- **Code Quality**: ESLint + Prettier

### Containerization
- **Docker Compose**: For local development and deployment
- **Services**: demo (frontend), backend (API), db (database)
- **Port Mapping**: Frontend 3000, Backend 3001
- **Volume Mounting**: For hot reloading in development

## Project Structure

```
boilerplate-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication modules
│   │   ├── upload/         # File upload functionality
│   │   ├── websocket/      # WebSocket gateway implementation
│   │   └── prisma/         # Database service and schema
│   ├── prisma/             # Database schema and migrations
│   └── Dockerfile
├── demo/                   # EduPlatform Admin Dashboard (Next.js app)
│   ├── app/                # Next.js App Router pages
│   │   ├── admin/         # Admin dashboard sections
│   │   ├── api/           # API routes
│   │   └── ...
│   ├── components/         # React components
│   │   ├── admin/         # Admin-specific components
│   │   ├── general/       # General UI components
│   │   ├── ui/            # Reusable UI components
│   │   └── ...
│   ├── lib/               # Utility functions and configs
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   ├── config/            # Application configuration
│   └── ...
├── uploads/               # Uploaded files storage
├── docker-compose.yml     # Docker configuration
├── config.js              # Project configuration
├── package.json           # Root package file with scripts
└── ...
```

## Key Features

### Authentication & Authorization
- **Google OAuth**: Implemented with NextAuth.js on frontend and Passport.js on backend
- **Role-Based Access Control (RBAC)**: Three-tier system:
  - **User**: Basic access to dashboard and courses
  - **Operator**: Access to content management and reports
  - **Admin**: Full access to all administrative features
- **JWT**: For stateless authentication between frontend and backend

### Admin Dashboard Sections
1. **Dashboard**: Overview with key metrics and charts
2. **Users**: User management with CRUD operations
3. **Courses**: Course management with enrollment tracking
4. **Finance**: Financial reports and transaction tracking
5. **Content**: Educational content management
6. **Reports**: Analytics and reporting tools
7. **Analytics**: Advanced data analysis and insights
8. **Backup**: Backup and restore functionality
9. **Monitoring**: Performance monitoring and alerts
10. **Settings**: Account and platform configuration

### Real-time Communication
- **WebSocket**: Socket.io implementation for real-time features
- **Live Updates**: Dashboard metrics and notifications

### File Handling
- **Upload**: Multer-based file upload system with backend storage
- **Storage**: Local file storage in the uploads directory

## Building and Running

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Developer Account (for OAuth)

### Quick Start with Docker (Recommended)
```bash
# Install dependencies
npm run setup

# Run with Docker Compose
npm run dev
```

### Manual Local Development
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:demo
```

### Environment Configuration
Copy and configure the following files:
- `demo/.env.local`
- `backend/.env`

Required Google OAuth redirect: `http://localhost:3000/api/auth/callback/google`

### Testing
```bash
# All tests
npm test

# Frontend only
cd demo && npm test

# Backend only
cd backend && npm test
```

## Development Conventions

### Code Quality
- TypeScript for all JavaScript code
- ESLint for linting with recommended configuration
- Prettier for code formatting
- Git hooks (if configured) to enforce code standards

### Project Structure
- Feature-based organization in both frontend and backend
- Component-first approach in the frontend
- Module-based architecture in the backend

### Security
- JWT tokens for authentication
- Environment variables for sensitive data
- OAuth 2.0 with Google for user authentication
- Input validation and sanitization

## Deployment

### Docker Compose
The project includes Docker Compose configuration for easy containerized deployment.

### Alternative Deployment Options
- Frontend can be deployed independently on Vercel/Netlify
- Backend can be deployed on any Node.js hosting platform
- Database configuration may need updates for production

## Technologies Used

### Frontend Stack
- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- NextAuth.js for authentication
- Recharts for data visualization
- Socket.io Client for WebSockets
- Lucide React for icons
- Shadcn/ui for component library

### Backend Stack
- NestJS framework
- TypeScript
- Prisma ORM
- SQLite for development
- Passport.js for authentication
- Socket.io for real-time features
- Multer for file uploads

### DevOps
- Docker & Docker Compose
- ESLint + Prettier
- Jest for testing

## Key Configuration Files

- `docker-compose.yml`: Container orchestration
- `package.json` (root, backend, demo): Dependencies and scripts
- `config.js`: Port and URL configuration
- `.env` files: Environment-specific configuration
- `prisma/schema.prisma`: Database schema definition

## Application URLs

When running locally:
- **Frontend**: http://localhost:3000 (or as configured in environment)
- **Backend API**: http://localhost:3001 (or as configured in environment)
- **Admin Dashboard**: http://localhost:3000/admin/dashboard (after authentication)

## Security Considerations

- Store secrets in environment variables, never commit to git
- Use HTTPS in production
- Validate and sanitize all user inputs
- Implement proper rate limiting for API endpoints
- Update dependencies regularly
- Use strong JWT secrets in production

## Troubleshooting

Common issues and solutions:
- Check that all environment variables are properly configured
- Verify that Docker daemon is running for containerized setup
- Ensure Google OAuth credentials match the configured redirect URIs
- Make sure all required ports are available
- Check for conflicting installations in the global environment