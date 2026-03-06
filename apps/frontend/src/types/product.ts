import { Category } from "./category";
import { ProductImage } from "./product-image";
import { ProductOption } from "./product-option";
import { ProductVariant } from "./product-variant";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface Product {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  gender?: string;
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  options?: ProductOption[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
