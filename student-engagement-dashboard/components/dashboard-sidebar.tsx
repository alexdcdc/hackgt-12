"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  BookOpen,
  Mail,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Home,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
  { name: "Topics", href: "/topics", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "Email Center", href: "/emails", icon: Mail },
];

const quickStats = [
  { name: "Active Students", value: "127", change: "+12%", trend: "up" },
  { name: "Avg Engagement", value: "78%", change: "+5%", trend: "up" },
  { name: "At Risk", value: "8", change: "-2", trend: "down" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">
              EduAnalytics
            </h2>
            <p className="text-xs text-sidebar-foreground/60">v2.1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const current = pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={current ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 text-sidebar-foreground cursor-pointer",
                current && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => {
                router.push(item.href);
              }}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-sidebar-foreground">
            Quick Stats
          </h3>
          {quickStats.map((stat) => (
            <div key={stat.name} className="flex items-center justify-between">
              <div>
                <p className="text-xs text-sidebar-foreground/60">
                  {stat.name}
                </p>
                <p className="text-sm font-medium text-sidebar-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "text-xs px-2 py-1 rounded",
                  stat.trend === "up"
                    ? "text-green-400 bg-green-400/10"
                    : "text-red-400 bg-red-400/10"
                )}
              >
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
