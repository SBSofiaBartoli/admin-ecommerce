"use client";

import { useEffect, useState } from "react";
import { deleteCategory, getCategories } from "../../../api/categories";
import type { Category } from "../../../types/category";
import CategoryFormModal from "./CategoryFormModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

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

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Estás seguro que querés eliminar esta categoría?",
    );
    if (!confirmed) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar la categoría");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header simple (sin abstraer aún) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button
          onClick={() => {
            setSelectedCategory(undefined);
            setModalOpen(true);
          }}
          className="px-4 py-2 rounded-md bg-black text-white text-sm"
        >
          + Nueva categoría
        </button>
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
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    {/* ELIMINAR */}
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
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
    </div>
  );
}
