import Link from "next/link";
import Image from "next/image"; // Tambahkan import Image
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types/product";
import { getDummyProducts } from "@/components/products/dummy-data";
import { Search } from "lucide-react"; // Sparkles dihapus karena diganti logo

interface ShopPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

const CATEGORIES = [
  "All",
  "Source Code",
  "Web Templates",
  "Smart Contracts",
  "SaaS Kits",
  "UI Kits"
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search } = await searchParams;
  const activeCategory = category || "All";
  const allProducts = await getDummyProducts();

  let products = allProducts;

  if (activeCategory !== "All") {
    products = products.filter((p) => p.category === activeCategory);
  }

  if (search) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header & Search Section - UPDATED WITH PIXIE LOGO */}
        <div className="mb-12 pixie-glass p-8 md:p-12 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic flex items-center gap-4">
              {activeCategory === "All" ? "The Market" : activeCategory}
              
              {/* LOGO PIXIE SEBAGAI PENGGANTI SPARKLES */}
              <div className="hidden md:block relative w-20 h-20 md:w-20 md:h-20 animate-shake animation-delay-300">
                <Image
                  src="/pixie.png"
                  alt="Pixie Logo"
                  fill
                  className="object-contain pointer-events-none"
                  priority
                />
              </div>
            </h1>
            <p className="text-slate-400 font-medium">
              Explore <span className="text-teal-400 font-bold">{products.length}</span> premium digital assets
            </p>
          </div>

          {/* Search Input Container */}
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              placeholder="Search assets..."
              className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-white/10 focus:border-teal-500/50 rounded-2xl outline-none transition-all font-medium text-white placeholder:text-slate-600 shadow-inner"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={22} />
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "All" ? "/products" : `/products?category=${encodeURIComponent(cat)}`}
              className={`px-6 py-3 rounded-xl font-bold transition-all border-2 text-sm uppercase tracking-wider ${
                activeCategory === cat
                  ? "bg-teal-500 border-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                  : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-32 text-center pixie-glass border border-dashed border-white/10 rounded-[2.5rem]">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
              🔍
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic">Oops! Nothing found</h3>
            <p className="text-slate-500 mt-2 max-w-xs mx-auto font-medium">
              We couldn&apos;t find any products in <b className="text-teal-400">{activeCategory}</b>. 
              Try checking other categories!
            </p>
            <Link 
              href="/products"
              className="inline-block mt-8 px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase italic rounded-xl transition-all"
            >
              Show All Products
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}