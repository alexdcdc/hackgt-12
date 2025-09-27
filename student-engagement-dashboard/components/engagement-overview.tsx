import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, BookOpen, AlertTriangle, Mail } from "lucide-react"

const engagementMetrics = [
  {
    title: "Overall Engagement",
    value: "78%",
    change: "+5%",
    trend: "up",
    description: "Average across all sessions",
  },
  {
    title: "Active Participants",
    value: "127",
    change: "+12",
    trend: "up",
    description: "Students in recent sessions",
  },
  {
    title: "Confusion Incidents",
    value: "23",
    change: "-8",
    trend: "down",
    description: "Detected this week",
  },
  {
    title: "Follow-up Meetings",
    value: "15",
    change: "+3",
    trend: "up",
    description: "Scheduled this week",
  },
]

const recentSessions = [
  {
    id: 1,
    topic: "Calculus - Derivatives",
    date: "2024-01-15",
    duration: "45 min",
    students: 28,
    avgEngagement: 82,
    confusionLevel: "Low",
    status: "completed",
  },
  {
    id: 2,
    topic: "Physics - Quantum Mechanics",
    date: "2024-01-15",
    duration: "60 min",
    students: 24,
    avgEngagement: 65,
    confusionLevel: "High",
    status: "needs-attention",
  },
  {
    id: 3,
    topic: "Chemistry - Organic Compounds",
    date: "2024-01-14",
    duration: "50 min",
    students: 31,
    avgEngagement: 75,
    confusionLevel: "Medium",
    status: "completed",
  },
]

const atRiskStudents = [
  { name: "Alex Chen", engagement: 45, trend: "declining", lastActive: "2 days ago" },
  { name: "Sarah Johnson", engagement: 52, trend: "stable", lastActive: "1 day ago" },
  { name: "Mike Rodriguez", engagement: 38, trend: "declining", lastActive: "3 days ago" },
]

export function EngagementOverview() {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              {metric.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${metric.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {metric.change}
                </span>
                <span className="text-sm text-muted-foreground">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>Latest Google Meets sessions with engagement analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">{session.topic}</h4>
                      <Badge variant={session.status === "needs-attention" ? "destructive" : "secondary"}>
                        {session.confusionLevel} Confusion
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{session.date}</span>
                      <span>{session.duration}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {session.students}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">{session.avgEngagement}%</div>
                    <div className="text-sm text-muted-foreground">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* At Risk Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              At Risk Students
            </CardTitle>
            <CardDescription>Students showing declining engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atRiskStudents.map((student) => (
                <div key={student.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{student.name}</span>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="text-foreground">{student.engagement}%</span>
                    </div>
                    <Progress value={student.engagement} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className={student.trend === "declining" ? "text-red-400" : "text-yellow-400"}>
                        {student.trend}
                      </span>
                      <span>{student.lastActive}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
