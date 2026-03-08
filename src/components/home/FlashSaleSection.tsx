"use client";
import ProductCard from "../products/ProductCard";
import { Product } from "@/types/product";
import { Zap, Timer } from "lucide-react";

export default function FlashSaleSection({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full">
      {/* Container Utama dengan Glassmorphism Gelap & Border Merah Tipis */}
      <div className="pixie-glass relative overflow-hidden border border-red-500/20 bg-slate-900/40 p-8 md:p-12 rounded-[2.5rem]">
        
        {/* Dekorasi Cahaya Merah di Background (Urgensi) */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/10 blur-[100px] pointer-events-none" />
        
        {/* HEADER SECTION */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg shadow-orange-500/20 animate-pulse">
              <Zap fill="currentColor" size={28} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                FLASH SALE
              </h2>
              <p className="text-red-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Limited Time Magic
              </p>
            </div>
          </div>

          {/* TIMER - Dibuat lebih Tech & Modern */}
          <div className="flex items-center gap-3 bg-black/40 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-md">
            <Timer className="text-orange-500" size={20} />
            <div className="flex gap-4 font-mono text-2xl font-black text-white">
              <div className="flex flex-col items-center">
                <span>02</span>
                <span className="text-[10px] text-slate-500 uppercase">Hrs</span>
              </div>
              <span className="text-orange-500 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span>45</span>
                <span className="text-[10px] text-slate-500 uppercase">Min</span>
              </div>
              <span className="text-orange-500 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span>12</span>
                <span className="text-[10px] text-slate-500 uppercase">Sec</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* GRID PRODUK */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((item) => (
            <div key={item.id} className="relative group">
              {/* Badge Diskon Melayang */}
              <div className="absolute -top-3 -right-3 z-20">
                <span className="badge-sale px-3 py-1.5 rounded-lg shadow-xl border border-white/10">
                  -{item.discount_percentage}%
                </span>
              </div>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}