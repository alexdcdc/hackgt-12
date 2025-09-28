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
import { useCallback, useEffect, useState } from "react";
import { Student } from "@/lib/types";

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const getData = useCallback(async () => {
    const response = await fetch("/api/students");
    const jsonData = await response.json();
    setStudents(jsonData);
  }, []);
  useEffect(() => {
    getData();
  }, [getData]);
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
