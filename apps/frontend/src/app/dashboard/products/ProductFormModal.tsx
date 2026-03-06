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
import { PlusCircle, Trash2, ImagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormOption {
  name: string;
  values: string[];
}

interface ProductVariantRow {
  combination: string[];
  price: string;
  sku: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
  categories: Category[];
}

function generateVariants(options: FormOption[]): ProductVariantRow[] {
  if (options.length === 0 || options.every((o) => o.values.length === 0))
    return [];

  const filledOptions = options.filter((o) => o.values.length > 0);
  const combinations: string[][] = filledOptions.reduce<string[][]>(
    (acc, option) => {
      if (acc.length === 0) return option.values.map((v) => [v]);
      return acc.flatMap((combo) => option.values.map((v) => [...combo, v]));
    },
    [],
  );
  return combinations.map((combo) => ({
    combination: combo,
    price: "",
    sku: "",
  }));
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
  const [options, setOptions] = useState<FormOption[]>([]);
  const [variants, setVariants] = useState<ProductVariantRow[]>([]);

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setDescription(product?.description ?? "");
      setBrand(product?.brand ?? "");
      setGender(product?.gender ?? "");
      setCategoryId(product?.categoryId ?? "");
      setError("");
      setStatus(product?.status ?? "ACTIVE");
      setOptions([]);
      setVariants([]);
    }
  }, [open, product]);

  useEffect(() => {
    setVariants(generateVariants(options));
  }, [options]);

  function addOption() {
    setOptions((prev) => [...prev, { name: "", values: [] }]);
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateOptionName(index: number, value: string) {
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, name: value } : o)),
    );
  }

  function addValue(optionIndex: number, value: string) {
    if (!value.trim()) return;
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex && !o.values.includes(value)
          ? { ...o, values: [...o.values, value] }
          : o,
      ),
    );
  }

  function removeValue(optionIndex: number, value: string) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex
          ? { ...o, values: o.values.filter((v) => v !== value) }
          : o,
      ),
    );
  }

  function updateVariant(index: number, field: "price" | "sku", value: string) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || categoryId === "none") {
      setError("Seleccioná una categoría");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const variantsData = variants.map((v) => ({
        combination: v.combination,
        price: parseFloat(v.price) || 0,
        sku: v.sku || undefined,
        stock: 0,
      }));

      const data = {
        name,
        description: description || undefined,
        brand: brand || undefined,
        gender: gender || undefined,
        categoryId,
        status,
        variants: variantsData.length > 0 ? variantsData : undefined,
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección información básica */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Información básica</h3>

            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre del Producto*</Label>
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

          {/* Imágenes — UI lista para Cloudinary */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">
              Imágenes del Producto
            </h3>
            <div className="space-y-1.5">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                Subir Imágenes
              </button>
              <p className="text-xs text-gray-400">Próximamente disponible</p>
            </div>
          </div>

          {/* Sección categoría y estado */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">Categoría y estado</h3>
            <div className="grid grid-cols-2 gap-4">
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
                    <SelectItem value="none">
                      Seleccioná una categoría
                    </SelectItem>
                    {subcategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} {cat.parent ? `(${cat.parent.name})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

          {/* Opciones del producto */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-700">
                  Opciones del Producto
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Definí las características que tendrán variaciones (ej: Color,
                  Talla, Material)
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addOption}
                className="gap-1 text-gray-600"
              >
                <PlusCircle className="w-4 h-4" />
                Agregar Opción
              </Button>
            </div>

            {options.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">
                No hay opciones definidas
              </p>
            )}

            {options.map((option, optIndex) => (
              <OptionRow
                key={optIndex}
                option={option}
                onNameChange={(v) => updateOptionName(optIndex, v)}
                onAddValue={(v) => addValue(optIndex, v)}
                onRemoveValue={(v) => removeValue(optIndex, v)}
                onRemove={() => removeOption(optIndex)}
              />
            ))}
          </div>

          {/* Variantes generadas */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">
                Variantes del Producto
              </h3>
              <span className="text-xs text-gray-400">SKU Único</span>
            </div>

            {variants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Definí opciones de producto para generar variantes
                automáticamente.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-2 text-xs text-gray-400 font-medium">
                  <span className="col-span-5">Variante</span>
                  <span className="col-span-4">Precio *</span>
                  <span className="col-span-3">SKU</span>
                </div>
                {variants.map((variant, vIndex) => (
                  <div
                    key={vIndex}
                    className="grid grid-cols-12 gap-2 items-center px-2 py-1.5 rounded-lg bg-gray-50"
                  >
                    <div className="col-span-5 flex flex-wrap gap-1">
                      {variant.combination.map((val) => (
                        <Badge
                          key={val}
                          variant="outline"
                          className="text-xs bg-white border-gray-200"
                        >
                          {val}
                        </Badge>
                      ))}
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(vIndex, "price", e.target.value)
                        }
                        className="border-gray-200 h-8 text-sm"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        placeholder="SKU-001"
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(vIndex, "sku", e.target.value)
                        }
                        className="border-gray-200 h-8 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

// Componente separado para cada opción
interface OptionRowProps {
  option: FormOption;
  onNameChange: (v: string) => void;
  onAddValue: (v: string) => void;
  onRemoveValue: (v: string) => void;
  onRemove: () => void;
}

function OptionRow({
  option,
  onNameChange,
  onAddValue,
  onRemoveValue,
  onRemove,
}: OptionRowProps) {
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddValue(inputValue.trim());
      setInputValue("");
    }
  }

  return (
    <div className="rounded-lg border border-gray-100 p-3 space-y-3 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-xs text-gray-500 whitespace-nowrap">
            Nombre de la Opción
          </Label>
          {option.name && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
            >
              {option.name}
            </Badge>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <Input
        value={option.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ej: Color, Talla, Material"
        className="border-gray-200 h-8 text-sm"
      />

      <div>
        <Label className="text-xs text-gray-500">Valores disponibles</Label>
        <div className="flex flex-wrap gap-1 mt-1.5 mb-2">
          {option.values.map((val) => (
            <Badge
              key={val}
              variant="outline"
              className="text-xs gap-1 cursor-pointer hover:bg-red-50 hover:border-red-200"
              onClick={() => onRemoveValue(val)}
            >
              {val} ×
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-400 cursor-pointer">
          <PlusCircle className="w-4 h-4" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Agregar Valor (Enter para confirmar)"
            className="border-0 outline-none text-sm text-gray-600 placeholder:text-gray-400 bg-transparent w-full"
          />
        </div>
      </div>
    </div>
  );
}
