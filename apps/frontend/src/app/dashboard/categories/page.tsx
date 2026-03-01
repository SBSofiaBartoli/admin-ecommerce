"use client";

import { useEffect, useState } from "react";
import { getCategories } from "../../../api/categories";
import type { Category } from "../../../types/category";
import CreateCategoryModal from "./CreateCategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header simple (sin abstraer aún) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <button
          onClick={() => setOpen(true)}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <CreateCategoryModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={loadCategories}
      />
    </div>
  );
}
