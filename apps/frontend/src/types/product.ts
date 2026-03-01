import { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}
