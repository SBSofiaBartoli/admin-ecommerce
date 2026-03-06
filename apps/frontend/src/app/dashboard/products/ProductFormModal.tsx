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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción opcional"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Nike"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="gender">Género</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">Sin especificar</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
                <option value="Unisex">Unisex</option>
                <option value="Niño">Niño</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="DRAFT">Borrador</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="categoryId">Categoría *</Label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm"
                required
              >
                <option value="">Seleccioná una categoría</option>
                {subcategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.parent ? `(${cat.parent.name})` : ""}
                  </option>
                ))}
              </select>
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
            <Button type="submit" disabled={loading}>
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
