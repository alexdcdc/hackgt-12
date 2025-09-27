import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MeetingScheduler } from "@/components/meeting-scheduler"

export default function MeetingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Meeting Scheduler</h1>
                <p className="text-muted-foreground mt-1">Schedule and manage one-on-one meetings with students</p>
              </div>
            </div>
            <MeetingScheduler />
          </div>
        </main>
      </div>
    </div>
  )
}
