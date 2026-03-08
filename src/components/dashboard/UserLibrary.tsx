"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import StatsGrid from "./StatsGrid";
import PurchaseList from "./PurchaseList";
import { PurchaseOrderItem } from "@/types/order";
import { User } from "@/types/user"; // Import interface User yang benar

interface UserLibraryProps {
  user: User | null; 
}

export default function UserLibrary({ user }: UserLibraryProps) {
  const [library, setLibrary] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchLibraryData = useCallback(async () => {
    // Pastikan user ID ada sebelum fetch
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Fetch data menggunakan konsep Product + LibraryItem
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
        .eq('orders.status', 'completed') // Hanya produk yang sudah lunas (Library)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Library Fetch Error:", error.message);
        return;
      }

      if (data) {
        // Casting data ke PurchaseOrderItem[]
        const typedData = data as unknown as PurchaseOrderItem[];
        setLibrary(typedData);
        
        // Kalkulasi investasi total khusus aset di Library
        const total = typedData.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
        setTotalSpent(total);
      }
    } catch (err) {
      console.error("Critical Library Error:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  return (
    <div className="flex flex-col gap-8">
      {/* StatsGrid sekarang menerima User yang valid (punya username & name) */}
      <StatsGrid user={user} totalSpent={totalSpent} count={library.length} />
      
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-orange-500" size={32} />
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Accessing Your Vault...
          </p>
        </div>
      ) : (
        /* PurchaseList menampilkan koleksi library */
        <PurchaseList items={library} />
      )}
    </div>
  );
}