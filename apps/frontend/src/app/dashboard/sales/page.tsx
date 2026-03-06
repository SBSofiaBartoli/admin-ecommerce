"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSales, createSale, updateSaleStatus } from "@/api/sales";
import { Sale, SaleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SaleDetailModal from "./SaleDetailModal";

const statusLabels: Record<SaleStatus, string> = {
  PREPARATION: "En preparación",
  SHIPPED: "Enviado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const statusColors: Record<SaleStatus, string> = {
  PREPARATION: "bg-yellow-100 text-yellow-900 border border-yellow-200",
  SHIPPED: "bg-blue-100 text-blue-900 border border-blue-200",
  COMPLETED: "bg-green-100 text-green-900 border border-green-200",
  CANCELLED: "bg-red-100 text-red-900 border border-red-200",
};

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<Sale | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch {
      toast.error("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleGenerateSale() {
    setGenerating(true);
    try {
      await createSale();
      toast.success("Venta generada correctamente");
      void load();
    } catch {
      toast.error("Error al generar venta");
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpdateStatus(id: string, status: SaleStatus) {
    try {
      await updateSaleStatus(id, status);
      toast.success("Estado actualizado");
      void load();
    } catch {
      toast.error("Error al actualizar estado");
    }
  }

  const filtered = sales.filter((s) => {
    const matchSearch =
      s.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus ? s.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ventas</h1>
        <Button
          onClick={handleGenerateSale}
          disabled={generating}
          className="bg-gray-900 text-white"
        >
          {generating ? "Generando..." : "+ Generar venta"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por cliente u orden..."
            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-100 bg-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
        >
          <option value="">Todos los estados</option>
          <option value="PREPARATION">En preparación</option>
          <option value="SHIPPED">Enviado</option>
          <option value="COMPLETED">Completado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} venta{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-gray-500">Cargando ventas...</div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="px-4 py-4 text-left font-semibold text-gray-700">
                  Cliente
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-40">
                  Número de orden
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-36">
                  Estado
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-28">
                  Total
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-28">
                  Pago
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-32">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🛒</span>
                      <span className="font-medium">
                        No hay ventas para mostrar
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-b border-gray-200 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {sale.customer?.name ?? "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {sale.customer?.email ?? ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-medium text-gray-900">
                        {sale.orderNumber}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(sale.createdAt).toLocaleDateString("es-AR")}
                      </div>
                    </td>
                    <td className="px-8 py-3 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColors[sale.status]}`}
                      >
                        {statusLabels[sale.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          sale.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-900 border border-green-200"
                            : "bg-red-100 text-red-900 border border-red-200"
                        }`}
                      >
                        {sale.paymentStatus === "PAID" ? "Pagado" : "Fallido"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelected(sale);
                            setModalOpen(true);
                          }}
                        >
                          Gestionar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 text-sm border-t border-gray-300 bg-gray-100">
            <span className="text-gray-600">
              Página {page} de {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <SaleDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelected(undefined);
          }}
          sale={selected}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
