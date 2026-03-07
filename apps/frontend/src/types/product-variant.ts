import { Product } from "./product";
import { VariantOptionValue } from "./variant-option-value";

export interface ProductVariant {
  id: string;
  sku?: string;
  price: number;
  stock: number;
  productId: string;
  product?: Product;
  values?: VariantOptionValue[];
}
