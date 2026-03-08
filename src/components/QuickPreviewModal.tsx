"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { pixieBranding } from "@/lib/branding";
import { useCartStore } from "@/store/useCartStore";

interface QuickPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  formattedPrice: string;
}

export default function QuickPreviewModal({
  isOpen,
  onClose,
  product,
  formattedPrice,
}: QuickPreviewModalProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col relative"
          >
            {/* Dekorasi Glow di dalam Modal */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 blur-[80px] pointer-events-none" />

            {/* Header Modal */}
            <div className="p-6 md:p-8 pb-4 flex justify-between items-center relative z-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                  {product.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Live Preview & Assets
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all border border-white/5"
              >
                <X size={24} />
              </button>
            </div>

            {/* Area Konten (Screenshots) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-2 custom-scrollbar relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.images?.length ? (
                  product.images.map((img, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-video rounded-[1.5rem] overflow-hidden border border-white/5 shadow-inner group/img bg-slate-800"
                    >
                      <Image 
                        src={pixieBranding.img(img)} 
                        alt="preview" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover/img:scale-105" 
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <p className="text-slate-500 font-medium italic">No screenshots available for this asset.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal: Pricing & Actions */}
            <div className="p-6 md:p-8 bg-slate-950/50 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Investment</span>
                <span className="text-3xl font-black text-white italic tracking-tighter">
                  {formattedPrice}
                </span>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Link 
                  href={`/products/${product.slug}`} 
                  className="flex-1 md:flex-none btn-pixie inline-flex items-center justify-center gap-2 px-8 py-4"
                >
                  View Full Details <ExternalLink size={18} />
                </Link>
                
                <button 
                  onClick={handleAddToCart} 
                  className="flex-1 md:flex-none btn-buy px-8 py-4"
                >
                  Add to Cart <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}