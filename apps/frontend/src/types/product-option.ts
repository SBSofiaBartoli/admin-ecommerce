import { ProductOptionValue } from "./product-option-value";

export interface ProductOption {
  id: string;
  name: string;
  productId: string;
  values?: ProductOptionValue[];
}
