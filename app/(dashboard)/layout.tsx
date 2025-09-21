import type React from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
  analytics,
  settings,
}: {
  children: React.ReactNode;
  analytics?: React.ReactNode;
  settings?: React.ReactNode;
}) {
  console.log("Dashboard layout rendered");

  return (
    <div className="min-h-screen bg-pattern-grid">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          {children}
          {analytics}
          {settings}
        </main>
      </div>
    </div>
  );
}
