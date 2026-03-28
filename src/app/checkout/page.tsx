"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { ArrowLeft, CreditCard, Trash2, CheckCircle2, Circle, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { items, removeItem, completePurchase } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // 1. Handle Hydration & Auto-select items
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setSelectedIds(items.map(item => item.id));
    }, 0);
    return () => clearTimeout(timer);
  }, [items]); 

  // 2. Logic Checklist Item
  const toggleSelect = (id: string | number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // 3. Calculate Total Based on Selection
  const selectedTotal = items
    .filter(item => selectedIds.includes(item.id))
    .reduce((acc, item) => acc + item.price, 0);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 relative font-sans min-h-screen text-white">
      {/* Navigation: Back Button */}
      <Link href="/" className="flex items-center gap-2 text-pc-text-soft hover:text-white transition mb-8 w-fit group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Marketplace</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: ORDER LIST */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-black tracking-tight uppercase italic">Checkout List</h1>
          
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-500 ${
                    selectedIds.includes(item.id) 
                      ? "pixie-glass border-pc-purple-accent/50 shadow-[0_0_20px_rgba(205,180,255,0.1)]" 
                      : "bg-white/5 border-white/5 opacity-50 backdrop-blur-sm"
                  }`}
                >
                  <button onClick={() => toggleSelect(item.id)} className="flex-shrink-0">
                    {selectedIds.includes(item.id) ? (
                      <CheckCircle2 className="text-pc-purple-accent" size={26} />
                    ) : (
                      <Circle className="text-white/20" size={26} />
                    )}
                  </button>

                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white/10 border border-white/10">
                    <Image 
                      src={item.image_url && item.image_url.startsWith('http') ? item.image_url : `https://placehold.co/200x200/4a3b76/white?text=Item`} 
                      alt={item.name} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-white text-base line-clamp-1">{item.name}</h4>
                    <p className="text-pc-purple-accent font-black text-lg">${item.price.toFixed(2)}</p>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="p-3 hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-all rounded-2xl"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-24 text-center pixie-glass border-dashed bg-transparent flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={24} className="text-pc-text-soft opacity-40" />
                </div>
                <p className="text-pc-text-soft font-medium italic">Oops! Your cart is currently empty.</p>
                <Link href="/products" className="text-pc-purple-accent font-bold underline mt-2 inline-block hover:text-white transition">Start Exploring</Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="lg:col-span-1">
          <div className="pixie-glass p-8 sticky top-32 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <CreditCard className="text-pc-purple-accent" /> Order Summary
            </h2>
            
            <div className="space-y-4 py-4 border-y border-white/10">
              <div className="flex justify-between text-pc-text-soft font-medium">
                <span>Selected Items ({selectedIds.length})</span>
                <span>${selectedTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-pc-text-soft/50 text-xs italic">
                <span>Transaction Tax</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-pc-text-soft uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-white tracking-tighter">
                ${selectedTotal.toFixed(2)}
              </span>
            </div>

            <div className="relative z-0 pt-2">
              {selectedIds.length > 0 ? (
                <div className="space-y-3">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 bg-white/5 rounded-3xl border border-white/10">
                      <Loader2 className="animate-spin text-pc-purple-accent" size={32} />
                      <p className="text-xs font-bold text-pc-text-soft animate-pulse uppercase tracking-wider">Processing Payment...</p>
                    </div>
                  ) : (
                    <PayPalButtons
                      style={{ 
                        layout: "vertical", 
                        color: "gold", 
                        shape: "pill", 
                        label: "checkout",
                        height: 50 
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{
                            amount: { 
                              currency_code: "USD", 
                              value: selectedTotal.toFixed(2) 
                            },
                          }],
                        });
                      }}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          setIsProcessing(true);
                          await actions.order.capture();
                          
                          // Execute move data to dashboard/library
                          completePurchase(selectedIds);
                          
                          setIsProcessing(false);
                          setIsSuccess(true);
                          
                          // Redirect to dashboard after 3.5s
                          setTimeout(() => {
                            window.location.href = "/dashboard";
                          }, 3500);
                        }
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="p-6 bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 text-center">
                  <p className="text-xs font-semibold text-pc-text-soft leading-relaxed uppercase tracking-tight">
                    Please select items from the list <br /> to proceed with payment
                  </p>
                </div>
              )}
            </div>

            <p className="text-[10px] text-center text-pc-text-soft/60 leading-relaxed px-4">
              Secure checkout by PayPal. By proceeding, you agree to PixieMarket&apos;s terms of service.
            </p>
          </div>
        </div>
      </div>

      {/* OVERLAY: SUCCESS ANIMATION */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="pixie-glass p-12 text-center border-pc-purple-accent/50 max-w-md mx-4"
            >
              <CheckCircle2 size={60} className="mx-auto text-pc-purple-accent mb-4 animate-bounce" />
              <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Payment Successful!</h2>
              <p className="text-pc-text-soft font-medium">Your assets are being moved to your digital library...</p>
              
              <div className="mt-8 flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-pc-purple-accent" size={20} />
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Redirecting to Dashboard</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}