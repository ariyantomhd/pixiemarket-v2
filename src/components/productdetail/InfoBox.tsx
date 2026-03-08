"use client";

import { Calendar, ShoppingBag, Tag, Monitor, Box } from "lucide-react";
import { Product } from "@/types/product";

export default function InfoBox({ product }: { product: Product }) {
  const infoItems = [
    { icon: Calendar, label: "Released", value: "24 May 2024" },
    { icon: Calendar, label: "Last Update", value: "10 Feb 2026" },
    { icon: ShoppingBag, label: "Sales", value: `${product.sold_count || 0} Assets` },
    { icon: Tag, label: "Category", value: product.category },
    { icon: Monitor, label: "Framework", value: product.tech_stack?.[0] || "Next.js 14" },
  ];

  return (
    <div className="pixie-glass p-6 border border-white/5 shadow-xl space-y-6">
      <div className="flex items-center gap-2 border-b border-white/5 pb-4">
        <Box size={18} className="text-teal-400" />
        <h4 className="font-black text-white text-xs uppercase tracking-[0.2em]">
          Product Specs
        </h4>
      </div>
      
      <div className="space-y-5">
        {infoItems.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm group">
            <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-300 transition-colors">
              <item.icon size={16} className="text-slate-600 group-hover:text-teal-500 transition-colors" />
              <span className="font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-slate-200">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}