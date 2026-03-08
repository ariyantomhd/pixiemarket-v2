import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

export const getDummyProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return data as Product[];
};

// Helper untuk filter data di sisi client jika diperlukan
export const getFeaturedProducts = (products: Product[]) => 
  products.filter(p => p.is_featured).slice(0, 4);

export const getPopularProducts = (products: Product[]) => 
  products.filter(p => p.is_trending).slice(0, 4);

export const getFlashSaleProducts = (products: Product[]) => 
  products.filter(p => (p.discount_percentage || 0) >= 80).slice(0, 4);