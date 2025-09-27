import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Send, Clock, CheckCircle, AlertCircle, Calendar, Filter, Bot, Play } from "lucide-react"
import { useState, useEffect } from "react"

const emailQueue = [
  {
    id: 1,
    student: "Alex Chen",
    email: "alex.chen@university.edu",
    avatar: "/asian-student-studying.png",
    type: "meeting-request",
    priority: "high",
    status: "pending",
    scheduledFor: "2024-01-16 09:00",
    subject: "Follow-up Meeting - Physics Concepts",
    reason: "Low engagement in Quantum Mechanics (45%)",
    template: "At-Risk Student Meeting",
  },
  {
    id: 2,
    student: "Mike Rodriguez",
    email: "m.rodriguez@university.edu",
    avatar: "/male-student-studying.png",
    type: "meeting-request",
    priority: "high",
    status: "sent",
    scheduledFor: "2024-01-15 14:30",
    subject: "Academic Support Meeting",
    reason: "Multiple confusion incidents in Math",
    template: "At-Risk Student Meeting",
  },
  {
    id: 3,
    student: "Sarah Johnson",
    email: "sarah.j@university.edu",
    avatar: "/diverse-female-student.png",
    type: "encouragement",
    priority: "medium",
    status: "scheduled",
    scheduledFor: "2024-01-16 11:00",
    subject: "Great Progress in Chemistry!",
    reason: "Improved engagement (87%)",
    template: "Positive Reinforcement",
  },
  {
    id: 4,
    student: "Emma Wilson",
    email: "emma.wilson@university.edu",
    avatar: "/student-blonde.jpg",
    type: "reminder",
    priority: "low",
    status: "pending",
    scheduledFor: "2024-01-16 16:00",
    subject: "Upcoming Biology Lab Session",
    reason: "Lab preparation reminder",
    template: "Session Reminder",
  },
]

const emailStats = [
  { label: "Emails Sent Today", value: "12", change: "+3", icon: Mail },
  { label: "Meetings Scheduled", value: "8", change: "+2", icon: Calendar },
  { label: "Response Rate", value: "89%", change: "+5%", icon: CheckCircle },
  { label: "Pending Actions", value: "5", change: "-1", icon: Clock },
]

function getStatusColor(status: string) {
  switch (status) {
    case "sent":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "scheduled":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "failed":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "medium":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "low":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

export function EmailCenter() {
  const [emails, setEmails] = useState(emailQueue)
  const [isLoading, setIsLoading] = useState(false)

  const fetchEmails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/emails')
      if (response.ok) {
        const data = await response.json()
        setEmails(data.emails || emailQueue)
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerAIProcessing = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/engagement/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processAll: true,
          sessionId: 'current',
        }),
      })
      
      if (response.ok) {
        await fetchEmails()
      }
    } catch (error) {
      console.error('Error triggering AI processing:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  return (
    <div className="space-y-6">
      {/* Email Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {emailStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-green-400">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Agent Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Agent Actions
          </CardTitle>
          <CardDescription>Quick actions for the AI email agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={triggerAIProcessing} disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Process All Students'}
            </Button>
            <Button variant="outline" onClick={fetchEmails} disabled={isLoading}>
              <Mail className="h-4 w-4 mr-2" />
              Refresh Emails
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Email Queue</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Queue
                  </CardTitle>
                  <CardDescription>Automated and scheduled email communications</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Send All Pending
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailQueue.map((email) => (
                  <div key={email.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={email.avatar || "/placeholder.svg"} alt={email.student} />
                      <AvatarFallback>
                        {email.student
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-foreground">{email.student}</h4>
                          <Badge className={getStatusColor(email.status)}>{email.status}</Badge>
                          <Badge className={getPriorityColor(email.priority)}>{email.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Send Now
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="font-medium text-sm text-foreground">{email.subject}</p>
                        <p className="text-sm text-muted-foreground">{email.reason}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{email.email}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {email.scheduledFor}
                        </span>
                        <span>Template: {email.template}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Email</CardTitle>
              <CardDescription>Send custom emails to students or groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Recipients</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select students..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="at-risk">All At-Risk Students (8)</SelectItem>
                      <SelectItem value="physics">Physics Students (24)</SelectItem>
                      <SelectItem value="individual">Individual Student</SelectItem>
                      <SelectItem value="custom">Custom Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Template</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Meeting Request</SelectItem>
                      <SelectItem value="encouragement">Encouragement</SelectItem>
                      <SelectItem value="reminder">Session Reminder</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Subject</label>
                <Input placeholder="Email subject..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea placeholder="Type your message here..." className="min-h-32" />
              </div>

              <div className="flex items-center gap-2">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Configure automatic email triggers based on student behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">At-Risk Student Alert</h4>
                    <p className="text-sm text-muted-foreground">
                      Send meeting request when engagement drops below 50%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400">Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">High Confusion Topic</h4>
                    <p className="text-sm text-muted-foreground">
                      Email affected students when topic confusion rate exceeds 60%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400">Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Positive Reinforcement</h4>
                    <p className="text-sm text-muted-foreground">
                      Send encouragement email when engagement improves by 15%+
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/10 text-yellow-400">Paused</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <Button>
                <AlertCircle className="h-4 w-4 mr-2" />
                Add New Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
