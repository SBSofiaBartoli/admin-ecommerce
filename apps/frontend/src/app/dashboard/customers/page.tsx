"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import TablePagination from "@/components/shared/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import CustomerDetailModal from "./CustomerDetailModal";
import { getCustomers } from "@/api/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Customer | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .catch(() => toast.error("Error al cargar clientes"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-bold">Clientes</h1>
        </div>
        <span className="text-sm text-gray-500">
          {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Buscar por nombre o email..."
        width="w-96"
      />

      {loading ? (
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="px-8 py-4 text-left font-semibold text-gray-700">
                  Cliente
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Compras
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Total gastado
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-10 h-10 text-gray-300" />
                      <span className="font-medium">
                        No hay clientes para mostrar
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((customer) => {
                  const totalSpent =
                    customer.sales?.reduce((sum, s) => sum + s.total, 0) ?? 0;
                  const initials = customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-gray-200 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-8 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <span className="font-medium text-gray-900">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-sm font-semibold">
                          {customer._count?.sales ?? 0} compras
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-green-600">
                        ${totalSpent.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelected(customer);
                            setModalOpen(true);
                          }}
                        >
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  );
                })
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
        <CustomerDetailModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelected(undefined);
          }}
          customer={selected}
        />
      )}
    </div>
  );
}
