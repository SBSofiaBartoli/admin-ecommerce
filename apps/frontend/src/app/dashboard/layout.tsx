"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
