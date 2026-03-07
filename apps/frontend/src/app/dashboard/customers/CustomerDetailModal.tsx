"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Customer } from "@/types/customer";
import { ShoppingCart, Mail, User } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  customer: Customer;
}

const statusColors: Record<string, string> = {
  PREPARATION: "bg-yellow-100 text-yellow-900 border border-yellow-200",
  SHIPPED: "bg-blue-100 text-blue-900 border border-blue-200",
  COMPLETED: "bg-green-100 text-green-900 border border-green-200",
  CANCELLED: "bg-red-100 text-red-900 border border-red-200",
};

const statusLabels: Record<string, string> = {
  PREPARATION: "En preparación",
  SHIPPED: "Enviado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export default function CustomerDetailModal({
  open,
  onClose,
  customer,
}: Props) {
  const totalSpent = customer.sales?.reduce((sum, s) => sum + s.total, 0) ?? 0;
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            Detalle del Cliente
          </DialogTitle>
          <DialogDescription className="sr-only">
            Información y historial de compras del cliente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info cliente */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{customer.name}</p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {customer.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                {customer._count?.sales ?? customer.sales?.length ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Compras realizadas</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total gastado</p>
            </div>
          </div>

          {/* Historial de ventas */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center gap-2 font-semibold text-gray-700 text-sm">
              <ShoppingCart className="w-4 h-4" />
              Historial de compras
            </div>
            {!customer.sales?.length ? (
              <p className="text-sm text-gray-400 text-center py-2">
                Sin compras registradas
              </p>
            ) : (
              customer.sales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100"
                >
                  <div>
                    <p className="text-sm font-medium">{sale.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-green-600">
                      ${sale.total.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-lg font-medium ${statusColors[sale.status]}`}
                    >
                      {statusLabels[sale.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
