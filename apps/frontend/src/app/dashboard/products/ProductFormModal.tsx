"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Product, Category, ProductStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
  categories: Category[];
}

export default function ProductFormModal({
  open,
  onClose,
  onSuccess,
  product,
  categories,
}: ProductFormModalProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [gender, setGender] = useState(product?.gender ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<ProductStatus>(
    product?.status ?? "ACTIVE",
  );

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setDescription(product?.description ?? "");
      setBrand(product?.brand ?? "");
      setGender(product?.gender ?? "");
      setCategoryId(product?.categoryId ?? "");
      setError("");
      setStatus(product?.status ?? "ACTIVE");
    }
  }, [open, product]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        name,
        description: description || undefined,
        brand: brand || undefined,
        gender: gender || undefined,
        categoryId,
        status,
      };
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("already exists") || message.includes("unique")) {
        setError("Ya existe un producto con ese nombre");
      } else {
        setError("Error al guardar el producto");
      }
    } finally {
      setLoading(false);
    }
  }

  const subcategories = categories.filter((c) => c.parentId !== null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
          <DialogDescription>Completá los datos del producto</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección información básica */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Información básica</h3>

            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
                className="border-gray-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción detallada del producto"
                className="border-gray-200 resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: Nike"
                  className="border-gray-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender">Género *</Label>
                <Select
                  value={gender || "none"}
                  onValueChange={(v) => setGender(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Seleccioná un género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    <SelectItem value="Hombre">Hombre</SelectItem>
                    <SelectItem value="Mujer">Mujer</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                    <SelectItem value="Niño">Niño</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sección categoría y estado */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Categoría y estado</h3>
            <div className="grid grid-cols-2 gap-4"></div>
            <div className="space-y-1.5">
              <Label>Categoría *</Label>
              <Select
                value={categoryId || "none"}
                onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Seleccioná una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Seleccioná una categoría</SelectItem>
                  {subcategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} {cat.parent ? `(${cat.parent.name})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as ProductStatus)}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                  <SelectItem value="DRAFT">Borrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-700"
            >
              {loading
                ? product
                  ? "Guardando..."
                  : "Creando..."
                : product
                  ? "Guardar cambios"
                  : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
