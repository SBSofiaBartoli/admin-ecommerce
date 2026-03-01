import { apiClient } from "./client";
import { Sale } from "../types/sale";

interface CreateSaleItemInput {
  productId: string;
  quantity: number;
}

interface CreateSaleInput {
  total: number;
  items: CreateSaleItemInput[];
}

export async function getSales(): Promise<Sale[]> {
  return apiClient<Sale[]>("/sales");
}

export async function createSale(data: CreateSaleInput): Promise<Sale> {
  return apiClient<Sale>("/sales", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
