"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getProducts, deleteProduct } from "@/api/products";
import { getCategories } from "@/api/categories";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Pencil, Trash2, X } from "lucide-react";
import ProductFormModal from "./ProductFormModal";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();

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

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setSelected(undefined);
      setModalOpen(true);
    }
  }, [searchParams]);

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
      <div className="flex items-center gap-3">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Buscar por nombre..."
          width="w-72"
        />
        <div className="ml-auto flex items-center gap-2">
          <Select
            value={filterCategory || "all"}
            onValueChange={(v) => {
              setFilterCategory(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48 border-gray-200">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {subcategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterGender}
            onValueChange={(v) => {
              setFilterGender(v === "all" ? "" : v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44 border-gray-200">
              <SelectValue placeholder="Todos los géneros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los géneros</SelectItem>
              <SelectItem value="Hombre">Hombre</SelectItem>
              <SelectItem value="Mujer">Mujer</SelectItem>
              <SelectItem value="Unisex">Unisex</SelectItem>
              <SelectItem value="Niño">Niño</SelectItem>
            </SelectContent>
          </Select>
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
        </div>
        <p className="text-sm text-gray-400">
          Mostrando {Math.min(page * pageSize, filtered.length)} de{" "}
          {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="rounded-xl border border-gray-100 overflow-hidden bg-white shadow-sm p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-72" />
              </div>
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-xl border-gray-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="px-8 py-4 text-left font-semibold text-gray-700 w-16">
                  Foto
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-48">
                  Nombre
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-36">
                  Categoría
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-24">
                  Marca
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-28">
                  Stock total
                </th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-24">
                  Estado
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
                    colSpan={7}
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
                paginated.map((product) => {
                  const totalStock =
                    product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
                  const firstImage = product.images?.[0]?.url;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-8 py-3">
                        {firstImage ? (
                          <Image
                            src={firstImage}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                            📦
                          </div>
                        )}
                      </td>
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
                        <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          {product.category?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {product.brand ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {totalStock} unidades
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge
                          status={product.status}
                          labels={{
                            ACTIVE: "Activo",
                            INACTIVE: "Inactivo",
                            DRAFT: "Borrador",
                          }}
                          colors={{
                            ACTIVE:
                              "bg-green-100 text-green-900 border border-green-200",
                            INACTIVE:
                              "bg-gray-100 text-gray-600 border border-gray-200",
                            DRAFT:
                              "bg-yellow-100 text-yellow-900 border border-yellow-200",
                          }}
                        />
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
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setSelected(product);
                              setDeleteId(product.id);
                              setIsConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
