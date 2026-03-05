"use client";

import { useEffect, useState } from "react";
import CategoryFormModal from "./CategoryFormModal";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Category } from "@/types";
import { deleteCategory, getCategories } from "@/api";

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
  const [page, setPage] = useState(1);

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
                <th className="px-4 py-3 text-center font-medium w-28">
                  Posición
                </th>
                <th className="px-4 py-3 text-center font-medium w-48">
                  Nombre
                </th>
                <th className="px-4 py-3 text-center font-medium w-30">
                  Subcategorías
                </th>
                <th className="px-4 py-3 text-center font-medium w-40">
                  Categoría padre
                </th>
                <th className="px-4 py-3 text-center font-medium w-32">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b last:border-0 hover:bg-muted/50"
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
                    {cat.children?.length ?? 0}
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
                        👁
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setModalOpen(true);
                        }}
                      >
                        ✏️
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
                        🗑
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
