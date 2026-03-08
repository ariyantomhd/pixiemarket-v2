"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, FileText, CheckCircle2 } from "lucide-react"; 
import { Product } from "@/types/product";

export default function ProductTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState("description");

  // Tab Support resmi dihapus agar lebih fokus ke konten produk
  const tabs = [
    { id: "description", label: "Description", icon: FileText },
    { id: "reviews", label: "Reviews (12)", icon: Star },
  ];

  return (
    <div className="mt-12 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? "text-teal-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-400 shadow-[0_0_10px_#2dd4bf]" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {activeTab === "description" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-xl font-black text-white mb-4 italic tracking-tight uppercase">Product Features</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.tags?.map((tag: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-teal-500/30 transition-colors">
                    <CheckCircle2 size={18} className="text-teal-400 shrink-0" />
                    <span className="text-slate-300 font-medium">{tag}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div 
              key="rev" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group hover:border-teal-500/20 transition-all">
                <div className="flex items-center gap-1 text-orange-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic text-lg mb-6 leading-relaxed">
                  &quot;Kodenya rapi banget, gampang di-custom sesuai kebutuhan. Bikin development jadi jauh lebih cepet!&quot;
                </p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-[1px]">
                     <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white uppercase">BJ</div>
                   </div>
                   <div>
                     <span className="block text-sm font-bold text-white">@dev_bangjago</span>
                     <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Verified Buyer</span>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}