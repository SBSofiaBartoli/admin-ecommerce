import { ProductVariant } from "./product-variant";

export interface SaleItem {
  id: string;
  saleId: string;
  variantId: string;
  quantity: number;
  price: number;
  variant?: ProductVariant;
}
