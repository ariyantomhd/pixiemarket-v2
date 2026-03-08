"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  
  // Mengambil state dari Zustand
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const setOpen = useCartStore((state) => state.setOpen);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // Perbaikan ESLint: Gunakan callback untuk memisahkan render cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Selama proses Server Side Rendering, jangan tampilkan apapun
  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />

          {/* Panel Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[151] flex flex-col"
          >
            {/* --- HEADER --- */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-500/10 rounded-lg">
                  <ShoppingBag className="text-teal-500" size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-800 leading-none">Your Cart</h2>
                  <p className="text-xs text-slate-400 mt-1">{items.length} items selected</p>
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors group"
                aria-label="Close cart"
              >
                <X size={24} className="text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>

            {/* --- LIST ITEMS --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <ShoppingBag size={48} />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold text-lg">Empty Bag</p>
                    <p className="text-slate-400 text-sm max-w-[200px] mx-auto">
                      Looks like you haven&apos;t added any magic yet!
                    </p>
                  </div>
                  <button 
                    onClick={() => setOpen(false)}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                      <Image 
                        src={
                          item.image_url && (item.image_url.startsWith('http') || item.image_url.startsWith('/'))
                            ? item.image_url 
                            : '/placeholder.png'
                        } 
                        alt={item.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-teal-500 font-black mt-1">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] text-slate-400 flex items-center gap-1.5 hover:text-red-500 transition-colors w-fit"
                      >
                        <Trash2 size={13} /> 
                        <span>Remove Item</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* --- FOOTER / SUMMARY --- */}
            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Subtotal</span>
                    <p className="text-slate-500 text-[10px]">Taxes & Fees included</p>
                  </div>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                
                <Link href="/checkout" onClick={() => setOpen(false)} className="block">
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-slate-200">
                    Go to Checkout
                    <ArrowRight size={20} />
                  </button>
                </Link>

                <p className="text-[10px] text-center text-slate-400 italic">
                  PixieCode secure checkout via PayPal
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}