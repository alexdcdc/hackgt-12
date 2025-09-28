import { AuthGuard } from "@/components/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { TopicAnalytics } from "@/components/topic-analytics";
import { TopicFilters } from "@/components/topic-filters";

export default function TopicsPage() {
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
                    Topic Analytics
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Analyze engagement and confusion patterns across subjects
                    and topics
                  </p>
                </div>
              </div>
              <TopicFilters />
              <TopicAnalytics />
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
