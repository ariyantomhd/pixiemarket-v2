"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Package, PlusCircle, 
  Users, Settings, ChevronRight, Menu, X,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Assets Management", href: "/admin/products", icon: Package },
  { name: "Add New Product", href: "/admin/add-product", icon: PlusCircle },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Global Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-teal-500/30">
      
      {/* 1. Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900/40 border-r border-white/5 backdrop-blur-xl sticky top-0 h-screen p-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="text-slate-950 font-black italic text-lg">PX</span>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase italic tracking-tighter">
              Pixie<span className="text-teal-400">Admin</span>
            </h2>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Control Center v1.0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.href || 
                            (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all border ${
                  isActive 
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.05)]" 
                  : "hover:bg-white/5 text-slate-400 hover:text-white border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-teal-400" : "text-slate-500 group-hover:text-white transition-colors"} />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <ChevronRight size={14} className="text-teal-500" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Cleaned Version) */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
            <ShieldCheck size={16} className="text-teal-400/50" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Secure Session</span>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center">
            <span className="text-slate-950 font-black text-xs">PX</span>
          </div>
          <h2 className="text-xs font-black uppercase italic tracking-tighter">Pixie<span className="text-teal-400">Admin</span></h2>
        </div>
        <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-white/5 rounded-xl text-teal-400">
          <Menu size={20} />
        </button>
      </div>

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full lg:max-w-[calc(100%-18rem)] pt-20 lg:pt-0">
        <div className="h-full min-h-screen relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] -z-10 rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] -z-10 rounded-full" />
          
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* 4. Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 z-[70] w-4/5 h-full bg-[#020617] p-8 border-r border-white/10 lg:hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-black italic text-teal-400 uppercase tracking-widest text-xs">Menu Control</span>
                <button onClick={() => setIsMobileOpen(false)} className="text-white/40"><X size={24} /></button>
              </div>
              
              <div className="space-y-3 flex-1">
                {sidebarLinks.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link 
                      key={item.href} href={item.href} 
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] py-4 px-4 rounded-xl border transition-all ${
                        isActive ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "text-white/40 border-transparent"
                      }`}
                    >
                      <item.icon size={18} /> {item.name}
                    </Link>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}