"use client";

import { Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FolderOpen } from "lucide-react";

interface CategoryDetailModalProps {
  open: boolean;
  onClose: () => void;
  category: Category;
  subcategories: Category[];
}

export default function CategoryDetailModal({
  open,
  onClose,
  category,
  subcategories,
}: CategoryDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <FolderOpen className="w-5 h-5 text-gray-500" />
            {category.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalle de la categoría
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Info básica */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <h3 className="font-semibold text-gray-700">Información</h3>
            <div className="flex justify-between">
              <span className="text-gray-500">Nombre</span>
              <span className="font-medium">{category.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Posición</span>
              <span className="font-medium">{category.position ?? "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tipo</span>
              {category.parent ? (
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                  Subcategoría de {category.parent.name}
                </span>
              ) : (
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-900 border border-green-200">
                  Principal
                </span>
              )}
            </div>
          </div>

          {/* Subcategorías */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Subcategorías</h3>
              <span className="text-xs text-gray-400">
                {subcategories.length} en total
              </span>
            </div>
            {subcategories.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-2">
                No tiene subcategorías
              </p>
            ) : (
              <div className="space-y-1">
                {subcategories.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
                  >
                    <span className="text-gray-700">└ {child.name}</span>
                    <span className="text-xs text-gray-400">
                      pos. {child.position ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
