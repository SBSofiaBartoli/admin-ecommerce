"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Topbar from "@/components/layout/Topbar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Topbar />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <body className="min-h-screen bg-background">
            {children}
            <Toaster richColors position="top-right" />
          </body>
          {children}
        </main>
      </div>
    </div>
  );
}
