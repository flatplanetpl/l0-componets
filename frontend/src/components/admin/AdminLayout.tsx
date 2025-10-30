'use client';

import { ReactNode } from 'react';
import { Users, BarChart3, Settings, FileText, CreditCard, BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
}

interface AdminLayoutProps {
  children: ReactNode;
  navItems?: NavItem[];
  title: string;
}

const defaultNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3, roles: ['user', 'operator', 'admin'] },
  { name: 'Users', href: '/admin/users', icon: Users, roles: ['admin'] },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen, roles: ['user', 'operator', 'admin'] },
  { name: 'Finance', href: '/admin/finance', icon: CreditCard, roles: ['admin'] },
  { name: 'Content', href: '/admin/content', icon: FileText, roles: ['operator', 'admin'] },
  { name: 'Settings', href: '/admin/settings', icon: Settings, roles: ['user', 'operator', 'admin'] },
];

export default function AdminLayout({ children, navItems = defaultNavItems, title }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (status === 'unauthenticated') {
    return <div className="min-h-screen flex items-center justify-center">Please sign in</div>;
  }

  // Filter navigation items based on user role
  const userRole = (session?.user as any)?.role || 'user';
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole) || item.roles.includes('admin')
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="mt-2 text-sm">
            <p className="text-gray-600">Welcome, {session?.user?.name || session?.user?.email}</p>
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
              const isActive = window.location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      isActive 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <p className="text-xs text-gray-500">Admin Panel v1.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
}