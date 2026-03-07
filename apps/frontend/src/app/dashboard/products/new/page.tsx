"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, uploadProductImages } from "@/api/products";
import { getCategories } from "@/api/categories";
import { Category, ProductStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlusCircle,
  Trash2,
  X,
  ImagePlus,
  ArrowLeft,
  Package,
} from "lucide-react";

interface FormOption {
  name: string;
  values: string[];
}

interface VariantRow {
  combination: Array<{ optionName: string; value: string }>;
  price: string;
  sku: string;
  stock: string;
}

function generateVariants(options: FormOption[]): VariantRow[] {
  const filled = options.filter((o) => o.name.trim() && o.values.length > 0);
  if (filled.length === 0) return [];
  const combos = filled.reduce<string[][]>((acc, opt) => {
    if (acc.length === 0) return opt.values.map((v) => [v]);
    return acc.flatMap((combo) => opt.values.map((v) => [...combo, v]));
  }, []);
  return combos.map((combo) => ({
    combination: combo.map((value, i) => ({
      optionName: filled[i].name,
      value,
    })),
    price: "",
    sku: "",
    stock: "",
  }));
}

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<ProductStatus>("ACTIVE");
  const [options, setOptions] = useState<FormOption[]>([]);
  const [variants, setVariants] = useState<VariantRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => toast.error("Error al cargar categorías"));
  }, []);

  useEffect(() => {
    setVariants(generateVariants(options));
  }, [options]);

  const subcategories = categories.filter((c) => c.parentId !== null);

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

  function addValue(optIndex: number, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIndex && !o.values.includes(trimmed)
          ? { ...o, values: [...o.values, trimmed] }
          : o,
      ),
    );
  }

  function removeValue(optIndex: number, value: string) {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === optIndex
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

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Seleccioná una categoría");
      return;
    }
    setLoading(true);
    try {
      const product = await createProduct({
        name,
        description: description || undefined,
        brand: brand || undefined,
        gender: gender || undefined,
        categoryId,
        status,
        variants:
          variants.length > 0
            ? variants.map((v) => ({
                combination: v.combination,
                price: parseFloat(v.price) || 0,
                sku: v.sku || undefined,
                stock: parseInt(v.stock) || 0,
              }))
            : undefined,
      });

      if (imageFiles.length > 0) {
        const formData = new FormData();
        imageFiles.forEach((file) => formData.append("images", file));
        await uploadProductImages(product.id, formData);
      }
      toast.success("Producto creado correctamente");
      setTimeout(() => router.push("/dashboard/products"), 1000);
    } catch {
      toast.error("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-gray-500" />
          <h1 className="text-3xl font-bold">Nuevo producto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 p-5 space-y-4 bg-white shadow-sm">
              <h3 className="font-semibold text-gray-700">
                Información básica
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del producto"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción detallada"
                  rows={3}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Marca</Label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej: Nike"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Género</Label>
                  <Select
                    value={gender || "none"}
                    onValueChange={(v) => setGender(v === "none" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná" />
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Categoría *</Label>
                  <Select
                    value={categoryId || "none"}
                    onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccioná" />
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
                <div className="space-y-1.5">
                  <Label>Estado</Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as ProductStatus)}
                  >
                    <SelectTrigger>
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

              {/* Imágenes */}
              <div className="space-y-2">
                <Label>Imágenes del Producto</Label>
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors w-full justify-center">
                  <ImagePlus className="w-4 h-4" />
                  {loading ? "Subiendo..." : "Subir Imágenes"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                </label>
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((url, i) => (
                      <div key={i} className="relative w-16 h-16">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFiles((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            );
                            setImagePreviews((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            );
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA */}
          <div className="space-y-4">
            {/* Opciones */}
            <div className="rounded-xl border border-gray-100 p-5 space-y-3 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-700">
                    Opciones del Producto
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ej: Color, Talla, Material
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addOption}
                  className="gap-1 text-gray-600 text-xs"
                >
                  <PlusCircle className="w-4 h-4" /> Agregar Opción
                </Button>
              </div>

              {options.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">
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

            {/* Variantes */}
            <div className="rounded-xl border border-gray-100 p-5 space-y-3 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">Variantes</h3>
                <span className="text-xs text-gray-400">
                  {variants.length} variante{variants.length !== 1 ? "s" : ""}
                </span>
              </div>

              {variants.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-3">
                  Definí opciones para generar variantes automáticamente.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-1 text-xs text-gray-400 font-medium">
                    <span className="col-span-4">Variante</span>
                    <span className="col-span-3">Precio *</span>
                    <span className="col-span-3">SKU</span>
                    <span className="col-span-2">Stock</span>
                  </div>
                  {variants.map((variant, vIndex) => (
                    <div
                      key={vIndex}
                      className="grid grid-cols-12 gap-2 items-center px-1 py-1.5 rounded-lg bg-gray-50"
                    >
                      <div className="col-span-4 flex flex-wrap gap-1">
                        {variant.combination.map((val) => (
                          <Badge
                            key={val.value}
                            variant="outline"
                            className="text-xs bg-white border-gray-200 px-1.5 py-0"
                          >
                            {val.value}
                          </Badge>
                        ))}
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(vIndex, "price", e.target.value)
                          }
                          className="h-7 text-xs border-gray-200"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="SKU-001"
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariant(vIndex, "sku", e.target.value)
                          }
                          className="h-7 text-xs border-gray-200"
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
                          className="h-7 text-xs border-gray-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gray-900 hover:bg-gray-700"
          >
            {loading ? "Creando..." : "Crear producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}

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
    <div className="rounded-lg border border-gray-100 p-3 space-y-2 bg-white">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Label className="text-xs text-gray-500 whitespace-nowrap">
            Nombre de la Opción
          </Label>
          {option.name && (
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0"
            >
              {option.name}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onRemove}
          className="text-red-400 hover:text-red-600 h-7 w-7"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      <Input
        value={option.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Ej: Color, Talla, Material"
        className="h-8 text-sm border-gray-200"
      />
      {option.values.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {option.values.map((val) => (
            <Badge
              key={val}
              variant="outline"
              className="text-xs gap-1 pr-1 cursor-pointer hover:bg-red-50 hover:border-red-200"
              onClick={() => onRemoveValue(val)}
            >
              {val}{" "}
              <button type="button" onClick={() => onRemoveValue(val)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <div className="flex gap-1">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Agregar Valor..."
          className="h-8 text-sm border-gray-200 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onAddValue(inputValue);
            setInputValue("");
          }}
          className="h-8 px-2"
        >
          <PlusCircle className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
