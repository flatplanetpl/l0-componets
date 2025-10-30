# Modern Web App Boilerplate

A production-ready boilerplate for building scalable web applications with modern technologies. Features a complete full-stack setup with authentication, real-time communication, and admin dashboard.

[![Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://brandbook-demo.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **🔐 Authentication**: Google OAuth with NextAuth.js and JWT
- **📊 Admin Dashboard**: Complete admin panel with charts and data tables
- **💬 Real-time Chat**: WebSocket communication with Socket.io
- **📁 File Upload**: Secure file handling with Multer
- **🎨 Modern UI**: Tailwind CSS with dark/light theme support
- **🧪 Testing**: Jest + React Testing Library + Playwright E2E
- **🐳 Docker**: Full containerization with Docker Compose
- **📱 Responsive**: Mobile-first design with adaptive layouts

## 🚀 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Socket.io Client** for real-time features

### Backend
- **NestJS** framework
- **Prisma ORM** with SQLite
- **Socket.io** for WebSockets
- **Passport + JWT** for auth
- **Multer** for file uploads

### DevOps & Testing
- **Docker Compose** for development
- **Jest + Playwright** for testing
- **ESLint + Prettier** for code quality

## 📁 Project Structure

```
boilerplate-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/           # Authentication
│   │   ├── upload/         # File upload
│   │   ├── websocket/      # WebSocket gateway
│   │   └── prisma/         # Database service
│   ├── prisma/             # Database schema
│   └── Dockerfile
├── demo/                   # EduPlatform Admin Dashboard demo
│   ├── app/                # Next.js App Router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom hooks
│   └── services/           # API services
├── uploads/                # Uploaded files
├── docker-compose.yml      # Docker configuration
└── package.json
```

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Google Developer Account (for OAuth)

### 1. Clone and install
```bash
# Install dependencies
npm run setup

# Or manually:
cd backend && npm install
cd ../demo && npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`

### 3. Environment variables

⚠️ **SECURITY**: Never commit real credentials to git!

Copy example files and add your credentials:

```bash
# Demo (frontend)
cp demo/.env.example demo/.env.local

# Backend
cp backend/.env.example backend/.env
```

**demo/.env.local:**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
ADMIN_EMAIL=admin@example.com
```

**backend/.env:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-jwt-secret-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Run the application

```bash
# With Docker Compose (recommended)
npm run dev

# Or locally:
npm run dev:backend  # Terminal 1
npm run dev:demo     # Terminal 2
```

Application will be available at:
- Demo: http://localhost:3000
- Backend API: http://localhost:3001

## 🧪 Testing

```bash
# All tests
npm test

# Frontend only
cd demo && npm test

# Backend only
cd backend && npm test
```

## 🗺️ Frontend Component Roadmap

### Phase 1: Core Components (Current)
- [x] **Button Variants**: Primary, secondary, outline, ghost, destructive
- [x] **Form Fields**: Text, password, number, textarea, select, checkbox, radio
- [x] **Navigation**: Breadcrumbs, pagination, mega menu
- [x] **Feedback**: Toast notifications, alerts, inline messages
- [x] **Layout**: Cards, sections, grids, toolbars

### Phase 2: Advanced Components (Next)
- [ ] **Enhanced Modal System**: Size variants, composition, confirmation dialogs
- [ ] **Complete Toast System**: Variants, actions, positioning options
- [ ] **Advanced Data Table**: Sorting, filtering, resizing, row selection
- [ ] **Full Calendar System**: widok miesiąca/tygodnia, drag & drop, integracja z TimePicker (system typu Outlook/Agenda)
- [ ] **Data Visualization**: Charts integration (Chart.js/Recharts)
- [ ] **Skeleton Loaders**: Loading states for better UX
- [ ] **Advanced Dropdowns**: Multi-level, searchable, keyboard navigation
- [ ] **Form Validation**: Field validation, error handling, async validation
- [ ] **File Management**: Drag & drop uploader with progress
- [ ] **Interactive Tables**: Sorting, filtering, bulk actions
- [ ] **Advanced Forms**: Multi-step wizards, conditional fields
- [ ] **Real-time Features**: WebSocket status indicators, live updates

### Phase 3: Specialized Components (Future)
- [ ] **Dashboard Widgets**: KPI cards, activity feeds, quick actions
- [ ] **Content Editor**: Rich text editor with media support
- [ ] **User Management**: User cards, permission toggles, role selectors
- [ ] **Communication**: Chat interface, notification center
- [ ] **Reporting**: Export controls, data filters, custom reports

### Phase 4: Ecosystem Integration (Long-term)
- [ ] **Theme System**: Complete design token implementation
- [ ] **Component Documentation**: Storybook integration
- [ ] **Accessibility**: WCAG 2.1 AA compliance audit
- [ ] **Performance**: Component lazy loading, virtualization
- [ ] **Testing**: 100% component test coverage

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file.
