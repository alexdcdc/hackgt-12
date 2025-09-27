import { NextRequest, NextResponse } from 'next/server';
import { processStudentEngagement, processSessionEngagement } from '@/lib/email-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, sessionId, processAll } = body;

    if (processAll && sessionId) {
      // Process all students in a session
      const result = await processSessionEngagement(sessionId);
      return NextResponse.json(result);
    } else if (studentId && sessionId) {
      // Process specific student
      const result = await processStudentEngagement(studentId, sessionId);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing engagement:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
