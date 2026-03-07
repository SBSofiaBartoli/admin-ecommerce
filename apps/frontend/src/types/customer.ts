import { Sale } from "./sale";

export interface Customer {
  id: string;
  name: string;
  email: string;
  _count?: { sales: number };
  sales?: Sale[];
}
