"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  TrendingUp, Package, Users, ShoppingCart, 
  ArrowUpRight, Clock, ShieldCheck, Send, Twitter, Save, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 124,
    totalUsers: 0,
    revenue: 4520.50
  });
  const [loading, setLoading] = useState(true);
  
  // State untuk Global Social Links
  const [socialLinks, setSocialLinks] = useState({ telegram: "", x: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // 1. Get Stats
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Get Global Settings (Telegram & X)
      // Asumsi kita simpan di tabel 'site_settings' atau 'profiles' admin
      const { data: settings } = await supabase
        .from('site_settings') 
        .select('telegram_link, x_link')
        .single();

      if (settings) {
        setSocialLinks({ 
          telegram: settings.telegram_link || "", 
          x: settings.x_link || "" 
        });
      }

      setStats(prev => ({
        ...prev,
        totalProducts: productCount || 0,
        totalUsers: userCount || 0,
      }));
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleUpdateSocials = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          id: 1, // Kita pakai ID 1 untuk row setting global
          telegram_link: socialLinks.telegram, 
          x_link: socialLinks.x,
          updated_at: new Date()
        });

      if (error) throw error;
      toast.success("Social protocols synced!");
    } catch (err) {
      toast.error("Failed to update link");
    } finally {
      setIsUpdating(false);
    }
  };

  const statCards = [
    { label: "Total Assets", value: stats.totalProducts, icon: Package, color: "text-teal-400", bg: "bg-teal-400/10" },
    { label: "Total Sales", value: stats.totalSales, icon: ShoppingCart, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Active Warriors", value: stats.totalUsers, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Net Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter">
            System <span className="text-teal-400">Overview</span>
          </h1>
          <p className="text-xs text-white/40 font-bold uppercase tracking-[0.3em] mt-1">
            Welcome back, Commander. All systems operational.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-teal-400">
          <ShieldCheck size={14} /> Server Status: Secure
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:border-teal-500/30 transition-all group relative overflow-hidden"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 tracking-tighter italic">{loading ? "..." : stat.value}</h3>
            <ArrowUpRight size={20} className="absolute top-6 right-6 text-white/10 group-hover:text-teal-500/40 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Recent Activity & Social Config */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Products */}
        <div className="xl:col-span-2 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-teal-400" /> Recent Deployments
            </h3>
            <button className="text-[10px] font-black uppercase text-teal-400 hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 px-4 py-2 text-[10px] font-black text-white/20 uppercase tracking-widest border-b border-white/5">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="grid grid-cols-4 px-4 py-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all items-center">
                <span className="text-xs font-bold truncate pr-4 italic text-white/80">Warrior Script v{i+1}.0</span>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Source Code</span>
                <span className="text-xs font-black text-teal-400">$45.00</span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-tighter">Live</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL CONFIG SECTION (Telegram & X) */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-[#0a0b10] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Send size={80} />
            </div>
            
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              System_Links <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Telegram_Protocol</label>
                <div className="relative">
                  <Send className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    placeholder="https://t.me/..."
                    value={socialLinks.telegram}
                    onChange={(e) => setSocialLinks({...socialLinks, telegram: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-teal-400 outline-none focus:border-teal-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">X_Communications</label>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    placeholder="https://x.com/..."
                    value={socialLinks.x}
                    onChange={(e) => setSocialLinks({...socialLinks, x: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-blue-400 outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdateSocials}
                disabled={isUpdating}
                className="w-full mt-2 bg-white text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Sync_Protocols
              </button>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-teal-500/20">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">Quick Actions</h3>
            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
              Flush_System_Cache
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}