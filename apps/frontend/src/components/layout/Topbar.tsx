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
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-70 z-10">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Inicio</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{current}</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-gray-500" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
        <span className="text-sm font-medium text-gray-700">Admin</span>
      </div>
    </header>
  );
}
