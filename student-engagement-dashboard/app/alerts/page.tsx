import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AlertsCenter } from "@/components/alerts-center"

export default function AlertsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Alerts Center</h1>
                <p className="text-muted-foreground mt-1">
                  Real-time notifications and automated alerts for student engagement
                </p>
              </div>
            </div>
            <AlertsCenter />
          </div>
        </main>
      </div>
    </div>
  )
}
