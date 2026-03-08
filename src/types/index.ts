import { User } from "./user";

// --- PRODUCT DATA ---
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'DEFI' | 'UI KIT' | 'MOBILE' | 'WEB' | 'GAME';
  image_url: string;
  source_url?: string; // Link download rahasia
  doc_url?: string;
  created_at: string;
}

// --- ORDER / TRANSACTION DATA ---
export interface Order {
  id: string;
  user_id: string;
  paypal_order_id: string;
  total_price: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  items_json: OrderItem[]; // Kita simpan snapshot item saat dibeli
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

// --- COMPONENT PROPS ---
export interface SidebarProps {
  user: User | null;
}

export interface StatsItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}