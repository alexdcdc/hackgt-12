import { NextRequest, NextResponse } from 'next/server';
import { getEngagementAnalytics } from '@/lib/email-agent';

export async function GET(request: NextRequest) {
  try {
    const analytics = await getEngagementAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error getting engagement analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
