"use client";

import Image from "next/image";
import { ShoppingCart, Eye, Zap, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/types/product";
import { pixieBranding } from "@/lib/branding";
import { getTechColor } from "@/lib/techColors";
import clsx from "clsx";

interface ContentProps {
  product: Product;
  variant: "default" | "dark";
  showSalesCount: boolean;
  formattedPrice: string;
  pos: { x: number; y: number };
  onPreview: (e: React.MouseEvent) => void;
  onAddToCart: (e: React.MouseEvent) => void; // <--- SUDAH SINKRON
}

export default function ProductCardContent({ 
  product, 
  variant, 
  showSalesCount, 
  formattedPrice, 
  pos, 
  onPreview,
  onAddToCart // <--- TERIMA PROP DI SINI
}: ContentProps) {
  const displayImage = product.images?.[0] || "/placeholder.png";

  return (
    <div className={clsx(
      "relative backdrop-blur-xl border rounded-[2.5rem] transition-all duration-500 group overflow-hidden",
      variant === "default" 
        ? "bg-slate-900/40 border-white/10 shadow-xl" 
        : "bg-slate-950/80 border-slate-800 shadow-2xl hover:border-teal-500/30"
    )}>
      
      {/* Glow Effect Dynamis */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none z-10"
        style={{ 
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, rgba(45, 212, 191, 0.15), transparent 60%)` 
        }} 
      />

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden m-3 rounded-[2rem] bg-slate-900/50 border border-white/5">
        <Image 
          src={pixieBranding.img(displayImage)} 
          alt={product.name} 
          fill 
          unoptimized 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Discount Badge */}
        {product.discount_percentage && (
          <div className="absolute top-4 left-4 z-20">
            <span className="badge-sale px-3 py-1.5 rounded-lg shadow-lg">
              -{product.discount_percentage}%
            </span>
          </div>
        )}

        {/* Trending Icon */}
        {(product.is_trending || variant === "dark") && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-xl shadow-lg animate-pulse z-20">
            < Zap size={14} fill="currentColor" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 backdrop-blur-sm">
          <button 
            type="button"
            onClick={onPreview} 
            className="p-4 bg-white text-slate-950 rounded-2xl hover:bg-teal-500 hover:text-white transition transform hover:scale-110 shadow-2xl"
          >
            <Eye size={22} />
          </button>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 pt-2 relative z-20">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-md">
            {product.category || "Digital Asset"}
          </span>

          {showSalesCount && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                <ShoppingBag size={10} className="text-orange-400" />
                <span className="text-[9px] font-black text-white italic tracking-tighter">
                  {product.sales_count || 0} <span className="text-slate-500 font-medium">SOLD</span>
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[9px] font-bold text-white/50">4.9</span>
              </div>
            </div>
          )}
        </div>

        <h3 className="font-bold text-lg text-white transition line-clamp-1 group-hover:text-teal-300">
          {product.name}
        </h3>
        
        {/* Tech Stack */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {product.tech_stack?.slice(0, 3).map((tech) => {
            const color = getTechColor(tech);
            return (
              <span 
                key={tech} 
                className={clsx(
                  "text-[9px] px-2.5 py-1 rounded-full font-bold border uppercase tracking-tighter transition-all duration-300", 
                  color.bg || "bg-slate-800/50", 
                  color.text || "text-slate-300", 
                  color.border || "border-white/5"
                )}
              >
                {tech}
              </span>
            )
          })}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-7 flex items-center justify-between">
          <div>
            {product.price > 0 && (
              <p className="text-xs text-slate-500 line-through mb-0.5 tracking-tight font-medium">
                ${(product.price * 1.5).toFixed(2)}
              </p>
            )}
            <p className="text-2xl font-black tracking-tighter text-white italic">
              {formattedPrice}
            </p>
          </div>
          
          <button 
            type="button"
            onClick={onAddToCart} // <--- PANGGIL LANGSUNG DARI PROP
            className="p-3.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all group/btn"
          >
            <ShoppingCart size={22} className="group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}