import { SaleItem } from "./sale-item";

export interface Sale {
  id: string;
  total: number;
  createdAt: string;
  items?: SaleItem[];
}
