import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, Download, RefreshCw, X } from "lucide-react"

const activeFilters = [
  { label: "Physics", value: "physics", type: "subject" },
  { label: "Last 30 days", value: "30-days", type: "timeframe" },
]

export function AnalyticsFilters() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select defaultValue="all-subjects">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-subjects">All Subjects</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
            <SelectItem value="physics">Physics</SelectItem>
            <SelectItem value="chemistry">Chemistry</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-students">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-students">All Students</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="engaged">Highly Engaged</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="last-30-days">
          <SelectTrigger className="w-40">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7-days">Last 7 days</SelectItem>
            <SelectItem value="last-30-days">Last 30 days</SelectItem>
            <SelectItem value="last-90-days">Last 90 days</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced
        </Button>

        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.value} variant="secondary" className="gap-1">
              {filter.label}
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
