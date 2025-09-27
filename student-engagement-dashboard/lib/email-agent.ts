import { Mastra } from '@mastra/core';
import { PrismaClient } from '@/lib/generated/prisma';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Initialize Mastra
const mastra = new Mastra({
  name: 'student-engagement-email-agent',
  instructions: `You are an AI agent that monitors student engagement metrics and sends personalized emails to students when their engagement, distractedness, confusion, or boredom levels fall below certain thresholds. 

Your responsibilities:
1. Analyze student engagement data from class sessions
2. Identify students who need intervention based on configurable thresholds
3. Send context-appropriate emails (meeting requests, encouragement, reminders)
4. Schedule follow-up meetings when necessary
5. Track email effectiveness and student responses

Always be supportive, professional, and personalized in your communications.`,
});

// Define engagement thresholds
const ENGAGEMENT_THRESHOLDS = {
  engagement: 50,      // Below 50% engagement triggers action
  distractedness: 70,  // Above 70% distractedness triggers action
  confusion: 60,       // Above 60% confusion triggers action
  boredom: 80,         // Above 80% boredom triggers action
};

// Email templates
const EMAIL_TEMPLATES = {
  AT_RISK_ALERT: {
    subject: "Let's Schedule a Check-in - {studentName}",
    content: `
Hi {studentName},

I hope you're doing well! I've noticed that you might be facing some challenges in our recent {subject} sessions, particularly with {topic}. 

Your engagement level has been at {engagement}%, and I want to make sure you have all the support you need to succeed.

I'd love to schedule a one-on-one meeting with you to discuss:
- Any specific concepts you're finding challenging
- Study strategies that might work better for you
- Resources that could help you stay engaged

Would you be available for a 30-minute meeting this week? I have several time slots available, and we can also find a time that works better for your schedule.

Remember, asking for help is a sign of strength, not weakness. I'm here to support your learning journey!

Best regards,
Your Instructor
    `,
  },
  CONFUSION_ALERT: {
    subject: "Additional Resources for {topic} - {studentName}",
    content: `
Hi {studentName},

I noticed that you might be experiencing some confusion with our recent {topic} material in {subject}. This is completely normal - these concepts can be challenging!

I've prepared some additional resources that might help clarify things:
- Extra practice problems with step-by-step solutions
- Video explanations of the key concepts
- A study guide specifically for this topic

I'll also be holding an extra office hour session this week where we can go through any questions you have. No question is too small!

If you'd like to schedule a one-on-one session to work through specific problems, just let me know. I'm here to help you succeed.

Keep up the great work - persistence is key to mastering these concepts!

Best regards,
Your Instructor
    `,
  },
  ENCOURAGEMENT: {
    subject: "Great Progress, {studentName}!",
    content: `
Hi {studentName},

I wanted to take a moment to acknowledge the excellent progress you've been making in {subject}! 

Your engagement has improved significantly to {engagement}%, and I can see you're really putting in the effort to understand the material. This kind of dedication and improvement is exactly what I love to see as an instructor.

Keep up the fantastic work! If you ever need any additional support or have questions, don't hesitate to reach out.

Best regards,
Your Instructor
    `,
  },
  MEETING_REQUEST: {
    subject: "Meeting Request - Academic Support - {studentName}",
    content: `
Hi {studentName},

I hope this email finds you well. I'd like to schedule a brief meeting with you to discuss your progress in {subject}.

Based on your recent performance in our {topic} sessions, I believe we could benefit from a one-on-one conversation to:
- Review any challenging concepts
- Discuss study strategies that might work better for you
- Address any concerns you might have
- Set up a plan for continued success

I have several time slots available this week. Please let me know what works best for your schedule, and I'll do my best to accommodate.

This meeting is completely confidential and is designed to support your learning journey. I'm here to help you succeed!

Best regards,
Your Instructor
    `,
  },
};

// Function to check if student meets threshold criteria
async function checkEngagementThresholds(studentId: string, sessionId: string) {
  const studentSession = await prisma.studentSession.findFirst({
    where: {
      studentId,
      sessionId,
    },
    include: {
      student: true,
      session: {
        include: {
          class: true,
          topic: true,
        },
      },
    },
  });

  if (!studentSession) return null;

  const { engagement, distractedness, confusion, boredom } = studentSession;
  const triggers = [];

  if (engagement < ENGAGEMENT_THRESHOLDS.engagement) {
    triggers.push({
      metric: 'engagement',
      value: engagement,
      threshold: ENGAGEMENT_THRESHOLDS.engagement,
      severity: 'high',
    });
  }

  if (distractedness > ENGAGEMENT_THRESHOLDS.distractedness) {
    triggers.push({
      metric: 'distractedness',
      value: distractedness,
      threshold: ENGAGEMENT_THRESHOLDS.distractedness,
      severity: 'medium',
    });
  }

  if (confusion > ENGAGEMENT_THRESHOLDS.confusion) {
    triggers.push({
      metric: 'confusion',
      value: confusion,
      threshold: ENGAGEMENT_THRESHOLDS.confusion,
      severity: 'high',
    });
  }

  if (boredom > ENGAGEMENT_THRESHOLDS.boredom) {
    triggers.push({
      metric: 'boredom',
      value: boredom,
      threshold: ENGAGEMENT_THRESHOLDS.boredom,
      severity: 'medium',
    });
  }

  return {
    studentSession,
    triggers,
  };
}

// Function to determine email type and priority based on triggers
function determineEmailAction(triggers: any[]) {
  const hasHighSeverity = triggers.some(t => t.severity === 'high');
  const hasConfusion = triggers.some(t => t.metric === 'confusion');
  const hasLowEngagement = triggers.some(t => t.metric === 'engagement');

  if (hasHighSeverity && hasLowEngagement) {
    return {
      type: 'AT_RISK_ALERT',
      priority: 'HIGH',
      requiresMeeting: true,
    };
  }

  if (hasConfusion) {
    return {
      type: 'CONFUSION_ALERT',
      priority: 'HIGH',
      requiresMeeting: false,
    };
  }

  if (hasLowEngagement) {
    return {
      type: 'MEETING_REQUEST',
      priority: 'MEDIUM',
      requiresMeeting: true,
    };
  }

  return {
    type: 'ENCOURAGEMENT',
    priority: 'LOW',
    requiresMeeting: false,
  };
}

// Function to send email
async function sendEmail(
  student: any,
  emailType: string,
  subject: string,
  content: string,
  priority: string
) {
  try {
    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@university.edu',
      to: student.email,
      subject,
      html: content,
    });

    // Save email record to database
    await prisma.email.create({
      data: {
        studentId: student.id,
        type: emailType as any,
        subject,
        content,
        status: 'SENT',
        priority: priority as any,
        sentAt: new Date(),
      },
    });

    console.log(`Email sent successfully to ${student.email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Save failed email record
    await prisma.email.create({
      data: {
        studentId: student.id,
        type: emailType as any,
        subject,
        content,
        status: 'FAILED',
        priority: priority as any,
      },
    });

    return false;
  }
}

// Function to schedule meeting
async function scheduleMeeting(studentId: string, title: string, description: string) {
  const meetingDate = new Date();
  meetingDate.setDate(meetingDate.getDate() + 3); // Schedule for 3 days from now

  return await prisma.meeting.create({
    data: {
      studentId,
      title,
      description,
      scheduledFor: meetingDate,
      status: 'SCHEDULED',
    },
  });
}

// Main agent function to process student engagement
export async function processStudentEngagement(studentId: string, sessionId: string) {
  try {
    const result = await checkEngagementThresholds(studentId, sessionId);
    
    if (!result || result.triggers.length === 0) {
      console.log(`No engagement issues found for student ${studentId}`);
      return { success: true, action: 'none' };
    }

    const { studentSession, triggers } = result;
    const { student, session } = studentSession;
    
    const emailAction = determineEmailAction(triggers);
    const template = EMAIL_TEMPLATES[emailAction.type as keyof typeof EMAIL_TEMPLATES];
    
    // Replace template variables
    const subject = template.subject
      .replace('{studentName}', student.name)
      .replace('{subject}', session.class.subject)
      .replace('{topic}', session.topic.name);
    
    const content = template.content
      .replace(/{studentName}/g, student.name)
      .replace(/{subject}/g, session.class.subject)
      .replace(/{topic}/g, session.topic.name)
      .replace(/{engagement}/g, studentSession.engagement.toString());

    // Send email
    const emailSent = await sendEmail(
      student,
      emailAction.type,
      subject,
      content,
      emailAction.priority
    );

    // Schedule meeting if required
    let meeting = null;
    if (emailAction.requiresMeeting) {
      meeting = await scheduleMeeting(
        studentId,
        `Academic Support Meeting - ${session.class.subject}`,
        `Follow-up meeting to discuss engagement and provide additional support for ${session.topic.name}`
      );
    }

    return {
      success: emailSent,
      action: emailAction.type,
      meetingScheduled: !!meeting,
      triggers,
    };

  } catch (error) {
    console.error('Error processing student engagement:', error);
    return { success: false, error: error.message };
  }
}

// Function to process all students for a session
export async function processSessionEngagement(sessionId: string) {
  try {
    const studentSessions = await prisma.studentSession.findMany({
      where: { sessionId },
      include: {
        student: true,
        session: {
          include: {
            class: true,
            topic: true,
          },
        },
      },
    });

    const results = [];
    
    for (const studentSession of studentSessions) {
      const result = await processStudentEngagement(
        studentSession.studentId,
        studentSession.sessionId
      );
      results.push({
        studentId: studentSession.studentId,
        studentName: studentSession.student.name,
        ...result,
      });
    }

    return {
      success: true,
      processed: results.length,
      results,
    };

  } catch (error) {
    console.error('Error processing session engagement:', error);
    return { success: false, error: error.message };
  }
}

// Function to get engagement analytics
export async function getEngagementAnalytics() {
  try {
    const stats = await prisma.studentSession.aggregate({
      _avg: {
        engagement: true,
        distractedness: true,
        confusion: true,
        boredom: true,
      },
      _count: {
        id: true,
      },
    });

    const atRiskStudents = await prisma.studentSession.findMany({
      where: {
        OR: [
          { engagement: { lt: ENGAGEMENT_THRESHOLDS.engagement } },
          { confusion: { gt: ENGAGEMENT_THRESHOLDS.confusion } },
          { boredom: { gt: ENGAGEMENT_THRESHOLDS.boredom } },
        ],
      },
      include: {
        student: true,
        session: {
          include: {
            class: true,
            topic: true,
          },
        },
      },
      orderBy: {
        engagement: 'asc',
      },
      take: 10,
    });

    return {
      averageEngagement: stats._avg.engagement,
      averageDistractedness: stats._avg.distractedness,
      averageConfusion: stats._avg.confusion,
      averageBoredom: stats._avg.boredom,
      totalSessions: stats._count.id,
      atRiskStudents: atRiskStudents.map(ss => ({
        id: ss.student.id,
        name: ss.student.name,
        email: ss.student.email,
        engagement: ss.engagement,
        confusion: ss.confusion,
        boredom: ss.boredom,
        subject: ss.session.class.subject,
        topic: ss.session.topic.name,
      })),
    };

  } catch (error) {
    console.error('Error getting engagement analytics:', error);
    return { success: false, error: error.message };
  }
}

export default mastra;
