import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingDown, Clock, Mail, CheckCircle, X, Bell } from "lucide-react"

const criticalAlerts = [
  {
    id: 1,
    type: "student-at-risk",
    priority: "high",
    student: "Alex Chen",
    avatar: "/asian-student-studying.png",
    message: "Engagement dropped to 45% in Physics - Quantum Mechanics",
    timestamp: "5 minutes ago",
    action: "Schedule meeting",
    status: "unread",
  },
  {
    id: 2,
    type: "topic-confusion",
    priority: "high",
    message: "Differential Equations showing 68% confusion rate across 18 students",
    timestamp: "12 minutes ago",
    action: "Review teaching approach",
    status: "unread",
  },
  {
    id: 3,
    type: "student-inactive",
    priority: "medium",
    student: "Mike Rodriguez",
    avatar: "/male-student-studying.png",
    message: "No activity for 3 consecutive sessions",
    timestamp: "1 hour ago",
    action: "Send check-in email",
    status: "unread",
  },
]

const recentAlerts = [
  {
    id: 4,
    type: "engagement-improvement",
    priority: "low",
    student: "Sarah Johnson",
    avatar: "/diverse-female-student.png",
    message: "Engagement improved to 87% in Chemistry",
    timestamp: "2 hours ago",
    action: "Send encouragement",
    status: "read",
  },
  {
    id: 5,
    type: "session-length",
    priority: "medium",
    message: "Average session length exceeded 70 minutes - consider breaking up content",
    timestamp: "3 hours ago",
    action: "Adjust lesson plan",
    status: "read",
  },
  {
    id: 6,
    type: "confusion-resolved",
    priority: "low",
    message: "Organic Chemistry confusion rate improved from 45% to 28%",
    timestamp: "1 day ago",
    action: "Continue current approach",
    status: "read",
  },
]

const alertStats = [
  { label: "Active Alerts", value: "8", change: "+2", icon: AlertTriangle },
  { label: "Students at Risk", value: "3", change: "+1", icon: TrendingDown },
  { label: "Auto Actions", value: "12", change: "+5", icon: Mail },
  { label: "Resolved Today", value: "6", change: "+3", icon: CheckCircle },
]

function getAlertColor(priority: string) {
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

function getAlertIcon(type: string) {
  switch (type) {
    case "student-at-risk":
      return <AlertTriangle className="h-4 w-4 text-red-400" />
    case "topic-confusion":
      return <TrendingDown className="h-4 w-4 text-red-400" />
    case "student-inactive":
      return <Clock className="h-4 w-4 text-yellow-400" />
    case "engagement-improvement":
      return <CheckCircle className="h-4 w-4 text-green-400" />
    default:
      return <Bell className="h-4 w-4 text-blue-400" />
  }
}

export function AlertsCenter() {
  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {alertStats.map((stat) => (
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

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Critical Alerts
                  </CardTitle>
                  <CardDescription>Immediate attention required</CardDescription>
                </div>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg ${
                      alert.status === "unread" ? "border-red-500/20 bg-red-500/5" : "border-border"
                    }`}
                  >
                    <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>

                    {alert.student && (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={alert.avatar || "/placeholder.svg"} alt={alert.student} />
                        <AvatarFallback>
                          {alert.student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {alert.student && <span className="font-medium text-foreground">{alert.student}</span>}
                          <Badge className={getAlertColor(alert.priority)}>{alert.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            {alert.action}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>All alerts from the past 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>

                    {alert.student && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={alert.avatar || "/placeholder.svg"} alt={alert.student} />
                        <AvatarFallback className="text-xs">
                          {alert.student
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {alert.student && (
                            <span className="text-sm font-medium text-foreground">{alert.student}</span>
                          )}
                          <Badge className={getAlertColor(alert.priority)} variant="outline">
                            {alert.priority}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>Customize when and how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Student Engagement Threshold</h4>
                    <p className="text-sm text-muted-foreground">Alert when engagement drops below 50%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400">Enabled</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Topic Confusion Rate</h4>
                    <p className="text-sm text-muted-foreground">Alert when confusion exceeds 60% for a topic</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400">Enabled</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Student Inactivity</h4>
                    <p className="text-sm text-muted-foreground">Alert after 3 consecutive missed sessions</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400">Enabled</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Send email alerts for high-priority issues</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/10 text-yellow-400">Paused</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
