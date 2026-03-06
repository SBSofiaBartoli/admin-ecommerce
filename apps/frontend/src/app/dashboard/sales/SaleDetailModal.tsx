"use client";

import { Sale, SaleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SaleDetailModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale;
  onUpdateStatus: (id: string, status: SaleStatus) => void;
}

const statusFlow: Record<SaleStatus, SaleStatus | null> = {
  PREPARATION: "SHIPPED",
  SHIPPED: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
};

const nextStatusLabel: Record<SaleStatus, string> = {
  PREPARATION: "Marcar como enviado",
  SHIPPED: "Completar pedido",
  COMPLETED: "",
  CANCELLED: "",
};

export default function SaleDetailModal({
  open,
  onClose,
  sale,
  onUpdateStatus,
}: SaleDetailModalProps) {
  const nextStatus = statusFlow[sale.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Orden {sale.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Estado actual</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                sale.status === "PREPARATION"
                  ? "bg-yellow-100 text-yellow-700"
                  : sale.status === "SHIPPED"
                    ? "bg-blue-100 text-blue-700"
                    : sale.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
              }`}
            >
              {sale.status === "PREPARATION"
                ? "En preparación"
                : sale.status === "SHIPPED"
                  ? "Enviado"
                  : sale.status === "COMPLETED"
                    ? "Completado"
                    : "Cancelado"}
            </span>
          </div>

          {/* CLIENTE */}
          <div className="border rounded-lg p-3 space-y-1">
            <p className="font-medium text-gray-700">Info del cliente</p>
            <p>{sale.customer?.name ?? "—"}</p>
            <p className="text-gray-400">{sale.customer?.email ?? "—"}</p>
          </div>

          {/* PAGO */}
          <div className="border rounded-lg p-3 space-y-1">
            <p className="font-medium text-gray-700">Info de pago</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado</span>
              <span
                className={
                  sale.paymentStatus === "PAID"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {sale.paymentStatus === "PAID" ? "Pagado" : "Fallido"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-medium">${sale.total.toFixed(2)}</span>
            </div>
            {sale.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-500">Método</span>
                <span>{sale.paymentMethod}</span>
              </div>
            )}
          </div>

          {/* HISTORIAL */}
          {sale.history && sale.history.length > 0 && (
            <div className="border rounded-lg p-3 space-y-2">
              <p className="font-medium text-gray-700">Historial</p>
              {sale.history.map((h) => (
                <div key={h.id} className="flex justify-between text-xs">
                  <span className="text-gray-500">{h.status}</span>
                  <span className="text-gray-400">
                    {new Date(h.createdAt).toLocaleDateString("es-AR")}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* FECHA */}
          <div className="flex justify-between text-gray-500">
            <span>Fecha de creación</span>
            <span>{new Date(sale.createdAt).toLocaleDateString("es-AR")}</span>
          </div>
        </div>

        {/* BOTON DE ACCION */}
        <div className="flex justify-between mt-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {nextStatus && (
            <Button
              className="bg-gray-900 text-white"
              onClick={() => {
                onUpdateStatus(sale.id, nextStatus);
                onClose();
              }}
            >
              {nextStatusLabel[sale.status]}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
