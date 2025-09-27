export const EMAIL_TEMPLATES = {
  AT_RISK_ALERT: {
    id: 'at-risk-alert',
    name: 'At-Risk Student Alert',
    category: 'Meeting Request',
    type: 'AT_RISK_ALERT',
    subject: "Let's Schedule a Check-in - {studentName}",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb;">Academic Support Check-in</h2>
  
  <p>Hi {studentName},</p>
  
  <p>I hope you're doing well! I've noticed that you might be facing some challenges in our recent <strong>{subject}</strong> sessions, particularly with <strong>{topic}</strong>.</p>
  
  <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500;">Your current engagement level: <strong>{engagement}%</strong></p>
  </div>
  
  <p>I want to make sure you have all the support you need to succeed. I'd love to schedule a one-on-one meeting with you to discuss:</p>
  
  <ul style="color: #374151;">
    <li>Any specific concepts you're finding challenging</li>
    <li>Study strategies that might work better for you</li>
    <li>Resources that could help you stay engaged</li>
  </ul>
  
  <p>Would you be available for a 30-minute meeting this week? I have several time slots available, and we can also find a time that works better for your schedule.</p>
  
  <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-style: italic; color: #1e40af;">
      Remember, asking for help is a sign of strength, not weakness. I'm here to support your learning journey!
    </p>
  </div>
  
  <p>Best regards,<br>Your Instructor</p>
</div>
    `,
    variables: ['studentName', 'subject', 'topic', 'engagement'],
    usage: 0,
    lastUsed: null,
  },
  
  CONFUSION_ALERT: {
    id: 'confusion-alert',
    name: 'Confusion Alert & Resources',
    category: 'Academic Support',
    type: 'CONFUSION_ALERT',
    subject: "Additional Resources for {topic} - {studentName}",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #7c3aed;">Topic Support Resources</h2>
  
  <p>Hi {studentName},</p>
  
  <p>I noticed that you might be experiencing some confusion with our recent <strong>{topic}</strong> material in <strong>{subject}</strong>. This is completely normal - these concepts can be challenging!</p>
  
  <div style="background-color: #faf5ff; padding: 15px; border-left: 4px solid #7c3aed; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500;">Confusion level detected: <strong>{confusion}%</strong></p>
  </div>
  
  <p>I've prepared some additional resources that might help clarify things:</p>
  
  <ul style="color: #374151;">
    <li>Extra practice problems with step-by-step solutions</li>
    <li>Video explanations of the key concepts</li>
    <li>A study guide specifically for this topic</li>
    <li>Office hours this week for Q&A</li>
  </ul>
  
  <p>I'll also be holding an extra office hour session this week where we can go through any questions you have. <strong>No question is too small!</strong></p>
  
  <p>If you'd like to schedule a one-on-one session to work through specific problems, just let me know. I'm here to help you succeed.</p>
  
  <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-style: italic; color: #166534;">
      Keep up the great work - persistence is key to mastering these concepts!
    </p>
  </div>
  
  <p>Best regards,<br>Your Instructor</p>
</div>
    `,
    variables: ['studentName', 'subject', 'topic', 'confusion'],
    usage: 0,
    lastUsed: null,
  },
  
  ENCOURAGEMENT: {
    id: 'encouragement',
    name: 'Positive Reinforcement',
    category: 'Encouragement',
    type: 'ENCOURAGEMENT',
    subject: "Great Progress, {studentName}!",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #059669;">Excellent Progress Update</h2>
  
  <p>Hi {studentName},</p>
  
  <p>I wanted to take a moment to acknowledge the excellent progress you've been making in <strong>{subject}</strong>!</p>
  
  <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #059669; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500;">Your engagement has improved to: <strong>{engagement}%</strong></p>
    <p style="margin: 5px 0 0 0; font-size: 14px; color: #166534;">That's a {improvement}% improvement from last week!</p>
  </div>
  
  <p>I can see you're really putting in the effort to understand the material. This kind of dedication and improvement is exactly what I love to see as an instructor.</p>
  
  <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500; color: #92400e;">
      🎉 Keep up the fantastic work! Your hard work is paying off.
    </p>
  </div>
  
  <p>If you ever need any additional support or have questions, don't hesitate to reach out.</p>
  
  <p>Best regards,<br>Your Instructor</p>
</div>
    `,
    variables: ['studentName', 'subject', 'engagement', 'improvement'],
    usage: 0,
    lastUsed: null,
  },
  
  MEETING_REQUEST: {
    id: 'meeting-request',
    name: 'Academic Support Meeting',
    category: 'Meeting Request',
    type: 'MEETING_REQUEST',
    subject: "Meeting Request - Academic Support - {studentName}",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #dc2626;">Academic Support Meeting</h2>
  
  <p>Hi {studentName},</p>
  
  <p>I hope this email finds you well. I'd like to schedule a brief meeting with you to discuss your progress in <strong>{subject}</strong>.</p>
  
  <div style="background-color: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500;">Recent performance in {topic}:</p>
    <ul style="margin: 10px 0 0 0; color: #374151;">
      <li>Engagement: {engagement}%</li>
      <li>Confusion incidents: {confusionIncidents}</li>
    </ul>
  </div>
  
  <p>Based on your recent performance, I believe we could benefit from a one-on-one conversation to:</p>
  
  <ul style="color: #374151;">
    <li>Review any challenging concepts</li>
    <li>Discuss study strategies that might work better for you</li>
    <li>Address any concerns you might have</li>
    <li>Set up a plan for continued success</li>
  </ul>
  
  <p>I have several time slots available this week. Please let me know what works best for your schedule, and I'll do my best to accommodate.</p>
  
  <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-style: italic; color: #1e40af;">
      This meeting is completely confidential and is designed to support your learning journey. I'm here to help you succeed!
    </p>
  </div>
  
  <p>Best regards,<br>Your Instructor</p>
</div>
    `,
    variables: ['studentName', 'subject', 'topic', 'engagement', 'confusionIncidents'],
    usage: 0,
    lastUsed: null,
  },
  
  SESSION_REMINDER: {
    id: 'session-reminder',
    name: 'Session Reminder',
    category: 'Reminder',
    type: 'REMINDER',
    subject: "Upcoming Session Reminder - {subject}",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2563eb;">Session Reminder</h2>
  
  <p>Hi {studentName},</p>
  
  <p>This is a friendly reminder that you have an upcoming <strong>{subject}</strong> session:</p>
  
  <div style="background-color: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0; font-weight: 500;">📅 {date} at {time}</p>
    <p style="margin: 5px 0 0 0; color: #64748b;">Topic: {topic}</p>
  </div>
  
  <p>Please review the materials we discussed previously and come prepared with any questions you might have.</p>
  
  <p>Looking forward to seeing you there!</p>
  
  <p>Best regards,<br>Your Instructor</p>
</div>
    `,
    variables: ['studentName', 'subject', 'date', 'time', 'topic'],
    usage: 0,
    lastUsed: null,
  },
};

export function getTemplateById(id: string) {
  return Object.values(EMAIL_TEMPLATES).find(template => template.id === id);
}

export function getTemplatesByCategory(category: string) {
  return Object.values(EMAIL_TEMPLATES).filter(template => template.category === category);
}

export function getTemplateByType(type: string) {
  return Object.values(EMAIL_TEMPLATES).find(template => template.type === type);
}

export function replaceTemplateVariables(template: any, variables: Record<string, string | number>) {
  let content = template.content;
  let subject = template.subject;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    content = content.replace(regex, String(value));
    subject = subject.replace(regex, String(value));
  });
  
  return { content, subject };
}
