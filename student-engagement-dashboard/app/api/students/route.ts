import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        sessions: {
          include: {
            session: {
              include: {
                class: true,
                topic: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        emails: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 3,
        },
        meetings: {
          orderBy: {
            scheduledFor: 'desc',
          },
          take: 3,
        },
      },
      take: limit,
    });

    // Calculate engagement metrics for each student
    const studentsWithMetrics = students.map(student => {
      const recentSessions = student.sessions.slice(0, 5);
      const avgEngagement = recentSessions.length > 0 
        ? recentSessions.reduce((sum, ss) => sum + ss.engagement, 0) / recentSessions.length
        : 0;
      
      const avgConfusion = recentSessions.length > 0
        ? recentSessions.reduce((sum, ss) => sum + ss.confusion, 0) / recentSessions.length
        : 0;

      const totalConfusionIncidents = recentSessions.reduce((sum, ss) => sum + ss.confusionIncidents, 0);

      return {
        ...student,
        overallEngagement: Math.round(avgEngagement),
        avgConfusion: Math.round(avgConfusion),
        totalConfusionIncidents,
        recentTopics: recentSessions.map(ss => ss.session.topic.name),
        subjects: [...new Set(recentSessions.map(ss => ss.session.class.subject))],
        lastActive: recentSessions[0]?.createdAt || student.createdAt,
        status: avgEngagement < 50 ? 'at-risk' : avgEngagement > 80 ? 'engaged' : 'moderate',
        trend: 'stable', // This would be calculated based on historical data
      };
    });

    return NextResponse.json({
      success: true,
      students: studentsWithMetrics,
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, avatar } = body;

    const student = await prisma.student.create({
      data: {
        name,
        email,
        avatar,
      },
    });

    return NextResponse.json({
      success: true,
      student,
    });

  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
