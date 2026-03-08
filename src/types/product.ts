export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  images: string[] | null;
  category: string | null;
  tags: string[] | null;
  sold_count: number | null;
  stock: number | null;
  created_at: string | null;
  
  // Flagging untuk Admin Dashboard
  is_featured: boolean | null;
  is_new_arrival: boolean | null;
  is_trending: boolean | null;

  // Digital Asset Specifics (Untuk UI Detail & Proxy)
  file_url: string | null;
  version: string | null;
  file_size: string | null;
  tech_stack: string[] | null;
  release_date: string | null;
  sales_count?: number;
}

// Helper Type jika nanti butuh list produk tanpa deskripsi lengkap
export type ProductSummary = Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'images' | 'category'>;