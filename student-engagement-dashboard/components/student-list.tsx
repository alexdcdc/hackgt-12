"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";

const students = [
  {
    id: 1,
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    avatar: "/diverse-student-portraits.png",
    overallEngagement: 45,
    trend: "declining",
    status: "at-risk",
    lastActive: "2 days ago",
    totalSessions: 24,
    confusionIncidents: 8,
    subjects: ["Physics", "Mathematics"],
    recentTopics: ["Quantum Mechanics", "Calculus"],
    meetingScheduled: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@university.edu",
    avatar: "/diverse-female-student.png",
    overallEngagement: 87,
    trend: "improving",
    status: "engaged",
    lastActive: "1 hour ago",
    totalSessions: 32,
    confusionIncidents: 2,
    subjects: ["Chemistry", "Biology"],
    recentTopics: ["Organic Chemistry", "Cell Biology"],
    meetingScheduled: false,
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    email: "m.rodriguez@university.edu",
    avatar: "/male-student-studying.png",
    overallEngagement: 38,
    trend: "declining",
    status: "at-risk",
    lastActive: "3 days ago",
    totalSessions: 18,
    confusionIncidents: 12,
    subjects: ["Mathematics", "Physics"],
    recentTopics: ["Linear Algebra", "Thermodynamics"],
    meetingScheduled: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma.wilson@university.edu",
    avatar: "/diverse-female-student.png",
    overallEngagement: 92,
    trend: "stable",
    status: "engaged",
    lastActive: "30 minutes ago",
    totalSessions: 28,
    confusionIncidents: 1,
    subjects: ["Biology", "Chemistry"],
    recentTopics: ["Genetics", "Biochemistry"],
    meetingScheduled: false,
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@university.edu",
    avatar: "/asian-student-studying.png",
    overallEngagement: 72,
    trend: "stable",
    status: "moderate",
    lastActive: "1 day ago",
    totalSessions: 26,
    confusionIncidents: 4,
    subjects: ["Mathematics", "Physics"],
    recentTopics: ["Statistics", "Electromagnetism"],
    meetingScheduled: false,
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "lisa.t@university.edu",
    avatar: "/student-blonde.jpg",
    overallEngagement: 65,
    trend: "improving",
    status: "moderate",
    lastActive: "4 hours ago",
    totalSessions: 22,
    confusionIncidents: 5,
    subjects: ["Chemistry", "Mathematics"],
    recentTopics: ["Analytical Chemistry", "Differential Equations"],
    meetingScheduled: false,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "engaged":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "moderate":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "at-risk":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    case "declining":
      return <TrendingDown className="h-4 w-4 text-red-400" />;
    default:
      return <div className="h-4 w-4" />;
  }
}

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  average_engagement: number;
  total_sessions: number;
  classes: string;
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const getData = async () => {
    const response = await fetch("/api/students");
    const jsonData = await response.json();
    setStudents(jsonData);
  };
  useEffect(() => {
    getData();
  });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {students.length} students
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Button variant="ghost" size="sm">
            Engagement ↓
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card
            key={student.id}
            className="hover:bg-accent/50 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {student.first_name[0] + student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-foreground">
                            {student.first_name + " " + student.last_name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Overall Engagement
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {student.average_engagement}%
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={student.average_engagement}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Sessions
                        </span>
                        <p className="text-sm font-medium text-foreground">
                          {student.total_sessions}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          Classes
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {student.classes}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
