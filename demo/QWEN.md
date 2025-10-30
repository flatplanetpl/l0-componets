# Qwen Code Context File - EduPlatform Admin Dashboard

## Project Overview

This is the EduPlatform Admin Dashboard demo, a comprehensive admin interface for an e-learning platform built with Next.js 14, TypeScript, and Tailwind CSS. It demonstrates a full-featured admin panel with role-based access control (RBAC) and advanced administrative capabilities.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Google OAuth authentication
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **ShadCN UI** - Component library

### Authentication & Authorization
- **NextAuth.js** - Authentication provider
- **Google OAuth** - Social login
- **Role-Based Access Control (RBAC)** - Three-tier role system:
  - **User**: Basic access to dashboard and courses
  - **Operator**: Access to content management and reports
  - **Admin**: Full access to all administrative features

## Project Structure

```
demo/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   │   ├── dashboard/     # Dashboard overview
│   │   ├── users/         # User management
│   │   ├── courses/       # Course management
│   │   ├── finance/       # Financial reports
│   │   ├── content/       # Content management
│   │   ├── reports/       # Analytics reports
│   │   ├── analytics/     # Advanced analytics
│   │   ├── backup/        # Backup and restore
│   │   ├── monitoring/    # Performance monitoring
│   │   ├── settings/      # Account settings
│   │   └── layout.tsx     # Admin layout wrapper
│   ├── api/               # API routes
│   │   └── auth/          # Authentication routes
│   ├── signin/            # Sign in page
│   ├── signout/           # Sign out page
│   ├── page.tsx           # Public home page
│   └── layout.tsx         # Main layout
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── general/           # General UI components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configs
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── config/                # Application configuration
├── public/                # Static assets
└── ...
```

## Admin Dashboard Sections

### 1. Dashboard
Main overview with:
- Key performance metrics (users, courses, revenue, completion rate)
- Interactive charts (user growth, revenue trends)
- Recent activity feed
- Quick action buttons

### 2. Users Management
- List, filter, and manage platform users
- Role-based access control
- User profile viewing and editing
- Bulk actions (activate/deactivate/delete)

### 3. Courses Management
- Course catalog with categories
- Instructor management
- Student enrollment tracking
- Course creation/editing

### 4. Finance Management
- Revenue tracking and reporting
- Transaction history
- Financial analytics
- Payment processing

### 5. Content Management
- Educational material management
- Content categorization
- Publishing workflows
- Version control

### 6. Reports
- Custom report generation
- Data export capabilities
- Scheduled reporting
- Report templates

### 7. Analytics
- Advanced data analysis
- User behavior tracking
- Course performance metrics
- Conversion funnel analysis

### 8. Backup
- Automated backup scheduling
- Manual backup creation
- Backup restoration
- Storage management

### 9. Monitoring
- System performance tracking
- Real-time metrics
- Alert notifications
- Health checks

### 10. Settings
- Account configuration
- Security settings
- Notification preferences
- Billing information
- Privacy controls

## Authentication Flow

1. Users visit the public homepage at `/`
2. Click "Sign in" to authenticate with Google OAuth
3. First user with email matching `ADMIN_EMAIL` gets admin role
4. Other users get default "user" role
5. After authentication, users are redirected to `/admin/dashboard`
6. Navigation menu adapts based on user role
7. Protected routes enforce role-based access control

## Role-Based Access Control (RBAC)

### User Roles
- **User**: Basic access to dashboard and courses
- **Operator**: Access to content management and reports
- **Admin**: Full access to all administrative features

### Role Hierarchy
```
User (lowest) → Operator → Admin (highest)
```

Each role inherits permissions from lower roles plus additional privileges.

### Navigation Access
- **Dashboard**: All roles
- **Users**: Admin only
- **Courses**: All roles
- **Finance**: Admin only
- **Content**: Operator and Admin
- **Reports**: Operator and Admin
- **Analytics**: Admin only
- **Backup**: Admin only
- **Monitoring**: Admin only
- **Settings**: All roles

## UI Components

### General Components
- **Navigation**: Responsive navbar with mobile menu
- **Hero**: Landing page hero section
- **Stats**: Statistics cards with trend indicators
- **Features**: Feature showcase with icons
- **TestimonialSlider**: Customer testimonials carousel
- **CourseCard**: Course preview cards
- **CTA**: Call-to-action section

### Admin Components
- **AdminLayout**: Dashboard layout with sidebar
- **DataTable**: Reusable data table with sorting/filtering
- **AdminForm**: Dynamic form generator
- **DashboardWidgets**: Dashboard statistics widgets
- **UserChart**: User engagement visualization
- **RecentActivity**: Activity feed component
- **ProtectedRoute**: Role-based route protection

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Google OAuth credentials

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
ADMIN_EMAIL=admin@example.com
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`

### Development
```bash
npm run dev
```

Application will be available at http://localhost:3000

## Deployment

### Docker
```bash
docker-compose up --build
```

### Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

## Testing
```bash
npm test
```

## Key Features Implemented

✅ Google OAuth authentication
✅ Role-based access control (RBAC)
✅ Responsive admin dashboard
✅ Interactive data visualization
✅ Reusable UI components
✅ Protected routes with authorization
✅ Mock data for demonstration
✅ Docker containerization
✅ Environment-based configuration
✅ Component-based architecture

## Future Improvements

- Integration with real backend API
- Database connectivity
- Advanced reporting features
- Notification system
- Internationalization (i18n)
- Dark mode support
- Mobile app companion
- Advanced analytics with machine learning