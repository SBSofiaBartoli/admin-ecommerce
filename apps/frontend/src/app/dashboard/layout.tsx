"use client";

import { ReactNode } from "react";
import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useAuthGuard();

  return <div className="min-h-screen bg-muted">{children}</div>;
}
