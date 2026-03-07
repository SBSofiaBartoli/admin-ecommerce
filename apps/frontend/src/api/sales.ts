import { Sale, SaleStatus } from "@/types";
import { apiClient } from "./client";

export async function getSales(): Promise<Sale[]> {
  return apiClient<Sale[]>("/sales");
}

export async function createSale(): Promise<Sale> {
  return apiClient<Sale>("/sales", {
    method: "POST",
  });
}

export async function updateSaleStatus(
  id: string,
  status: SaleStatus,
  note?: string,
): Promise<Sale> {
  return apiClient<Sale>(`/sales/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, note }),
  });
}
