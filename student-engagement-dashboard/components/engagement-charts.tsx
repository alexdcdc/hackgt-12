"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts"
import { TrendingUp, TrendingDown, Users, Brain, Clock } from "lucide-react"

// Sample data for charts
const engagementTrendData = [
  { date: "Jan 1", engagement: 65, confusion: 35, students: 120 },
  { date: "Jan 8", engagement: 68, confusion: 32, students: 125 },
  { date: "Jan 15", engagement: 72, confusion: 28, students: 127 },
  { date: "Jan 22", engagement: 75, confusion: 25, students: 124 },
  { date: "Jan 29", engagement: 78, confusion: 22, students: 128 },
  { date: "Feb 5", engagement: 76, confusion: 24, students: 126 },
  { date: "Feb 12", engagement: 80, confusion: 20, students: 130 },
]

const subjectPerformanceData = [
  { subject: "Biology", engagement: 89, confusion: 22, sessions: 45 },
  { subject: "Chemistry", engagement: 82, confusion: 28, sessions: 38 },
  { subject: "Mathematics", engagement: 65, confusion: 41, sessions: 52 },
  { subject: "Physics", engagement: 58, confusion: 52, sessions: 41 },
]

const topicDifficultyData = [
  { topic: "Cell Biology", difficulty: 2, engagement: 94, students: 28 },
  { topic: "Organic Chemistry", difficulty: 6, engagement: 78, students: 24 },
  { topic: "Linear Algebra", difficulty: 7, engagement: 62, students: 22 },
  { topic: "Thermodynamics", difficulty: 8, engagement: 71, students: 19 },
  { topic: "Quantum Mechanics", difficulty: 9, engagement: 45, students: 16 },
  { topic: "Differential Equations", difficulty: 8.5, engagement: 58, students: 18 },
]

const studentDistributionData = [
  { name: "Highly Engaged", value: 45, color: "#10b981" },
  { name: "Moderate", value: 67, color: "#f59e0b" },
  { name: "At Risk", value: 15, color: "#ef4444" },
]

const sessionLengthData = [
  { length: "30-40 min", engagement: 85, count: 12 },
  { length: "40-50 min", engagement: 88, count: 28 },
  { length: "50-60 min", engagement: 82, count: 35 },
  { length: "60-70 min", engagement: 75, count: 18 },
  { length: "70+ min", engagement: 68, count: 8 },
]

const confusionHeatmapData = [
  { topic: "Quantum Mechanics", week1: 68, week2: 65, week3: 62, week4: 58 },
  { topic: "Differential Equations", week1: 45, week2: 42, week3: 38, week4: 35 },
  { topic: "Organic Chemistry", week1: 32, week2: 28, week3: 25, week4: 22 },
  { topic: "Thermodynamics", week1: 38, week2: 35, week3: 32, week4: 30 },
]

const COLORS = ["#10b981", "#f59e0b", "#ef4444"]

export function EngagementCharts() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">78%</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-green-400">+5%</span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Students</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">127</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-green-400">+12</span>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confusion Rate</CardTitle>
            <Brain className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">22%</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-green-400">-8%</span>
              <span className="text-sm text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Session</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">52 min</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-red-400">-5 min</span>
              <span className="text-sm text-muted-foreground">vs target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>Student engagement and confusion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="confusion" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
            <CardDescription>Engagement and confusion by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="subject" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="engagement" fill="#10b981" />
                <Bar dataKey="confusion" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution</CardTitle>
            <CardDescription>Engagement level breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={studentDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {studentDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Topic Difficulty vs Engagement */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Topic Difficulty Analysis</CardTitle>
            <CardDescription>Relationship between topic difficulty and student engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart data={topicDifficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="difficulty" stroke="#9ca3af" name="Difficulty" />
                <YAxis dataKey="engagement" stroke="#9ca3af" name="Engagement" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => [
                    `${value}${name === "engagement" ? "%" : ""}`,
                    name === "engagement" ? "Engagement" : "Difficulty",
                  ]}
                />
                <Scatter dataKey="engagement" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Length Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Session Length Impact</CardTitle>
            <CardDescription>How session duration affects engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionLengthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="length" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Area type="monotone" dataKey="engagement" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confusion Improvement Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Confusion Improvement</CardTitle>
            <CardDescription>Weekly confusion rate trends by topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {confusionHeatmapData.map((topic) => (
              <div key={topic.topic} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{topic.topic}</span>
                  <div className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">-{topic.week1 - topic.week4}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">W1</div>
                    <div className="text-sm font-medium text-foreground">{topic.week1}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">W2</div>
                    <div className="text-sm font-medium text-foreground">{topic.week2}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">W3</div>
                    <div className="text-sm font-medium text-foreground">{topic.week3}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">W4</div>
                    <div className="text-sm font-medium text-foreground">{topic.week4}%</div>
                  </div>
                </div>
                <Progress value={100 - topic.week4} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
