import { Customer } from "./customer";
import { SaleHistory } from "./sale-history";
import { SaleItem } from "./sale-item";
import { Shipment } from "./shipment";

export type SaleStatus = "PREPARATION" | "SHIPPED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PAID" | "FAILED";

export interface Sale {
  id: string;
  orderNumber: string;
  status: SaleStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  total: number;
  customerId: string;
  customer?: Customer;
  items?: SaleItem[];
  history?: SaleHistory[];
  shipment?: Shipment;
  createdAt: string;
}
