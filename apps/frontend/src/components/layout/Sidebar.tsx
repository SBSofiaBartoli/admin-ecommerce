"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Tag,
  Package,
  ShoppingCart,
  LogOut,
  Users,
  Bookmark,
  BadgePercent,
  Gift,
  BarChart2,
  Star,
  Bell,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "@/api";

const navItems = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: LayoutDashboard,
    available: true,
  },
  {
    href: "/dashboard/categories",
    label: "Categorías",
    icon: Tag,
    available: true,
  },
  {
    href: "/dashboard/products",
    label: "Productos",
    icon: Package,
    available: true,
  },
  {
    href: "/dashboard/sales",
    label: "Ventas",
    icon: ShoppingCart,
    available: true,
  },
  {
    href: "/dashboard/customers",
    label: "Clientes",
    icon: Users,
    available: true,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Marcas",
    icon: Bookmark,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Descuentos",
    icon: BadgePercent,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Puntos de Lealtad",
    icon: Gift,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Membresías",
    icon: Star,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Estadísticas",
    icon: BarChart2,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Notificaciones",
    icon: Bell,
    available: false,
  },
  {
    href: "/dashboard/coming-soon",
    label: "Configuración",
    icon: Settings,
    available: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-50 flex flex-col shadow-sm">
      <div className="flex items-center gap-3"></div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          if (!item.available) {
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 w-full transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                isActive
                  ? "bg-gray-200 text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
