"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Pencil, Search, Trash2, X } from "lucide-react";
import ProductFormModal from "./ProductFormModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Product | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteId);
      toast.success("Producto eliminado");
      void load();
    } catch {
      toast.error("Error al eliminar producto");
    } finally {
      setDeleting(false);
      setIsConfirmOpen(false);
      setDeleteId(null);
      setSelected(undefined);
    }
  }

  function clearFilters() {
    setSearch("");
    setFilterCategory("");
    setFilterGender("");
    setPage(1);
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory
      ? p.categoryId === filterCategory
      : true;
    const matchGender = filterGender ? p.gender === filterGender : true;
    return matchSearch && matchCategory && matchGender;
  });

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const hasFilters = search || filterCategory || filterGender;

  const subcategories = categories.filter((c) => c.parentId !== null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm">
            Importar productos
          </Button>
          <Button
            onClick={() => {
              setSelected(undefined);
              setModalOpen(true);
            }}
            className="bg-gray-900 text-white text-sm"
          >
            + Nuevo producto
          </Button>
        </div>
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
            placeholder="Buscar por nombre..."
            className="pl-9 pr-4 py-2 rounded-lg border text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <option value="">Todas las categorías</option>
          {subcategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={filterGender}
          onChange={(e) => {
            setFilterGender(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <option value="">Todos los géneros</option>
          <option value="Hombre">Hombre</option>
          <option value="Mujer">Mujer</option>
          <option value="Unisex">Unisex</option>
          <option value="Niño">Niño</option>
        </select>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 gap-1"
          >
            <X className="w-4 h-4" /> Limpiar
          </Button>
        )}
        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-gray-500">Cargando productos...</div>
      ) : (
        <div className="border rounded-xl border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-48">
                  Nombre
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-36">
                  Categoría
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-24">
                  Marca
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-24">
                  Género
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
                    colSpan={5}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📦</span>
                      <span className="font-medium">
                        No hay productos para mostrar
                      </span>
                      {hasFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                      {product.description && (
                        <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                          {product.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {product.category?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {product.brand ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {product.gender ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelected(product);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelected(product);
                            setDeleteId(product.id);
                            setIsConfirmOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 text-sm border-t bg-gray-50">
            <span className="text-gray-500">
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

      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelected(undefined);
        }}
        onSuccess={() => {
          void load();
          setModalOpen(false);
          setSelected(undefined);
        }}
        product={selected}
        categories={categories}
      />

      <ConfirmDialog
        open={isConfirmOpen}
        title="Eliminar producto"
        description={`¿Estás seguro que querés eliminar "${selected?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
          setSelected(undefined);
        }}
      />
    </div>
  );
}
