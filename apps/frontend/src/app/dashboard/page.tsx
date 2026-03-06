"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/api/products";
import { getSales } from "@/api/sales";
import { getCategories } from "@/api/categories";
import { Product, Sale } from "@/types";
import { Package, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, s, c] = await Promise.all([
          getProducts(),
          getSales(),
          getCategories(),
        ]);
        setProducts(p);
        setSales(s);
        setCategories(c.length);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const recentSales = sales.slice(0, 5);
  const topProducts = products.slice(0, 5);
  const totalStock = products.reduce(
    (sum, p) => sum + (p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0),
    0,
  );
  const totalSalesAmount = sales.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inicio</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Productos</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{products.length}</p>
          <p className="text-xs text-gray-400">Stock total: {totalStock} u.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Ventas</span>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{sales.length}</p>
          <p className="text-xs text-gray-400">
            Total: ${totalSalesAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Categorías</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{categories}</p>
          <p className="text-xs text-gray-400">Categorías registradas</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">En preparación</span>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {sales.filter((s) => s.status === "PREPARATION").length}
          </p>
          <p className="text-xs text-gray-400">Pedidos pendientes</p>
        </div>
      </div>

      {/* Ventas recientes + Productos */}
      <div className="grid grid-cols-2 gap-4">
        {/* Ventas recientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Ventas recientes</h2>
            <Link
              href="/dashboard/sales"
              className="text-xs text-blue-500 hover:underline"
            >
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay ventas aún
              </p>
            ) : (
              recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {sale.customer?.name ?? "Cliente Demo"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Orden #{sale.orderNumber}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString("es-AR")}
                      {sale.paymentMethod ? ` · ${sale.paymentMethod}` : ""}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-green-600">
                      ${sale.total.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sale.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : sale.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : sale.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {sale.status === "COMPLETED"
                        ? "Completado"
                        : sale.status === "SHIPPED"
                          ? "Enviado"
                          : sale.status === "CANCELLED"
                            ? "Cancelado"
                            : "En preparación"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Productos recientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Productos recientes</h2>
            <Link
              href="/dashboard/products"
              className="text-xs text-blue-500 hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay productos aún
              </p>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 py-2 border-b last:border-0"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.category?.name ?? "—"}
                      {product.brand ? ` · ${product.brand}` : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                      Stock:{" "}
                      {product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0}{" "}
                      u.
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      product.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : product.status === "DRAFT"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.status === "ACTIVE"
                      ? "Activo"
                      : product.status === "DRAFT"
                        ? "Borrador"
                        : "Inactivo"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
