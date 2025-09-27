import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, X } from "lucide-react"

const activeFilters = [
  { label: "High Confusion", value: "high-confusion", type: "confusion" },
  { label: "Last 30 days", value: "30-days", type: "timeframe" },
]

export function TopicFilters() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search topics or subjects..." className="pl-10" />
        </div>

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

        <Select defaultValue="confusion-level">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confusion-level">All Confusion Levels</SelectItem>
            <SelectItem value="high">High Confusion</SelectItem>
            <SelectItem value="medium">Medium Confusion</SelectItem>
            <SelectItem value="low">Low Confusion</SelectItem>
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
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced
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
