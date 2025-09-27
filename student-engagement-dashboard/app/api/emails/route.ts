import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (priority) where.priority = priority;

    const emails = await prisma.email.findMany({
      where,
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      emails,
    });

  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, type, subject, content, priority, scheduledFor } = body;

    const email = await prisma.email.create({
      data: {
        studentId,
        type,
        subject,
        content,
        priority,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json({
      success: true,
      email,
    });

  } catch (error) {
    console.error('Error creating email:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
