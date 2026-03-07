"use client";

import { usePathname } from "next/navigation";
import { Bell, Camera, Power } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { getProfile, uploadAvatar } from "@/api/profile";
import { toast } from "sonner";
import { useEffect } from "react";

const routeLabels: Record<string, string> = {
  "/dashboard": "Inicio",
  "/dashboard/categories": "Categorías",
  "/dashboard/products": "Productos",
  "/dashboard/sales": "Ventas",
};

export default function Topbar() {
  const pathname = usePathname();
  const current = routeLabels[pathname] ?? "Dashboard";
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getProfile()
      .then((data) => setAvatarUrl(data.avatarUrl))
      .catch(() => null);
  }, []);

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { avatarUrl } = await uploadAvatar(file);
      setAvatarUrl(avatarUrl);
    } catch {
      toast.error("Error al subir la imagen");
    }
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
      {/* Izquierda: logo + breadcrumb */}
      <div className="flex items-center gap-4">
        <Image
          src="/logo-nombre.png"
          alt="logo"
          width={100}
          height={28}
          className="h-7 w-auto"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="px-25 flex items-center gap-2 text-dm text-gray-500">
          <span>Inicio</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">{current}</span>
        </div>
      </div>

      {/* Derecha: bell + power + avatar */}
      <TooltipProvider>
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Notificaciones</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
              >
                <Power className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Cerrar sesión</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <label className="cursor-pointer relative group">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "A"
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </TooltipTrigger>
            <TooltipContent>Cambiar foto</TooltipContent>
          </Tooltip>

          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </TooltipProvider>
    </header>
  );
}
