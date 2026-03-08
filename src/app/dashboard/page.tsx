"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/dashboard/Sidebar";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PurchaseList from "@/components/dashboard/PurchaseList";

// 1. Pakai Type yang sudah kita buat di folder types
import { PurchaseOrderItem } from "@/types/order";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // 2. Gunakan PurchaseOrderItem[] agar sinkron dengan PurchaseList
  const [purchases, setPurchases] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchUserData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          created_at,
          price:price_at_purchase,
          orders!inner (user_id, status),
          products!product_id (
            id, 
            name, 
            slug,
            description,
            price,
            images,
            category,
            file_url,
            version,
            file_size,
            tech_stack,
            created_at
          )
        `)
        .eq('orders.user_id', user.id)
        .eq('orders.status', 'completed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase Error:", error.message);
        return;
      }

      if (data) {
        // 3. Casting ke PurchaseOrderItem[]
        const typedData = data as unknown as PurchaseOrderItem[];
        setPurchases(typedData);
        
        const total = typedData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        setTotalSpent(total);
      }
    } catch (err) {
      console.error("Critical Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchUserData(); }, [fetchUserData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen flex flex-col gap-8">
      <div className="flex items-center justify-start pt-4">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 border border-white/5">
            <ChevronLeft size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Back to Home</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar user={user} />
        
        <main className="flex-1 flex flex-col gap-8">
          <StatsGrid user={user} totalSpent={totalSpent} count={purchases.length} />
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-orange-500" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Accessing Database...</p>
            </div>
          ) : (
            <PurchaseList items={purchases} />
          )}
        </main>
      </div>
    </div>
  );
}