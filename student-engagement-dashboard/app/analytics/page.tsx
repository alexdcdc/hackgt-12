import { AuthGuard } from "@/components/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { EngagementCharts } from "@/components/engagement-charts";
import { AnalyticsFilters } from "@/components/analytics-filters";

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Analytics Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Comprehensive engagement analytics and trend visualization
                  </p>
                </div>
              </div>
              <AnalyticsFilters />
              <EngagementCharts />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
