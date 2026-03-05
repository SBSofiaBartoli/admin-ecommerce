"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Inicio",
  "/dashboard/categories": "Categorías",
  "/dashboard/products": "Productos",
  "/dashboard/sales": "Ventas",
};

export default function Topbar() {
  const pathname = usePathname();
  const current = routeLabels[pathname] ?? "Dashboard";

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Inicio</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{current}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
