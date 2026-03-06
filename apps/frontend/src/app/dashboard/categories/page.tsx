"use client";

import React, { useEffect, useState } from "react";
import CategoryFormModal from "./CategoryFormModal";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Category } from "@/types";
import { deleteCategory, getCategories, getCategoryChildren } from "@/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SearchInput from "@/components/shared/SearchInput";
import TablePagination from "@/components/shared/TablePagination";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "position">("position");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<string, Category[]>>(
    {},
  );

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      setError("Error cargando categorías");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    const prevCategories = categories;

    setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    setDeletingId(deleteId);
    setDeleting(true);

    try {
      await deleteCategory(deleteId);
    } catch {
      setCategories(prevCategories);
      alert("Error al eliminar la categoría");
    } finally {
      setDeleting(false);
      setDeletingId(null);
      setIsConfirmOpen(false);
      setDeleteId(null);
      setSelectedCategory(undefined);
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const fieldA = a[sortField] ?? "";
    const fieldB = b[sortField] ?? "";

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const pageSize = 10;
  const paginated = sortedCategories.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  const totalPages = Math.ceil(sortedCategories.length / pageSize);

  async function toggleExpand(id: string) {
    if (expanded.includes(id)) {
      setExpanded((prev) => prev.filter((i) => i !== id));
    } else {
      if (!childrenMap[id]) {
        try {
          const children = await getCategoryChildren(id);
          setChildrenMap((prev) => ({ ...prev, [id]: children }));
        } catch {
          toast.error("Error al cargar subcategorías");
        }
      }
      setExpanded((prev) => [...prev, id]);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Categorías</h1>
          </div>

          <Button
            onClick={() => {
              setSelectedCategory(undefined);
              setModalOpen(true);
            }}
            className="px-7 py-5 rounded-lg bg-gray-900 text-white text-lg font-medium hover:bg-gray-700 transition-colors"
          >
            + Nueva categoría
          </Button>
        </div>

        {/* Buscador */}
        <div className="max-w-sm">
          <SearchInput
            value={search}
            onChange={(v) => setSearch(v)}
            placeholder="Buscar por nombre..."
          />
        </div>
      </div>

      {/* TABLA */}
      {loading && <div className="text-gray-500">Cargando categorías...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!loading && !error && (
        <div className="border rounded-xl border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th
                  className="px-4 py-4 text-center font-semibold text-gray-700 w-28"
                  onClick={() => {
                    setSortField("position");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Posición
                </th>
                <th
                  className="px-4 py-4 text-center font-semibold text-gray-700 w-48"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Nombre
                </th>
                <th
                  className="px-4 py-4 text-center font-semibold text-gray-700 w-30"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Subcategorías
                </th>
                <th
                  className="px-4 py-4 text-center font-semibold text-gray-700 w-40"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Categoría padre
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-32">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay categorías para mostrar
                  </td>
                </tr>
              ) : (
                paginated.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr
                      key={cat.id}
                      className="border-b border-gray-200 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Posición */}
                      <td className="px-4 py-3 text-center text-muted-foreground">
                        {cat.position !== null && cat.position !== undefined
                          ? cat.position
                          : "—"}
                      </td>

                      {/* Nombre */}
                      <td className="px-4 py-3 text-center font-medium w-48">
                        {cat.name}
                      </td>

                      {/* Subcategorías */}
                      <td className="px-4 py-3 text-center text-muted-foreground w-30">
                        <div className="flex items-center gap-2 justify-center">
                          {(cat._count?.children ?? 0) > 0 && (
                            <button
                              onClick={() => toggleExpand(cat.id)}
                              className="text-xs cursor-pointer"
                            >
                              {expanded.includes(cat.id) ? "▼" : "▶"}
                            </button>
                          )}
                          {cat._count?.children ?? 0} subcategorías
                        </div>
                      </td>

                      {/* Categoría padre */}
                      <td className="px-4 py-3 text-center">
                        {cat.parent ? (
                          <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-900 border border-green-200">
                            Principal
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCategory(cat);
                              setModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={deletingId === cat.id}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setDeleteId(cat.id);
                              setIsConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    {expanded.includes(cat.id) &&
                      (childrenMap[cat.id] ?? []).map((child) => (
                        <tr
                          key={child.id}
                          className="bg-gray-50/60 border-b border-gray-100"
                        >
                          <td className="px-4 py-3 text-center text-muted-foreground text-xs">
                            {child.position ?? "—"}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-center font-medium">
                            └ {child.name}
                          </td>
                          <td className="text-center text-xs text-muted-foreground">
                            0
                          </td>
                          <td className="text-center">
                            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                              {cat.name}
                            </span>
                          </td>
                          <td></td>
                        </tr>
                      ))}
                  </React.Fragment>
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
      <CategoryFormModal
        key={selectedCategory?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          void loadCategories();
          setModalOpen(false);
          setSelectedCategory(undefined);
        }}
        category={selectedCategory}
      />
      <ConfirmDialog
        open={isConfirmOpen}
        title="Eliminar categoría"
        description={`¿Estás seguro que querés eliminar "${selectedCategory?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
          setSelectedCategory(undefined);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
