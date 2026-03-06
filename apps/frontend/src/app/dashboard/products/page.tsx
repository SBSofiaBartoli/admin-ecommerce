"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Pencil, Trash2 } from "lucide-react";
import ProductFormModal from "./ProductFormModal";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button
          onClick={() => {
            setSelected(undefined);
            setModalOpen(true);
          }}
          className="bg-black text-white"
        >
          + Nuevo producto
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

      {/* Tabla */}
      {loading ? (
        <div className="text-gray-500">Cargando productos...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium w-48">Nombre</th>
                <th className="px-4 py-3 text-center font-medium w-36">
                  Categoría
                </th>
                <th className="px-4 py-3 text-center font-medium w-24">
                  Marca
                </th>
                <th className="px-4 py-3 text-center font-medium w-24">
                  Género
                </th>
                <th className="px-4 py-3 text-center font-medium w-32">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr
                  key={product.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {product.category?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
                    {product.brand ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {product.variants && product.variants.length > 0
                      ? `$${product.variants[0].price.toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">
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
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No hay productos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 text-sm border-t">
            <span className="text-muted-foreground">
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
