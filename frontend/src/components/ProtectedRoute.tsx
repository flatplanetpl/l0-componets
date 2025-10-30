'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'operator' | 'admin';
  fallback?: ReactNode;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole = 'user',
  fallback = <div>Access denied</div>
}: ProtectedRouteProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null; // Redirect effect will handle this
  }

  // Check role-based access
  const userRole = (session?.user as any)?.role || 'user';
  const roleHierarchy: Record<string, number> = { user: 1, operator: 2, admin: 3 };
  
  if (roleHierarchy[userRole] < roleHierarchy[requiredRole]) {
    return fallback;
  }

  // If all checks pass, render the children
  return <>{children}</>;
};