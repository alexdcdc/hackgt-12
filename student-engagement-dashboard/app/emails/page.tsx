import { AuthGuard } from "@/components/auth-guard";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { EmailCenter } from "@/components/email-center";
import { EmailTemplates } from "@/components/email-templates";

export default function EmailsPage() {
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
                    Email Center
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Automated email communication and meeting scheduling
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <EmailCenter />
                </div>
                <div>
                  <EmailTemplates />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
