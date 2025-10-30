# EduPlatform Admin Dashboard Demo

A comprehensive admin dashboard for an e-learning platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Authentication & Authorization
- Google OAuth authentication with NextAuth.js
- Role-based access control (RBAC) with three roles:
  - **User**: Basic access to dashboard and courses
  - **Operator**: Access to content management and reports
  - **Admin**: Full access to all features including users, finance, backup, and settings

### Dashboard Components
- **Statistics Cards**: Key metrics with trend indicators
- **Interactive Charts**: Recharts for data visualization
- **Data Tables**: Sortable and filterable tables with actions
- **Form Components**: Reusable form elements with validation
- **Navigation**: Responsive sidebar with role-based menu items

### Admin Sections
1. **Dashboard** - Overview with key metrics and charts
2. **Users** - User management with CRUD operations
3. **Courses** - Course management with enrollment tracking
4. **Finance** - Financial reports and transaction tracking
5. **Content** - Educational content management
6. **Reports** - Analytics and reporting tools
7. **Analytics** - Advanced data analysis and insights
8. **Backup** - Backup and restore functionality
9. **Monitoring** - Performance monitoring and alerts
10. **Settings** - Account and platform configuration

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Google OAuth credentials (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd edu-platform-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-in-production
   
   # Google OAuth Credentials
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Admin Email (first user with this email gets admin role)
   ADMIN_EMAIL=admin@example.com
   
   # Backend API (if using separate backend)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. To get Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`

### Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to:
   - Public site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin/dashboard (after signing in)

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## 📁 Project Structure

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
│   ├── ui/                # Reusable UI components
│   └── ...
├── lib/                   # Utility functions and configs
│   └── auth.ts            # NextAuth configuration
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── config/                # Application configuration
├── public/                # Static assets
└── ...
```

## 🔐 Authentication Flow

1. Users visit the public homepage at `/`
2. Clicking "Sign in" redirects to `/signin`
3. Users authenticate with Google OAuth
4. First user with email matching `ADMIN_EMAIL` gets admin role
5. Other users get default "user" role
6. After authentication, users are redirected to `/admin/dashboard`
7. Navigation menu adapts based on user role
8. Protected routes enforce role-based access control

## 🎨 UI Components

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
- **DashboardStats**: Dashboard statistics widgets
- **UserChart**: User engagement visualization
- **RecentActivity**: Activity feed component
- **ProtectedRoute**: Role-based route protection

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📦 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Docker
```bash
# Build the image
docker build -t edu-platform-demo .

# Run the container
docker run -p 3000:3000 edu-platform-demo
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.