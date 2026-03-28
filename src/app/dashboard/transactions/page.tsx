// src/app/dashboard/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2, History } from "lucide-react"; // FIX: Hapus ExternalLink

// 1. Definisikan Interface Order untuk menggantikan 'any'
interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
}

export default function TransactionsPage() {
  const { user } = useAuth();
  // 2. Gunakan type Order[] daripada any[]
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, created_at, total_amount, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Casting data hasil fetch ke interface Order
        setOrders((data as unknown as Order[]) || []);
      } catch (err) {
        console.error("Error fetching transactions:", err instanceof Error ? err.message : err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar user={user} />
        <main className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem]">
          <div className="flex items-center gap-3 mb-8">
             <div className="p-3 bg-teal-400/10 text-teal-400 rounded-2xl">
                <History size={24} />
             </div>
             <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Transaction History</h1>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-teal-400" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Loading History...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <th className="px-6 py-2">Order ID</th>
                    <th className="px-6 py-2">Date</th>
                    <th className="px-6 py-2">Amount</th>
                    <th className="px-6 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="group bg-white/5 hover:bg-white/10 transition-colors">
                      <td className="px-6 py-4 rounded-l-2xl text-xs font-mono text-teal-400">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 text-xs text-white/60">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-white text-sm">
                        Rp {order.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 rounded-r-2xl">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'bg-teal-400/10 text-teal-400' : 'bg-orange-400/10 text-orange-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}