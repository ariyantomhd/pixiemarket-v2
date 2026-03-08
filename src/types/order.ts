// src/types/order.ts
import { Product } from "./index"; // Ambil tipe Product yang sudah ada di index.ts

export interface PurchaseOrderItem {
  id: string;
  created_at: string;
  price: number;
  products: Product; // Sekarang ini sudah sinkron dengan yang diminta PurchaseItem
  orders: {
    status: string;
    user_id: string;
  };
}