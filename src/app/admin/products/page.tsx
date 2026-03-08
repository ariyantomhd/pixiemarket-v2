"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";
import { 
  Edit3, Trash2, Search, 
  Filter, Plus, PackageOpen, Loader2 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Ambil Data dari Tabel 'products'
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase // Ganti nama agar tidak konflik
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (data) setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 2. Fungsi Penyelamat Gambar (Anti-Crash URL)
  const getValidSrc = (src: string | undefined | null) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('/')) return src;
    return `/${src}`;
  };

  // 3. Fungsi Hapus Asset
  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Hapus gear "${name}" dari database, Bang?`)) {
      try {
        const { error: deleteError } = await supabase.from('products').delete().eq('id', id);
        if (deleteError) throw deleteError;
        fetchProducts(); 
      } catch (err) {
        console.error("Delete error:", err);
        alert("Gagal menghapus data!");
      }
    }
  };

  // 4. Filter Berdasarkan Search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Product <span className="text-teal-400">Inventory</span>
          </h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">
            Control center for your digital deployments.
          </p>
        </div>
        
        <Link href="/admin/product/add" 
          className="flex items-center justify-center gap-2 bg-teal-500 text-slate-950 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* --- TOOLBAR --- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by gear name..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs text-white outline-none focus:border-teal-400/50 transition-all font-bold uppercase tracking-wider"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* --- TABLE DATA --- */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-6 py-6">Category</th>
                <th className="px-6 py-6">Price</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <Loader2 className="animate-spin mx-auto mb-4 text-teal-400" size={40} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Syncing with database...</p>
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <PackageOpen className="mx-auto mb-4 opacity-10 text-white" size={60} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Empty Inventory</p>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={product.id} 
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 overflow-hidden border border-white/10 relative">
                            {/* FIX: Gunakan optional chaining dan pastikan array ada isinya */}
                            {product.images && product.images.length > 0 && getValidSrc(product.images[0]) ? (
                              <Image 
                                src={getValidSrc(product.images[0])!} 
                                alt={product.name} 
                                fill 
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="56px"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/5 italic text-[8px] bg-black/20">No Img</div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-black uppercase italic tracking-tight text-white group-hover:text-teal-400 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-[9px] text-teal-400/50 font-bold uppercase tracking-tighter">
                              {product.slug || 'no-slug'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase text-white/60">
                          {product.category || 'General'}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="font-black text-emerald-400 text-sm">${product.price}</span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            href={`/admin/products/edit/${product.id}`} 
                            className="p-3 bg-white/5 hover:bg-teal-500 hover:text-slate-950 rounded-xl transition-all border border-white/5 active:scale-90"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-3 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all border border-white/5 active:scale-90"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}