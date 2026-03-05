"use client";

import React, { useEffect, useState } from "react";
import CategoryFormModal from "./CategoryFormModal";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Category } from "@/types";
import { deleteCategory, getCategories } from "@/api";
import { Eye, Pencil, Trash2 } from "lucide-react";

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

  function toggleExpand(id: string) {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categorías</h1>
          </div>

          <Button
            onClick={() => {
              setSelectedCategory(undefined);
              setModalOpen(true);
            }}
            className="px-4 py-2 rounded-md bg-black text-white text-sm"
          >
            + Nueva categoría
          </Button>
        </div>

        {/* Buscador */}
        <div className="max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* TABLA */}
      {loading && <div className="text-gray-500">Cargando categorías...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!loading && !error && (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th
                  className="px-4 py-3 text-center font-medium w-28"
                  onClick={() => {
                    setSortField("position");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Posición
                </th>
                <th
                  className="px-4 py-3 text-center font-medium w-48"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Nombre
                </th>
                <th
                  className="px-4 py-3 text-center font-medium w-30"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Subcategorías
                </th>
                <th
                  className="px-4 py-3 text-center font-medium w-40"
                  onClick={() => {
                    setSortField("name");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  Categoría padre
                </th>
                <th className="px-4 py-3 text-center font-medium w-32">
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
                      className="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
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
                          {(cat.children?.length ?? 0) > 0 && (
                            <button
                              onClick={() => toggleExpand(cat.id)}
                              className="text-xs"
                            >
                              {expanded.includes(cat.id) ? "▼" : "▶"}
                            </button>
                          )}
                          {cat.children?.length ?? 0}
                        </div>
                      </td>

                      {/* Categoría padre */}
                      <td className="px-4 py-3 text-center">
                        {cat.parent ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
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
                      cat.children?.map((child) => (
                        <tr key={child.id} className="bg-gray-50 border-b">
                          <td></td>
                          <td className="px-4 py-2 text-sm text-gray-600 pl-10">
                            └ {child.name}
                          </td>
                          <td className="text-center text-xs text-muted-foreground">
                            0
                          </td>
                          <td className="text-center">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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
          <div className="flex items-center justify-between px-4 py-3 text-sm border-t">
            <span className="text-muted-foreground">Página {page}</span>

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
