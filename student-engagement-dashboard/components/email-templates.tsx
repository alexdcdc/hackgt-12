import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Edit, Copy, Trash2 } from "lucide-react"

const emailTemplates = [
  {
    id: 1,
    name: "At-Risk Student Meeting",
    category: "Meeting Request",
    usage: 24,
    lastUsed: "2 hours ago",
    preview:
      "Hi {student_name}, I've noticed you might benefit from some additional support in {subject}. Would you be available for a brief meeting to discuss how we can help you succeed?",
  },
  {
    id: 2,
    name: "Positive Reinforcement",
    category: "Encouragement",
    usage: 18,
    lastUsed: "1 day ago",
    preview:
      "Great work in {subject}, {student_name}! Your engagement has improved significantly. Keep up the excellent progress!",
  },
  {
    id: 3,
    name: "Session Reminder",
    category: "Reminder",
    usage: 45,
    lastUsed: "3 hours ago",
    preview:
      "Reminder: You have an upcoming {subject} session on {date} at {time}. Please review the materials we discussed previously.",
  },
  {
    id: 4,
    name: "Topic Clarification",
    category: "Academic Support",
    usage: 12,
    lastUsed: "5 days ago",
    preview:
      "Hi {student_name}, I noticed some confusion around {topic} in our recent session. I've prepared some additional resources that might help clarify these concepts.",
  },
]

function getCategoryColor(category: string) {
  switch (category) {
    case "Meeting Request":
      return "bg-red-500/10 text-red-400 border-red-500/20"
    case "Encouragement":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "Reminder":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Academic Support":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

export function EmailTemplates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Templates
        </CardTitle>
        <CardDescription>Pre-configured email templates for common scenarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {emailTemplates.map((template) => (
            <div key={template.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">{template.name}</h4>
                    <Badge className={getCategoryColor(template.category)} variant="outline">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">{template.preview}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Used {template.usage} times</span>
                <span>{template.lastUsed}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs text-red-400 bg-transparent">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
