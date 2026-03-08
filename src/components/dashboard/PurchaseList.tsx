"use client";

import { Library, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import PurchaseItem from "./PurchaseItem";
// Import interface yang sudah kita buat sebelumnya
import { PurchaseOrderItem } from "@/types/order";

// 1. Definisikan bentuk props menggunakan interface yang benar (Bukan any lagi)
interface PurchaseListProps {
  items: PurchaseOrderItem[]; 
}

// 2. Gunakan interface tersebut di fungsi komponen
export default function PurchaseList({ items }: PurchaseListProps) {
  return (
    <section className="flex flex-col gap-6 mb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
            <Library size={20} />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight uppercase">Purchased Codes</h3>
        </div>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
          <input 
            type="text" 
            placeholder="Search your library..." 
            className="bg-white/5 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm outline-none focus:border-orange-500/50 w-64 transition-all placeholder:text-white/20 text-white" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {items && items.length > 0 ? (
          items.map((order) => (
            <PurchaseItem 
              key={order.id}
              item={order.products} 
              purchaseDate={new Date(order.created_at).toLocaleDateString()} 
            />
          ))
        ) : (
          <div className="pixie-glass p-20 rounded-[2.5rem] border border-white/5 text-center bg-slate-900/40">
            <ShoppingBag className="mx-auto text-white/10 mb-4" size={48} />
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">No assets found in your vault.</p>
            <Link href="/products" className="text-orange-500 text-[10px] font-black uppercase mt-4 block hover:underline">
              Start Exploring Gear
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}