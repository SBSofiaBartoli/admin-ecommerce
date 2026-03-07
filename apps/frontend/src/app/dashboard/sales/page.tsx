"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getSales, createSale, updateSaleStatus } from "@/api/sales";
import { Sale, SaleStatus } from "@/types";
import { Button } from "@/components/ui/button";
import SaleDetailModal from "./SaleDetailModal";
import SearchInput from "@/components/shared/SearchInput";
import TablePagination from "@/components/shared/TablePagination";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  async function handleUpdateStatus(
    id: string,
    status: SaleStatus,
    note?: string,
  ) {
    try {
      await updateSaleStatus(id, status, note);
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
        <h1 className="text-4xl font-bold">Ventas</h1>
        <Button
          onClick={handleGenerateSale}
          disabled={generating}
          className="px-7 py-5 rounded-lg bg-gray-900 text-white text-lg font-medium hover:bg-gray-700 transition-colors"
        >
          {generating ? "Generando..." : "+ Generar venta"}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar por cliente u orden..."
          width="w-96"
        />

        <div className="ml-auto flex items-center gap-6">
          <span className="text-sm text-gray-500">
            {filtered.length} venta{filtered.length !== 1 ? "s" : ""}
          </span>
          <Select
            value={filterStatus || "all"}
            onValueChange={(v) => {
              setFilterStatus(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48 border-gray-200">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="PREPARATION">En preparación</SelectItem>
              <SelectItem value="SHIPPED">Enviado</SelectItem>
              <SelectItem value="COMPLETED">Completado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-28 rounded-lg" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="px-8 py-4 text-left font-semibold text-gray-700 w-64">
                  Cliente
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-48">
                  Número de orden
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-40">
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
                    <td className="px-8 py-3 max-w-xs">
                      <div className="font-medium text-gray-900">
                        {sale.customer?.name ?? "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {sale.customer?.email ?? ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="font-medium text-gray-900 whitespace-nowrap">
                        {sale.orderNumber}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(sale.createdAt).toLocaleDateString("es-AR")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge
                        status={sale.status}
                        labels={statusLabels}
                        colors={statusColors}
                      />
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge
                        status={sale.paymentStatus}
                        labels={{ PAID: "Pagado", FAILED: "Fallido" }}
                        colors={{
                          PAID: "bg-green-100 text-green-900 border border-green-200",
                          FAILED:
                            "bg-red-100 text-red-900 border border-red-200",
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              Ver detalle y gestionar estado
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
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
