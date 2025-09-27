import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MapPin, User, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const upcomingMeetings = [
  {
    id: 1,
    student: "Alex Chen",
    email: "alex.chen@university.edu",
    avatar: "/asian-student-studying.png",
    date: "2024-01-16",
    time: "09:00 AM",
    duration: "30 min",
    type: "Academic Support",
    status: "confirmed",
    reason: "Low engagement in Quantum Mechanics",
    location: "Office 204B",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: 2,
    student: "Mike Rodriguez",
    email: "m.rodriguez@university.edu",
    avatar: "/male-student-studying.png",
    date: "2024-01-16",
    time: "02:30 PM",
    duration: "45 min",
    type: "Academic Support",
    status: "pending",
    reason: "Multiple confusion incidents in Mathematics",
    location: "Virtual Meeting",
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
  },
  {
    id: 3,
    student: "Sarah Johnson",
    email: "sarah.j@university.edu",
    avatar: "/diverse-female-student.png",
    date: "2024-01-17",
    time: "11:00 AM",
    duration: "20 min",
    type: "Check-in",
    status: "confirmed",
    reason: "Progress review - Chemistry improvement",
    location: "Virtual Meeting",
    meetingLink: "https://meet.google.com/def-ghij-klm",
  },
]

const meetingStats = [
  { label: "This Week", value: "8", icon: Calendar },
  { label: "Confirmed", value: "6", icon: CheckCircle },
  { label: "Pending", value: "2", icon: AlertCircle },
  { label: "Avg Duration", value: "35 min", icon: Clock },
]

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "cancelled":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Academic Support":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "Check-in":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Follow-up":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

export function MeetingScheduler() {
  return (
    <div className="space-y-6">
      {/* Meeting Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {meetingStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Meetings
                </CardTitle>
                <CardDescription>Scheduled one-on-one student meetings</CardDescription>
              </div>
              <Button>
                <User className="h-4 w-4 mr-2" />
                Schedule New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={meeting.avatar || "/placeholder.svg"} alt={meeting.student} />
                    <AvatarFallback>
                      {meeting.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-foreground">{meeting.student}</h4>
                        <Badge className={getStatusColor(meeting.status)}>{meeting.status}</Badge>
                        <Badge className={getTypeColor(meeting.type)} variant="outline">
                          {meeting.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm">
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm
                            </Button>
                          </>
                        )}
                        {meeting.status === "confirmed" && (
                          <Button size="sm">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{meeting.date}</span>
                          <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                          <span className="text-foreground">{meeting.time}</span>
                          <span className="text-muted-foreground">({meeting.duration})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{meeting.location}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Meeting Purpose:</p>
                        <p className="text-sm text-muted-foreground">{meeting.reason}</p>
                      </div>
                    </div>

                    {meeting.meetingLink && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Meeting Link:</span>
                          <Button variant="ghost" size="sm" className="text-blue-400">
                            <Video className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common meeting management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Schedule with At-Risk Student
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Bulk Schedule Meetings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Clock className="h-4 w-4 mr-2" />
              Set Office Hours
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Video className="h-4 w-4 mr-2" />
              Create Meeting Room
            </Button>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">Auto-Schedule Rules</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Engagement {"<"} 50%</span>
                  <Badge className="bg-green-500/10 text-green-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confusion {">"} 5 incidents</span>
                  <Badge className="bg-green-500/10 text-green-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Missed 3+ sessions</span>
                  <Badge className="bg-yellow-500/10 text-yellow-400">Paused</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
