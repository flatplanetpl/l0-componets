'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, CreditCard, FileText, Settings, BarChart3, Eye, DollarSign, Database, Activity, AlertTriangle } from 'lucide-react';
import { useSession } from 'next-auth/react';

// Define role types
export type UserRole = 'user' | 'operator' | 'admin';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3, roles: ['user', 'operator', 'admin'] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen, roles: ['user', 'operator', 'admin'] },
  { name: 'Finance', href: '/admin/finance', icon: CreditCard, roles: ['admin'] },
  { name: 'Content', href: '/admin/content', icon: FileText, roles: ['operator', 'admin'] },
  { name: 'Reports', href: '/admin/reports', icon: Eye, roles: ['operator', 'admin'] },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['admin'] },
  { name: 'Backup', href: '/admin/backup', icon: Database, roles: ['admin'] },
  { name: 'Monitoring', href: '/admin/monitoring', icon: Activity, roles: ['admin'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['user', 'operator', 'admin'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">EduPlatform Admin</h1>
        </div>
        <div className="p-4 flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">EduPlatform Admin</h1>
        </div>
        <div className="p-4 flex-1">
          <p>Please sign in to access the dashboard</p>
        </div>
      </div>
    );
  }

  // Get user role from session (default to 'user' if not set)
  const userRole: UserRole = (session.user as any)?.role || 'user';

  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">EduPlatform Admin</h1>
        <div className="mt-2 text-sm">
          <p className="text-gray-600">Welcome, {session.user?.name || session.user?.email}</p>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
            userRole === 'admin' ? 'bg-red-100 text-red-800' :
            userRole === 'operator' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">EduPlatform Admin v1.0</p>
          <button 
            onClick={() => { window.location.href = '/api/auth/signout'; }} 
            className="text-xs text-red-500 hover:text-red-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}