"use client";

import { useRouter } from "next/navigation"; 
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import ProductCardContent from "../ProductCardContent";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "dark";
  showSalesCount?: boolean;
}

export default function ProductCard({ product, variant = "default", showSalesCount = false }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const formattedPrice = new Intl.NumberFormat("en-US", { 
    style: "currency", 
    currency: "USD" 
  }).format(product.price);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ 
      x: ((e.clientX - rect.left) / rect.width) * 100, 
      y: ((e.clientY - rect.top) / rect.height) * 100 
    });
  };

  // Fungsi navigasi paksa
  const handleNavigate = () => {
    if (product?.slug) {
      console.log("Navigating to:", `/products/${product.slug}`);
      router.push(`/products/${product.slug}`);
    } else {
      console.warn("Product slug is missing!", product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onMouseMove={handleMove}
      onClick={handleNavigate} // Klik di mana saja pada kartu akan memicu redirect
      className="group relative cursor-pointer block"
    >
      <ProductCardContent 
        product={product}
        variant={variant}
        showSalesCount={showSalesCount}
        formattedPrice={formattedPrice}
        pos={pos}
        onAddToCart={(e) => { 
          // Stop propagation sangat penting agar klik tombol cart 
          // tidak memicu handleNavigate milik parent
          e.stopPropagation(); 
          addItem(product); 
        }}
      />
    </motion.div>
  );
}