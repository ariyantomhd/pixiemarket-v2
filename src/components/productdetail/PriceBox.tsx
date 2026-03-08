"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Minus, Plus, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";

export default function PriceBox({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [extendSupport, setExtendSupport] = useState(false);

  const supportPrice = 17.63;

  // LOGIC: Kalkulasi Harga Real-time
  const totalPrice = useMemo(() => {
    const base = product.price;
    const extra = extendSupport ? supportPrice : 0;
    return ((base + extra) * quantity).toFixed(2);
  }, [product.price, extendSupport, quantity, supportPrice]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="pixie-glass p-8 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 blur-[50px] pointer-events-none" />

      {/* HARGA & LISENSI */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-1">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            Regular License <Sparkles size={16} className="text-teal-400" />
          </h3>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Single Project</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-2">
            {/* Harga Asli (Core Price) */}
            <span className="text-slate-600 line-through text-sm font-bold">
              ${(product.original_price ?? quantity).toFixed(2)}
            </span>
            
            {/* Harga Dinamis dengan Animasi */}
            <AnimatePresence mode="wait">
              <motion.span 
                key={totalPrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white italic tracking-tighter"
              >
                ${totalPrice}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BENEFIT LIST */}
      <div className="space-y-4 mb-8 border-b border-white/5 pb-8 text-sm text-slate-400">
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-teal-500/20 p-0.5 rounded-full">
            <Check size={14} className="text-teal-400" />
          </div>
          <span className="text-slate-300">Quality checked by <b className="text-white">PixieCode</b></span>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-1 bg-teal-500/20 p-0.5 rounded-full">
            <Check size={14} className="text-teal-400" />
          </div>
          <span className="text-slate-300">Future updates included</span>
        </div>
        
        {/* Checkbox Extend Support */}
        <label 
          className={`flex items-center justify-between gap-3 pt-2 cursor-pointer group p-3 rounded-xl border transition-all duration-300 ${
            extendSupport 
              ? "bg-teal-500/10 border-teal-500/50 shadow-[0_0_15px_rgba(45,212,191,0.1)]" 
              : "bg-white/5 border-white/5 hover:border-white/20"
          }`}
        >
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={extendSupport}
              onChange={() => setExtendSupport(!extendSupport)}
              className="w-4 h-4 rounded border-white/10 bg-slate-800 text-teal-500 focus:ring-teal-500 cursor-pointer" 
            />
            <span className={`text-xs transition font-medium ${extendSupport ? "text-white" : "text-slate-400"}`}>
              Extend support to 12 months
            </span>
          </div>
          <span className={`font-bold text-xs ${extendSupport ? "text-teal-400" : "text-slate-500"}`}>
            +${supportPrice}
          </span>
        </label>
      </div>

      {/* ACTIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Quantity</label>
          <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl overflow-hidden">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="px-3 py-2 hover:bg-white/5 text-slate-400 transition"
            >
              <Minus size={14} />
            </button>
            <input type="number" value={quantity} readOnly className="w-10 bg-transparent text-center text-sm font-black text-white focus:outline-none" />
            <button 
              onClick={() => setQuantity(quantity + 1)} 
              className="px-3 py-2 hover:bg-white/5 text-slate-400 transition"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button 
          onClick={() => addItem({ ...product, price: parseFloat(totalPrice) / quantity })}
          className="btn-buy w-full py-4 text-lg"
        >
          <ShoppingCart size={22} />
          Add to Cart
        </button>

        <div className="flex items-center justify-center gap-2 py-2 text-teal-500/80 group cursor-default">
          <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold uppercase tracking-wider">100% Money Back Guarantee</span>
        </div>

        <div className="pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Secure Checkout</p>
          <div className="flex items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
              alt="PayPal" 
              width={75} 
              height={20} 
            />
            <div className="flex items-center gap-2 text-white">
              <CreditCard size={16} />
              <span className="text-[10px] font-black tracking-tighter uppercase">Cards</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}