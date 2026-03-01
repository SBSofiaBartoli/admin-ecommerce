import { Product } from "./product";

export interface SaleItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}
