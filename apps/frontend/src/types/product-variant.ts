import { Product } from "./product";

export interface ProductVariant {
  id: string;
  sku?: string;
  price: number;
  stock: number;
  productId: string;
  product?: Product;
}
