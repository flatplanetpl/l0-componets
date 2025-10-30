'use client';

import { useState } from 'react';
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

const Navigation = ({ navItems, ctaText = "Sign in" }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Your Brand</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <a 
                href="/dashboard" 
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
              className="ml-4 md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
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
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
              >
                {item.name}
              </a>
            ))}
            {status === 'authenticated' ? (
              <a 
                href="/dashboard" 
                className="text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium"
              >
                Dashboard
              </a>
            ) : (
              <button 
                onClick={() => signIn('google')} 
                className="text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 text-base font-medium w-full text-left"
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