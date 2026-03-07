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
  DialogDescription,
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
import { PlusCircle, Trash2, ImagePlus, X, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormOption {
  name: string;
  values: string[];
}

interface ProductVariantRow {
  combination: Array<{ optionName: string; value: string }>;
  price: string;
  sku: string;
  stock: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
  categories: Category[];
}

function generateVariants(options: FormOption[]): ProductVariantRow[] {
  const filledOptions = options.filter(
    (o) => o.name.trim() && o.values.length > 0,
  );
  if (filledOptions.length === 0) return [];
  const combinations: string[][] = filledOptions.reduce<string[][]>(
    (acc, option) => {
      if (acc.length === 0) return option.values.map((v) => [v]);
      return acc.flatMap((combo) => option.values.map((v) => [...combo, v]));
    },
    [],
  );
  return combinations.map((combo) => ({
    combination: combo.map((value, index) => ({
      optionName: filledOptions[index].name,
      value,
    })),
    price: "",
    sku: "",
    stock: "",
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
    const trimmed = value.trim();
    if (!trimmed) return;
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optionIndex && !o.values.includes(trimmed)
          ? { ...o, values: [...o.values, trimmed] }
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

  function updateVariant(
    index: number,
    field: "price" | "sku" | "stock",
    value: string,
  ) {
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
        stock: parseInt(v.stock) || 0,
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
      <DialogContent className="!max-w-7xl w-[90vw] max-h-[85vh] overflow-y-auto border-0 shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="w-6 h-6 text-gray-500" />
            {product ? "Editar producto" : "Nuevo producto"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {product
              ? "Editá los datos del producto"
              : "Completá los datos para crear un nuevo producto"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Layout 2 columnas */}
          <div className="grid grid-cols-2 gap-4">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-4">
              {/* Sección información básica */}
              <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                <h3 className="font-semibold text-gray-700 text-dm">
                  Información básica
                </h3>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">
                    Nombre del Producto*
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre del producto"
                    className="border-gray-200 h-9"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción detallada del producto"
                    className="border-gray-200 resize-none text-sm"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="brand" className="text-sm">
                      Marca *
                    </Label>
                    <Input
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ej: Nike"
                      className="border-gray-200 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gender" className="text-sm">
                      Género *
                    </Label>
                    <Select
                      value={gender || "none"}
                      onValueChange={(v) => setGender(v === "none" ? "" : v)}
                    >
                      <SelectTrigger className="border-gray-200 h-9">
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

                {/* Categoría + Estado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Categoría *</Label>
                    <Select
                      value={categoryId || "none"}
                      onValueChange={(v) =>
                        setCategoryId(v === "none" ? "" : v)
                      }
                    >
                      <SelectTrigger className="border-gray-200 h-9">
                        <SelectValue placeholder="Seleccioná una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          Seleccioná una categoría
                        </SelectItem>
                        {subcategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}{" "}
                            {cat.parent ? `(${cat.parent.name})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm">Estado</Label>
                    <Select
                      value={status}
                      onValueChange={(v) => setStatus(v as ProductStatus)}
                    >
                      <SelectTrigger className="border-gray-200 h-9">
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

                {/* Imágenes — UI lista para Cloudinary */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Imágenes del Producto</Label>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors w-full justify-center"
                  >
                    <ImagePlus className="w-5 h-5" />
                    Subir Imágenes
                  </button>
                  <p className="text-sm text-gray-400 text-center">
                    Próximamente disponible
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div className="space-y-4">
              {/* Opciones del producto */}
              <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-700 text-dm">
                      Opciones del Producto
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Definí las características que tendrán variaciones (ej:
                      Color, Talla, Material)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOption}
                    className="gap-1 text-gray-600 text-sm h-8"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Agregar Opción
                  </Button>
                </div>

                {options.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-3">
                    No hay opciones definidas
                  </p>
                ) : (
                  <div className="space-y-3">
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
                )}
              </div>

              {/* Variantes generadas */}
              <div className="rounded-xl border border-gray-100 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700 text-dm">
                    Variantes del Producto
                  </h3>
                  <span className="text-sm text-gray-400">
                    {variants.length} variante{variants.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {variants.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-3">
                    Definí opciones de producto para generar variantes
                    automáticamente.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 px-2 text-sm px-1 text-gray-400 font-medium">
                      <span className="col-span-5">Variante</span>
                      <span className="col-span-4">Precio *</span>
                      <span className="col-span-3">SKU</span>
                      <span className="col-span-2">Stock</span>
                    </div>
                    {variants.map((variant, vIndex) => (
                      <div
                        key={vIndex}
                        className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 rounded-lg bg-gray-50"
                      >
                        <div className="col-span-5 flex flex-wrap gap-1">
                          {variant.combination.map((val) => (
                            <Badge
                              key={val.value}
                              variant="outline"
                              className="text-sm bg-white border-gray-200 px-1.5 py-0"
                            >
                              {val.value}
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
                            className="border-gray-200 h-7 text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder="SKU-001"
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(vIndex, "sku", e.target.value)
                            }
                            className="border-gray-200 h-7 text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(vIndex, "stock", e.target.value)
                            }
                            className="border-gray-200 h-7 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-dm text-red-500">{error}</p>}

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

  function handleAddClick() {
    onAddValue(inputValue);
    setInputValue("");
  }

  return (
    <div className="rounded-lg border border-gray-100 p-3 space-y-2 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-sm text-gray-500 whitespace-nowrap">
            Nombre de la Opción
          </Label>
          {option.name && (
            <Badge
              variant="outline"
              className="text-sm bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0"
            >
              {option.name}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 h-7 w-7"
        >
          <Trash2 className="w-4 h-4 text-red-900" />
        </Button>
      </div>

      <Input
        value={option.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ej: Color, Talla, Material"
        className="border-gray-200 h-8 text-sm"
      />

      {/* Valores existentes */}
      {option.values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {option.values.map((val) => (
            <Badge
              key={val}
              variant="outline"
              className="text-sm gap-1 pr-1 cursor-pointer hover:bg-red-50 hover:border-red-200"
              onClick={() => onRemoveValue(val)}
            >
              {val}
              <button type="button" onClick={() => onRemoveValue(val)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {/* Input agregar valor */}
      <div className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Agregar Valor..."
          className="border-gray-200 h-8 text-sm flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddClick}
          className="h-8 px-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
