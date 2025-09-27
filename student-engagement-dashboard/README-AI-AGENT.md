# AI Email Agent for Student Engagement

This project includes a Mastra-powered AI agent that automatically monitors student engagement metrics and sends personalized emails when students fall below certain thresholds.

## Features

- **Automated Engagement Monitoring**: Tracks student engagement, distractedness, confusion, and boredom levels
- **Intelligent Email Triggers**: Sends context-appropriate emails based on configurable thresholds
- **Meeting Scheduling**: Automatically schedules follow-up meetings for at-risk students
- **Email Templates**: Pre-built templates for different engagement scenarios
- **Real-time Analytics**: Dashboard showing engagement metrics and agent performance

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/student_engagement"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@university.edu"

# Mastra Configuration
MASTRA_API_KEY="your-mastra-api-key"
```

### 2. Database Setup

1. Set up a PostgreSQL database
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

### 3. Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password for this application
3. Use the App Password as `SMTP_PASS`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

```bash
npm run dev
```

## AI Agent Configuration

### Engagement Thresholds

The agent monitors the following metrics and triggers actions when thresholds are exceeded:

- **Engagement**: Below 50% triggers at-risk alert
- **Distractedness**: Above 70% triggers action
- **Confusion**: Above 60% triggers confusion alert
- **Boredom**: Above 80% triggers action

### Email Types

1. **At-Risk Alert**: Sent when engagement is low
2. **Confusion Alert**: Sent when confusion levels are high
3. **Encouragement**: Sent when engagement improves
4. **Meeting Request**: Sent to schedule follow-up meetings
5. **Session Reminder**: Sent for upcoming sessions

## API Endpoints

### Process Engagement
```
POST /api/engagement/process
{
  "studentId": "student-id",
  "sessionId": "session-id",
  "processAll": true
}
```

### Get Analytics
```
GET /api/engagement/analytics
```

### Get Students
```
GET /api/students?status=at-risk&limit=50
```

### Get Emails
```
GET /api/emails?status=sent&type=AT_RISK_ALERT
```

## Usage

1. **Start the AI Agent**: Toggle the agent switch in the Email Center
2. **Process Students**: Click "Process All Students" to analyze current engagement
3. **Monitor Results**: View sent emails and scheduled meetings in the dashboard
4. **Adjust Thresholds**: Configure engagement thresholds as needed

## Customization

### Email Templates

Edit templates in `lib/email-templates.ts`:
- Modify subject lines and content
- Add new template variables
- Create custom email types

### Thresholds

Adjust thresholds in `lib/email-agent.ts`:
```typescript
const ENGAGEMENT_THRESHOLDS = {
  engagement: 50,      // Below 50% engagement triggers action
  distractedness: 70,  // Above 70% distractedness triggers action
  confusion: 60,       // Above 60% confusion triggers action
  boredom: 80,         // Above 80% boredom triggers action
};
```

## Troubleshooting

### Common Issues

1. **Email not sending**: Check SMTP credentials and firewall settings
2. **Database errors**: Ensure PostgreSQL is running and DATABASE_URL is correct
3. **Agent not processing**: Check Mastra API key and network connectivity

### Logs

Check the console for detailed error messages and processing logs.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
