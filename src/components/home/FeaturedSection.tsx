import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";

// Nantinya data ini diambil dari Supabase: .eq('is_featured', true)
export default function FeaturedSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Featured Assets</h2>
          <p className="text-slate-500">Handpicked premium selections for you.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}