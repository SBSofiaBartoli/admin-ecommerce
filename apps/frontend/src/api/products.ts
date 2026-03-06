import { Product, ProductStatus } from "@/types";
import { apiClient } from "./client";

export async function getProducts(): Promise<Product[]> {
  return apiClient<Product[]>("/products");
}

export async function getProduct(id: string): Promise<Product> {
  return apiClient<Product>(`/products/${id}`);
}

export async function createProduct(data: {
  name: string;
  description?: string;
  brand?: string;
  gender?: string;
  categoryId: string;
  status?: ProductStatus;
}): Promise<Product> {
  return apiClient<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    brand: string;
    gender: string;
    categoryId: string;
  }>,
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
