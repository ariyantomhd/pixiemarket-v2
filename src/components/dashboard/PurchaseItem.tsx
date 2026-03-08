"use client";

import Image from "next/image";
import { Download, FileText, History, Star } from "lucide-react";
import { Product } from "@/types"; // Pastikan path ke types sudah benar

interface PurchaseItemProps {
  item: Product;
  purchaseDate: string;
  downloadCount?: number;
}

export default function PurchaseItem({ item, purchaseDate, downloadCount = 0 }: PurchaseItemProps) {
  return (
    <div className="pixie-glass p-5 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-6 group hover:border-purple-500/30 transition-all shadow-xl">
      {/* Thumbnail */}
      <div className="relative w-full md:w-48 h-28 rounded-xl overflow-hidden shrink-0">
        <Image 
          src={item.image_url} 
          alt={item.name} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 192px"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-tighter">
          {item.category}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
            {item.name}
          </h4>
          <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter border border-emerald-500/20">
            <Star size={10} fill="currentColor" /> Owned
          </span>
        </div>

        <div className="flex gap-4 text-xs text-white/30 mb-4 font-tech">
          <span className="flex items-center gap-1"><History size={14}/> {purchaseDate}</span>
          <span className="flex items-center gap-1"><Download size={14}/> {downloadCount} Downloads</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex-1 md:flex-none bg-white text-black px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-purple-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
            onClick={() => window.open(item.source_url, '_blank')}
          >
            <Download size={16} /> Download Source
          </button>
          
          {item.doc_url && (
            <button 
              className="flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-white text-[11px] font-black uppercase tracking-wider hover:bg-white/5 transition-all flex"
              onClick={() => window.open(item.doc_url, '_blank')}
            >
              <FileText size={16} /> Documentation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}