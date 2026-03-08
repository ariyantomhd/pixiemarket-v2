"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import QuickPreviewModal from "../QuickPreviewModal";
import ProductCardContent from "../ProductCardContent";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "dark";
  showSalesCount?: boolean;
}

export default function ProductCard({ product, variant = "default", showSalesCount = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [showGallery, setShowGallery] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const formattedPrice = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        onMouseMove={handleMove}
        className="group relative"
      >
        <Link href={`/products/${product.slug}`} className="block">
          <ProductCardContent 
            product={product}
            variant={variant}
            showSalesCount={showSalesCount}
            formattedPrice={formattedPrice}
            pos={pos}
            onPreview={(e) => { e.preventDefault(); e.stopPropagation(); setShowGallery(true); }}
            // PASTIKAN NAMA PROP INI onAddToCart (SESUAI KESEPAKATAN KITA TADI)
            onAddToCart={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
          />
        </Link>
      </motion.div>

      <QuickPreviewModal 
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        product={product}
        formattedPrice={formattedPrice}
        onAddToCart={() => { addItem(product); setShowGallery(false); }}
      />
    </>
  );
}