import { Category } from "@/types";
import { apiClient } from "./client";

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>("/categories");
}

export async function getCategoriesForSelect(): Promise<
  Pick<Category, "id" | "name" | "parentId">[]
> {
  return apiClient<Pick<Category, "id" | "name" | "parentId">[]>(
    "/categories/select",
  );
}

export async function getCategory(id: string): Promise<Category> {
  return apiClient<Category>(`/categories/${id}`);
}

export async function getCategoryChildren(id: string): Promise<Category[]> {
  return apiClient<Category[]>(`/categories/${id}/children`);
}

export async function createCategory(data: {
  name: string;
  position?: number;
  parentId?: string;
}): Promise<Category> {
  return apiClient<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  id: string,
  data: { name?: string; position?: number; parentId?: string },
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
