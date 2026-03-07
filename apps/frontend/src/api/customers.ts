import { Customer } from "@/types/customer";
import { apiClient } from "./client";

export async function getCustomers(): Promise<Customer[]> {
  return apiClient<Customer[]>("/customers");
}

export async function getCustomer(id: string): Promise<Customer> {
  return apiClient<Customer>(`/customers/${id}`);
}
