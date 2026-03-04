"use client";

import { useEffect, useState } from "react";
import { deleteCategory, getCategories } from "../../../api/categories";
import type { Category } from "../../../types/category";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { Button } from "@/components/ui/button";

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

    try {
      setDeleting(true);
      setDeletingId(deleteId);
      await deleteCategory(deleteId);
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la categoría");
    } finally {
      setDeleting(false);
      setDeletingId(null);
      setIsConfirmOpen(false);
      setDeleteId(null);
      setSelectedCategory(undefined);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header simple (sin abstraer aún) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
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

      {/* Estados */}
      {loading && <div className="text-gray-500">Cargando categorías...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {!loading && !error && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2">Nombre</th>
                <th className="text-left px-4 py-2">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{cat.name}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {cat.description ?? "-"}
                  </td>
                  {/* COLUMNA DE ACCIONES */}
                  <td>
                    {/* EDITAR */}
                    <Button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Button>
                    {/* ELIMINAR */}
                    <Button
                      variant="destructive"
                      disabled={deletingId === cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setDeleteId(cat.id);
                        setIsConfirmOpen(true);
                      }}
                    >
                      {deletingId === cat.id ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CategoryFormModal
        key={selectedCategory?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadCategories}
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
