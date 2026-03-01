import { apiClient } from "./client";
import { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>("/categories");
}

export async function getCategory(id: string): Promise<Category> {
  return apiClient<Category>(`/categories/${id}`);
}

export async function createCategory(
  data: Omit<Category, "id" | "createdAt" | "updatedAt">,
): Promise<Category> {
  return apiClient<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>,
): Promise<Category> {
  return apiClient<Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiClient<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}
