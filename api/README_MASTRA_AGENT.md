# Mastra Engagement Agent

An intelligent agent that monitors student engagement metrics from the class-attendance database and automatically sends personalized emails when thresholds are exceeded.

## 🎯 Features

- **Database Integration**: Pulls data from existing `students`, `class_attendances`, and `class_sessions` tables
- **Smart Thresholds**: Configurable thresholds for engagement, disengagement, and confusion
- **Duplicate Prevention**: Checks `emails` table to prevent sending duplicate emails
- **Personalized Content**: Generates contextual email content based on specific metrics
- **SMTP Integration**: Sends emails via Gmail SMTP with your provided credentials
- **Database Logging**: Stores all sent emails in the `emails` table

## 📊 Database Schema

The agent works with your existing database structure:

- **`students`**: `id`, `fname`, `lname`, `email`
- **`class_attendances`**: `student_id`, `session_id`, `engaged_percentage`, `disengaged_percentage`, `confused_percentage`
- **`class_sessions`**: `id`, `duration`
- **`emails`**: `id`, `student_id`, `session_id`, `email`, `sent_at`

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Create a `.env` file:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### 3. Test the Agent
```bash
python test_mastra_agent.py
```

### 4. Run the API Server
```bash
uvicorn api:app --reload
```

## 📡 API Endpoints

### Process Engagement
```bash
POST /mastra/process-engagement
```
Triggers the Mastra agent to process all students and send emails as needed.

### Get Students with Issues
```bash
GET /mastra/students-with-issues
```
Returns a list of students whose metrics fall below thresholds.

### Send Test Email
```bash
POST /mastra/send-test-email?student_id=123&session_id=456
```
Sends a test email to a specific student.

## 🔧 Configuration

### Thresholds
The agent triggers emails when:
- **Engagement** < 50% (low engagement)
- **Disengagement** > 70% (high disengagement)
- **Confusion** > 60% (high confusion)

### SMTP Settings
```python
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "p19195138@gmail.com"
SMTP_FROM = "noreply@example.com"
SMTP_PASS = "gatp lntf fbcf agaq"
```

## 📧 Email Templates

The agent generates personalized emails based on the specific issue:

### Low Engagement
- Encourages participation and offers support
- Suggests asking questions and taking notes
- Offers additional resources

### High Disengagement
- Addresses potential boredom or difficulty
- Suggests active participation
- Offers one-on-one meetings

### High Confusion
- Offers additional help and resources
- Suggests office hours and study groups
- Encourages asking questions

## 🛡️ Safety Features

- **Duplicate Prevention**: Checks `emails` table before sending
- **Error Handling**: Graceful handling of SMTP and database errors
- **Logging**: Comprehensive logging of all operations
- **Validation**: Validates student data before processing

## 📈 Usage Examples

### Process All Students
```python
from mastra_agent import MastraEngagementAgent

agent = MastraEngagementAgent()
result = agent.process_engagement_and_send_emails()
print(f"Processed {result['processed']} students")
print(f"Sent {result['emails_sent']} emails")
```

### Check Specific Students
```python
agent = MastraEngagementAgent()
students = agent.get_students_with_engagement_issues()
for student in students:
    print(f"{student['first_name']}: {student['engaged_percentage']:.1f}% engaged")
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify Supabase URL and key are correct
   - Check if Supabase project is active

2. **SMTP Authentication Failed**
   - Check Gmail app password is correct
   - Ensure 2FA is enabled on Gmail account

3. **No Students Found**
   - Ensure data exists in `class_attendances` table
   - Check if thresholds are too strict

### Debug Mode
Set environment variable for detailed logging:
```bash
export DEBUG=1
python test_mastra_agent.py
```

## 📝 Logs

The agent provides detailed logging:
- ✅ Successful operations
- ❌ Errors and failures
- ⏭️ Skipped operations (duplicates)
- 📊 Processing statistics

## 🎉 Success!

Your Mastra engagement agent is now ready to monitor student engagement and send personalized emails automatically!
