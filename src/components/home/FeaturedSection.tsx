import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";
import Link from "next/link"; // Tambahkan import Link
import { ArrowRight } from "lucide-react"; // Opsional untuk icon panah

// Nantinya data ini diambil dari Supabase: .eq('is_featured', true)
export default function FeaturedSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">Featured Assets</h2>
          <p className="text-slate-500">Handpicked premium selections for you.</p>
        </div>

        {/* Tambahan: Tombol View All */}
        <Link 
          href="/products" 
          className="flex items-center gap-2 text-teal-400 hover:text-teal-300 font-bold text-sm transition-all group"
        >
          View All
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((item) => (
          /* Jika klik di kartu tidak jalan, pastikan di dalam ProductCard.tsx 
             sudah menggunakan <Link href={`/products/${product.slug}`}> 
          */
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}