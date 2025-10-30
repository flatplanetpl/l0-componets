'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

interface NavItem {
  name: string;
  href: string;
}

interface NavigationProps {
  navItems: NavItem[];
  ctaText?: string;
}

const Navigation = ({ navItems = [], ctaText = "Sign in" }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default navigation items if none provided
  const defaultNavItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Courses", href: "/courses" },
    { name: "Brandbook", href: "/brandbook" },
    { name: "Contact", href: "/contact" }
  ];

  const effectiveNavItems = navItems.length > 0 ? navItems : defaultNavItems;

  return (
    <nav className="bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold text-foreground">EduPlatform</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {effectiveNavItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="text-muted-foreground hover:border-border hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {!mounted ? (
              <div className="ml-4 px-4 py-2 h-10 w-24 bg-blue-600 rounded-md animate-pulse" />
            ) : status === 'authenticated' ? (
              <a
                href="/admin/dashboard"
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Dashboard
              </a>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {ctaText}
              </button>
            )}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-muted-foreground hover:bg-muted focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {effectiveNavItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-muted-foreground hover:bg-muted/50 hover:border-border hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium"
              >
                {item.name}
              </a>
            ))}
            {!mounted ? (
              <div className="pl-3 pr-4 py-2 h-10 bg-muted/50 rounded-md animate-pulse" />
            ) : status === 'authenticated' ? (
              <a
                href="/admin/dashboard"
                className="text-muted-foreground hover:bg-muted/50 hover:border-border hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium"
              >
                Dashboard
              </a>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="text-muted-foreground hover:bg-muted/50 hover:border-border hover:text-foreground block pl-3 pr-4 py-2 text-base font-medium w-full text-left"
              >
                {ctaText}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
