import { SaleStatus } from "./sale";

export interface SaleHistory {
  id: string;
  saleId: string;
  status: SaleStatus;
  note?: string;
  createdAt: string;
}
