export const dynamic = 'force-dynamic';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { 
          authenticated: false, 
          message: 'Not authenticated' 
        }, 
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
        role: (session.user as any).role,
        image: session.user.image
      }
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        message: 'Internal server error' 
      }, 
      { status: 500 }
    );
  }
}