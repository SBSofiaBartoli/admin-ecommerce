"use client";

import { Sale, SaleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Clock, CreditCard, MapPin, Truck, User } from "lucide-react";

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

const statusColors: Record<SaleStatus, string> = {
  PREPARATION: "bg-yellow-100 text-yellow-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<SaleStatus, string> = {
  PREPARATION: "En preparación",
  SHIPPED: "Enviado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export default function SaleDetailModal({
  open,
  onClose,
  sale,
  onUpdateStatus,
}: SaleDetailModalProps) {
  const [note, setNote] = useState("");
  const nextStatus = statusFlow[sale.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Truck className="w-5 h-5" />
            Gestionar Orden
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* ESTADO ACTUAL */}
          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
              <Truck className="w-4 h-4" />
              Estado Actual
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[sale.status]}`}
              >
                {statusLabels[sale.status]}
              </span>
              <span className="text-gray-400 text-xs">
                Orden #{sale.orderNumber}
              </span>
            </div>
          </div>

          {/* INFO CLIENTE + PAGO */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <User className="w-4 h-4" />
                Información del Cliente
              </div>
              <p className="font-medium">{sale.customer?.name ?? "—"}</p>
              <p className="text-gray-400">{sale.customer?.email ?? "—"}</p>
              <p className="text-gray-400 text-xs">ID: {sale.customerId}</p>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <CreditCard className="w-4 h-4" />
                Información de Pago
              </div>
              {sale.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Método</span>
                  <span>{sale.paymentMethod}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Estado</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    sale.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {sale.paymentStatus === "PAID" ? "Pagado" : "Fallido"}
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-500">Total</span>
                <span>${sale.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ENVIO */}
          {sale.shipment && (
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <MapPin className="w-4 h-4" />
                Información de Envío
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transportista</span>
                <span>{sale.shipment.carrier}</span>
              </div>
              {sale.shipment.tracking && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tracking</span>
                  <span>{sale.shipment.tracking}</span>
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL */}
          {sale.history && sale.history.length > 0 && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-gray-700">
                <Clock className="w-4 h-4" />
                Historial de Modificaciones
              </div>
              {sale.history.map((h) => (
                <div key={h.id} className="flex items-start gap-3 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColors[h.status]}`}
                  >
                    {statusLabels[h.status]}
                  </span>
                  <div>
                    {h.note && <p className="text-gray-600">{h.note}</p>}
                    <p className="text-gray-400">
                      {new Date(h.createdAt).toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NOTAS */}
          {nextStatus && (
            <div className="space-y-1">
              <label className="text-gray-600 font-medium">
                Notas para el cambio de estado (opcional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Agregar notas sobre el cambio de estado..."
                className="w-full rounded-lg border px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                rows={3}
              />
            </div>
          )}
        </div>

        {/* ACCIONES */}
        <div className="flex justify-between mt-2 pt-2 border-t">
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
