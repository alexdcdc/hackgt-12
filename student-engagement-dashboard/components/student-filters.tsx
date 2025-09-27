import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, X } from "lucide-react"

const activeFilters = [
  { label: "At Risk", value: "at-risk", type: "status" },
  { label: "Physics", value: "physics", type: "subject" },
]

export function StudentFilters() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search students by name or ID..." className="pl-10" />
        </div>

        <Select defaultValue="all-status">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="engaged">Highly Engaged</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="at-risk">At Risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

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

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
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
