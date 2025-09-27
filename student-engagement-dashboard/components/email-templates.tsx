import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Edit, Copy, Trash2, Play } from "lucide-react"
import { EMAIL_TEMPLATES } from "@/lib/email-templates"
import { useState } from "react"

const emailTemplates = Object.values(EMAIL_TEMPLATES).map(template => ({
  ...template,
  usage: Math.floor(Math.random() * 50) + 1,
  lastUsed: Math.random() > 0.5 ? `${Math.floor(Math.random() * 24)} hours ago` : `${Math.floor(Math.random() * 7)} days ago`,
}))

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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleTestTemplate = async (templateId: string) => {
    try {
      const response = await fetch('/api/engagement/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testTemplate: true,
          templateId,
        }),
      })
      
      if (response.ok) {
        console.log('Template test sent successfully')
      }
    } catch (error) {
      console.error('Error testing template:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Templates
        </CardTitle>
        <CardDescription>AI-powered email templates for student engagement</CardDescription>
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
                    {template.type === 'AT_RISK_ALERT' && (
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20" variant="outline">
                        AI Triggered
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.subject.replace(/{[^}]+}/g, '[Variable]')}
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground">
                      Variables: {template.variables.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Used {template.usage} times</span>
                <span>{template.lastUsed}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs bg-transparent"
                  onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {selectedTemplate === template.id ? 'Hide' : 'Preview'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs bg-transparent"
                  onClick={() => handleTestTemplate(template.id)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Test
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>

              {selectedTemplate === template.id && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <h5 className="text-sm font-medium mb-2">Template Preview:</h5>
                  <div 
                    className="text-xs text-muted-foreground max-h-32 overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: template.content.replace(/{[^}]+}/g, '<span class="text-blue-400 font-mono">[Variable]</span>')
                    }}
                  />
                </div>
              )}
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
