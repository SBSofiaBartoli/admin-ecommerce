"use client";

import { useEffect, useState } from "react";
import { createCategory, getCategoriesForSelect, updateCategory } from "@/api";
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
import { Category } from "@/types/category";

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
  category?: Category;
}

export default function CategoryFormModal({
  open,
  onClose,
  onSuccess,
  category,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [parentId, setParentId] = useState(category?.parentId ?? "");
  const [parentOptions, setParentOptions] = useState<
    Pick<Category, "id" | "name" | "position">[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedParent = parentOptions.find((p) => p.id === parentId);

  useEffect(() => {
    async function loadParents() {
      try {
        const data = await getCategoriesForSelect();
        const filtered = data.filter((c) => c.id !== category?.id);
        setParentOptions(filtered);
      } catch {
        console.error("Error cargando categorías padre");
      }
    }
    if (open) {
      setName(category?.name ?? "");
      setParentId(category?.parentId ?? "");
      void loadParents();
    }
  }, [open, category]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        name,
        parentId: parentId || undefined,
        position: selectedParent?.position ?? 0,
      };
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);
      onSuccess(result);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (
        message.includes(
          "A category with that name already exists in this parent category",
        )
      ) {
        setError(
          "Ya existe una categoría con ese nombre en esta categoría padre",
        );
      } else {
        setError("Error al guardar la categoría");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>
          <DialogDescription>
            Completá los datos de la categoría
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la categoría"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="parentId">Categoría Padre</Label>
            <select
              id="parentId"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Principal (sin padre)</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="position">Posición</Label>
            <Input
              id="position"
              type="number"
              value={
                parentOptions.find((p) => p.id === parentId)?.position ?? 0
              }
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
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
                ? category
                  ? "Guardando..."
                  : "Creando..."
                : category
                  ? "Guardar cambios"
                  : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
