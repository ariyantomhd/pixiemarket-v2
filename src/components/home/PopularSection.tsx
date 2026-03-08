import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";

export default function PopularSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Popular Right Now</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products?.map((item) => (
          <ProductCard key={item.id} product={item} showSalesCount />
        ))}
      </div>
    </section>
  );
}