"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  AlertTriangle,
  Mail,
  Clock,
  Brain,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClassSession, Student } from "@/lib/types";

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
];

interface Metrics {
  engagement: number;
  num_students: number;
  confusion: number;
  duration: number;
}

export function EngagementOverview() {
  const [recentSessions, setRecentSessions] = useState<ClassSession[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    engagement: 0,
    num_students: 0,
    confusion: 0,
    duration: 0,
  });
  const getClassData = async () => {
    const response = await fetch("/api/class-sessions");
    const jsonData = await response.json();
    setRecentSessions(jsonData);
  };
  const getStudentData = async () => {
    const response = await fetch("/api/students/at-risk");
    const jsonData = await response.json();
    setStudents(jsonData);
  };

  const getMetrics = async () => {
    const response = await fetch("/api/metrics");
    const jsonData = await response.json();
    setMetrics(jsonData);
  };

  const classDataCallback = useCallback(getClassData, []);
  const studentDataCallback = useCallback(getStudentData, []);
  const metricsCallback = useCallback(getMetrics, []);

  useEffect(() => {
    classDataCallback();
    studentDataCallback();
    metricsCallback();
  }, [classDataCallback, studentDataCallback, metricsCallback]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Engagement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.engagement.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Students
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.num_students}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confusion Rate
            </CardTitle>
            <Brain className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.confusion.toFixed(0)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Session
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.duration.toFixed(0)} min
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Latest Google Meets sessions with engagement analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-foreground">
                        {session.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {new Date(session.start_time).toLocaleDateString()}
                      </span>
                      <span>{session.duration.toFixed(0)} min</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {session.num_students}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground">
                      {session.average_engagement?.toFixed(0) || "N/A"}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      engagement
                    </div>
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
            <CardDescription>
              Students showing declining engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {student.first_name + " " + student.last_name}
                    </span>
                    <Button size="sm" variant="outline">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engagement</span>
                      <span className="text-foreground">
                        {student.average_engagement}%
                      </span>
                    </div>
                    <Progress
                      value={student.average_engagement}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
