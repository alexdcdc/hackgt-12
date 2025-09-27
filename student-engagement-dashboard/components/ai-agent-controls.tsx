"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Mail, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { useState, useEffect } from "react"

interface AgentStatus {
  isActive: boolean
  lastRun: string | null
  emailsSent: number
  meetingsScheduled: number
  studentsProcessed: number
  successRate: number
}

interface EngagementMetrics {
  averageEngagement: number
  averageDistractedness: number
  averageConfusion: number
  averageBoredom: number
  totalSessions: number
  atRiskStudents: Array<{
    id: string
    name: string
    email: string
    engagement: number
    confusion: number
    boredom: number
    subject: string
    topic: string
  }>
}

export function AIAgentControls() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    isActive: false,
    lastRun: null,
    emailsSent: 0,
    meetingsScheduled: 0,
    studentsProcessed: 0,
    successRate: 0,
  })

  const [metrics, setMetrics] = useState<EngagementMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAgentStatus = async () => {
    try {
      const response = await fetch('/api/engagement/analytics')
      if (response.ok) {
        const data = await response.json()
        setMetrics(data)
      }
    } catch (error) {
      console.error('Error fetching agent status:', error)
    }
  }

  const toggleAgent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/engagement/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toggleAgent: true,
        }),
      })
      
      if (response.ok) {
        setAgentStatus(prev => ({
          ...prev,
          isActive: !prev.isActive,
          lastRun: new Date().toISOString(),
        }))
      }
    } catch (error) {
      console.error('Error toggling agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processAllStudents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/engagement/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          processAll: true,
          sessionId: 'current', // This would be dynamic in a real implementation
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setAgentStatus(prev => ({
          ...prev,
          emailsSent: prev.emailsSent + (result.results?.filter((r: any) => r.success).length || 0),
          meetingsScheduled: prev.meetingsScheduled + (result.results?.filter((r: any) => r.meetingScheduled).length || 0),
          studentsProcessed: prev.studentsProcessed + (result.processed || 0),
        }))
        await fetchAgentStatus()
      }
    } catch (error) {
      console.error('Error processing students:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAgentStatus()
    const interval = setInterval(fetchAgentStatus, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Agent Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Email Agent
          </CardTitle>
          <CardDescription>
            Automated student engagement monitoring and email communication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                checked={agentStatus.isActive}
                onCheckedChange={toggleAgent}
                disabled={isLoading}
              />
              <span className="text-sm font-medium">
                {agentStatus.isActive ? 'Agent Active' : 'Agent Inactive'}
              </span>
            </div>
            <Badge 
              variant={agentStatus.isActive ? "default" : "secondary"}
              className={agentStatus.isActive ? "bg-green-500" : ""}
            >
              {agentStatus.isActive ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Running</>
              ) : (
                <><Pause className="h-3 w-3 mr-1" /> Paused</>
              )}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Emails Sent</p>
              <p className="text-2xl font-bold">{agentStatus.emailsSent}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Meetings Scheduled</p>
              <p className="text-2xl font-bold">{agentStatus.meetingsScheduled}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Students Processed</p>
              <p className="text-2xl font-bold">{agentStatus.studentsProcessed}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold">{agentStatus.successRate}%</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={processAllStudents} 
              disabled={isLoading}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Process All Students'}
            </Button>
            <Button variant="outline" disabled>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>Current student engagement statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Engagement</span>
                  <span>{metrics.averageEngagement?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics.averageEngagement || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Confusion</span>
                  <span>{metrics.averageConfusion?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics.averageConfusion || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Distractedness</span>
                  <span>{metrics.averageDistractedness?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics.averageDistractedness || 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Boredom</span>
                  <span>{metrics.averageBoredom?.toFixed(1) || 0}%</span>
                </div>
                <Progress value={metrics.averageBoredom || 0} className="h-2" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">At-Risk Students</h4>
                <Badge variant="destructive">{metrics.atRiskStudents.length}</Badge>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {metrics.atRiskStudents.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.subject} - {student.topic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-red-500">
                        Engagement: {student.engagement}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Confusion: {student.confusion}%
                      </p>
                    </div>
                  </div>
                ))}
                {metrics.atRiskStudents.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{metrics.atRiskStudents.length - 5} more students
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threshold Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Engagement Thresholds
          </CardTitle>
          <CardDescription>Configure when the AI agent should take action</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Low Engagement Alert</span>
                <span>&lt; 50%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High Confusion Alert</span>
                <span>&gt; 60%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>High Distractedness Alert</span>
                <span>&gt; 70%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High Boredom Alert</span>
                <span>&gt; 80%</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Adjust Thresholds
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
