import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, Users, Clock, Target, Brain, BarChart3 } from "lucide-react"

const topicMetrics = [
  {
    title: "Most Challenging Topic",
    value: "Quantum Mechanics",
    metric: "68% confusion rate",
    change: "+12%",
    trend: "up",
    description: "Physics - Advanced level",
  },
  {
    title: "Highest Engagement",
    value: "Cell Biology",
    metric: "94% engagement",
    change: "+8%",
    trend: "up",
    description: "Biology - Intermediate level",
  },
  {
    title: "Topics Analyzed",
    value: "47",
    metric: "across 4 subjects",
    change: "+3",
    trend: "up",
    description: "This semester",
  },
  {
    title: "Avg Session Length",
    value: "52 min",
    metric: "per topic",
    change: "-5 min",
    trend: "down",
    description: "Optimal range: 45-60 min",
  },
]

const topicAnalysis = [
  {
    id: 1,
    subject: "Physics",
    topic: "Quantum Mechanics",
    difficulty: "Advanced",
    totalSessions: 8,
    avgEngagement: 45,
    confusionRate: 68,
    studentsAffected: 24,
    trend: "declining",
    lastSession: "2024-01-15",
    keyIssues: ["Wave-particle duality", "Uncertainty principle", "Quantum entanglement"],
    recommendedActions: ["Break into smaller segments", "Add visual demonstrations", "Schedule review session"],
  },
  {
    id: 2,
    subject: "Mathematics",
    topic: "Differential Equations",
    difficulty: "Advanced",
    totalSessions: 6,
    avgEngagement: 62,
    confusionRate: 45,
    studentsAffected: 18,
    trend: "stable",
    lastSession: "2024-01-14",
    keyIssues: ["Separation of variables", "Initial conditions", "Solution verification"],
    recommendedActions: ["More practice problems", "Step-by-step examples"],
  },
  {
    id: 3,
    subject: "Chemistry",
    topic: "Organic Synthesis",
    difficulty: "Intermediate",
    totalSessions: 10,
    avgEngagement: 78,
    confusionRate: 32,
    studentsAffected: 12,
    trend: "improving",
    lastSession: "2024-01-13",
    keyIssues: ["Reaction mechanisms", "Stereochemistry"],
    recommendedActions: ["Interactive molecular models", "Mechanism practice"],
  },
  {
    id: 4,
    subject: "Biology",
    topic: "Cell Biology",
    difficulty: "Intermediate",
    totalSessions: 12,
    avgEngagement: 94,
    confusionRate: 15,
    studentsAffected: 5,
    trend: "stable",
    lastSession: "2024-01-12",
    keyIssues: ["Mitochondrial function"],
    recommendedActions: ["Continue current approach"],
  },
  {
    id: 5,
    subject: "Physics",
    topic: "Thermodynamics",
    difficulty: "Intermediate",
    totalSessions: 9,
    avgEngagement: 71,
    confusionRate: 38,
    studentsAffected: 15,
    trend: "improving",
    lastSession: "2024-01-11",
    keyIssues: ["Entropy concept", "Heat engines", "Phase transitions"],
    recommendedActions: ["Real-world examples", "Interactive simulations"],
  },
]

const subjectOverview = [
  { subject: "Physics", topics: 12, avgEngagement: 58, confusionRate: 52, color: "bg-blue-500" },
  { subject: "Mathematics", topics: 15, avgEngagement: 65, confusionRate: 41, color: "bg-green-500" },
  { subject: "Chemistry", topics: 11, avgEngagement: 82, confusionRate: 28, color: "bg-purple-500" },
  { subject: "Biology", topics: 9, avgEngagement: 89, confusionRate: 22, color: "bg-orange-500" },
]

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Advanced":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "Intermediate":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "Beginner":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="h-4 w-4 text-green-400" />
    case "declining":
      return <TrendingDown className="h-4 w-4 text-red-400" />
    default:
      return <div className="h-4 w-4" />
  }
}

export function TopicAnalytics() {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topicMetrics.map((metric) => (
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
                <span className="text-sm text-muted-foreground">{metric.metric}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Subject Overview
            </CardTitle>
            <CardDescription>Performance across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectOverview.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${subject.color}`} />
                      <span className="font-medium text-foreground">{subject.subject}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{subject.topics} topics</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Engagement: </span>
                      <span className="font-medium text-foreground">{subject.avgEngagement}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confusion: </span>
                      <span className="font-medium text-foreground">{subject.confusionRate}%</span>
                    </div>
                  </div>
                  <Progress value={subject.avgEngagement} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Topic Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Topic Analysis
            </CardTitle>
            <CardDescription>Detailed breakdown of topic performance and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topicAnalysis.map((topic) => (
                <div key={topic.id} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{topic.topic}</h4>
                        <Badge variant="outline" className="text-xs">
                          {topic.subject}
                        </Badge>
                        <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {topic.totalSessions} sessions
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {topic.studentsAffected} students affected
                        </span>
                        <span>Last: {topic.lastSession}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(topic.trend)}
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-2" />
                        Action Plan
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Engagement</span>
                        <span className="font-medium text-foreground">{topic.avgEngagement}%</span>
                      </div>
                      <Progress value={topic.avgEngagement} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Confusion Rate</span>
                        <span className="font-medium text-foreground">{topic.confusionRate}%</span>
                      </div>
                      <Progress value={topic.confusionRate} className="h-2 [&>div]:bg-red-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        Key Issues
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {topic.keyIssues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-warning">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3 text-green-400" />
                        Recommended Actions
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {topic.recommendedActions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-400">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
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
