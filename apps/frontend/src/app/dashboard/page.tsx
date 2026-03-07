"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/api/products";
import { getSales } from "@/api/sales";
import { getCategories } from "@/api/categories";
import { Product, Sale } from "@/types";
import { Package, ShoppingCart, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [categories, setCategories] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
  const totalValue = products.reduce((sum, p) => {
    const productStock = p.variants?.reduce((s, v) => s + v.stock, 0) ?? 0;
    const productPrice = p.variants?.[0]?.price ?? 0;
    return sum + productStock * productPrice;
  }, 0);

  if (loading) {
    return <div className="text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Inicio</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-dm text-gray-600">Productos</span>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{products.length}</p>
          <p className="text-sm text-gray-500">Stock total: {totalStock} u.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-dm text-gray-600">Ventas</span>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{sales.length}</p>
          <p className="text-sm text-gray-500">
            Total: ${totalSalesAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-dm text-gray-600">Categorías</span>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">{categories}</p>
          <p className="text-sm text-gray-500">Categorías registradas</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-dm text-gray-600">En preparación</span>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold">
            {sales.filter((s) => s.status === "PREPARATION").length}
          </p>
          <p className="text-sm text-gray-500">Pedidos pendientes</p>
        </div>
      </div>

      {/* Ventas recientes + Productos */}
      <div className="grid grid-cols-3 gap-4">
        {/* Ventas recientes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Ventas recientes</h2>
            <Link
              href="/dashboard/sales"
              className="text-xs text-blue-500 hover:underline"
            >
              <button className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 shadow-sm">
                Ver todas
              </button>
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
                  className="flex items-center justify-between py-2 border-b last:border-0 border-gray-300"
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
                    <p className="text-md font-semibold text-green-600">
                      ${sale.total.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                        sale.status === "COMPLETED"
                          ? "bg-green-100 text-green-900 border border-green-200"
                          : sale.status === "SHIPPED"
                            ? "bg-blue-100 text-blue-900 border border-blue-200"
                            : sale.status === "CANCELLED"
                              ? "bg-red-100 text-red-900 border border-red-200"
                              : "bg-yellow-100 text-yellow-900 border border-yellow-200"
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

        {/* Inventario de productos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold text-gray-900">
              Inventario de Productos
            </h2>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mt-2">{products.length}</p>
          <p className="text-xs text-gray-400 mb-1">Productos en inventario</p>
          <p className="text-sm font-medium text-gray-700 mb-4">
            Valor: ${totalValue.toFixed(2)}
          </p>
          <div className="space-y-2">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="truncate max-w-[180px] text-gray-700">
                  {product.name}
                </span>
                <span className="text-gray-400 shrink-0 ml-2">
                  {product.variants?.reduce((s, v) => s + v.stock, 0) ?? 0} u.
                </span>
              </div>
            ))}
            {products.length > 5 && (
              <p className="text-xs text-gray-400">
                +{products.length - 5} productos más
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4 justify-between">
            <button
              onClick={() => router.push("/dashboard/products?new=true")}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 flex items-center gap-1 shadow-sm"
            >
              <span className="text-lg leading-none">+</span> Añadir
            </button>
            <Link href="/dashboard/products">
              <button className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 shadow-sm">
                Ver todos
              </button>
            </Link>
          </div>
        </div>

        {/* Productos mas vendidos */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              Productos más vendidos
            </h2>
            <TrendingUp className="w-4 h-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {sales.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay productos top para mostrar
              </p>
            ) : (
              (() => {
                const countMap: Record<
                  string,
                  { name: string; count: number }
                > = {};
                sales.forEach((sale) => {
                  sale.items?.forEach((item) => {
                    const name = item.variant?.product?.name ?? item.variantId;
                    if (!countMap[item.variantId]) {
                      countMap[item.variantId] = { name, count: 0 };
                    }
                    countMap[item.variantId].count += item.quantity;
                  });
                });
                const sorted = Object.values(countMap)
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5);
                return sorted.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No hay productos top para mostrar
                  </p>
                ) : (
                  sorted.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b last:border-0 border-gray-300"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 w-4">
                          {i + 1}
                        </span>
                        <p className="text-sm font-medium truncate max-w-[160px]">
                          {item.name}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.count} vendidos
                      </span>
                    </div>
                  ))
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
