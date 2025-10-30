import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Simple health check
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'EduPlatform Admin Dashboard'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Health check failed' 
      }, 
      { status: 500 }
    );
  }
}