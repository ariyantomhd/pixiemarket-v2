"use client";
import { ShoppingBag, Wallet, Star } from "lucide-react";
import { User } from "@/types/user";

interface StatsGridProps {
  user: User | null;
  totalSpent: number;
  count: number;
}

export default function StatsGrid({ user, totalSpent, count }: StatsGridProps) {
  const stats = [
    { label: "PURCHASED", value: count.toString(), icon: <ShoppingBag size={20} />, color: "text-purple-400" },
    { label: "INVESTED", value: `$${totalSpent.toFixed(2)}`, icon: <Wallet size={20} />, color: "text-emerald-400" },
    { label: "STATUS", value: user?.role === 'admin' ? 'Admin' : 'User', icon: <Star size={20} />, color: "text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="pixie-glass p-6 rounded-3xl border border-white/5 flex items-center gap-4 bg-slate-900/40">
          <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
          <div>
            <p className="text-[10px] font-black tracking-widest text-white/40 uppercase">{stat.label}</p>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}