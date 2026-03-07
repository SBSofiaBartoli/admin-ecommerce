import { ProductOption } from "./product-option";
import { ProductOptionValue } from "./product-option-value";

export interface VariantOptionValue {
  id: string;
  variantId: string;
  optionId: string;
  valueId: string;
  option?: ProductOption;
  value?: ProductOptionValue;
}
