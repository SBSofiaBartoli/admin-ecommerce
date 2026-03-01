import { apiClient } from "./client";
import { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  return apiClient<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product> {
  return apiClient<Product>(`/products/${id}`);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt" | "category">,
): Promise<Product> {
  return apiClient<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt" | "category">>,
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: string): Promise<void> {
  return apiClient<void>(`/products/${id}`, {
    method: "DELETE",
  });
}
