import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

/**
 * Fetches products and ensures a valid slug exists for every item.
 */
export const getDummyProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  return (data as Product[]).map(product => {
    // 1. If slug is missing, generate it from the name
    // 2. If name is also missing (like in your console log), use ID as fallback
    const generatedSlug = product.slug || 
      (product.name ? product.name.toLowerCase().replace(/\s+/g, '-') : `product-${product.id}`);

    return {
      ...product,
      slug: generatedSlug.replace(/[^\w-]+/g, '') // Clean special characters
    };
  });
};