export interface Shipment {
  id: string;
  carrier: string;
  tracking?: string;
  shippedAt?: string;
  saleId: string;
}
