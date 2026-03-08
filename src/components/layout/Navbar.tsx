"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Menu, X, ShoppingBag, 
  User as UserIcon, LogOut, LayoutDashboard, ChevronDown 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { deleteAuthSession } from "@/app/actions/auth";
import { supabase } from "@/lib/supabase";

function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1 -right-1 w-5 h-5 bg-[#f97316] text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-[#020617]"
    >
      {items.length}
    </motion.span>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  
  const { user, logout } = useAuth();
  const clearCart = useCartStore((state) => state.clearCart);

  // Fungsi helper untuk menutup semua menu (dropdown & mobile)
  const closeMenus = () => {
    setIsOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout(); 
      await deleteAuthSession();
      if (clearCart) clearCart(); 
      localStorage.removeItem("pixie-cart"); 
      localStorage.removeItem("supabase.auth.token");
      localStorage.removeItem("pixie-auth-token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  }, [logout, clearCart]);

  // LOGIKA ANTI HANTU (Tetap di useEffect karena ini sinkronisasi dengan External System/DB)
  useEffect(() => {
    const syncWithDatabase = async () => {
      if (user) {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          handleLogout();
        }
      }
    };
    syncWithDatabase();
  }, [user, handleLogout]); 

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-slate-900/40 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-[2rem] shadow-2xl">
        
   {/* Brand Logo */}
        <Link href="/" onClick={closeMenus} className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 group-hover:rotate-12 transition-transform duration-300">
            <Image
              src="/pixie.png"
              alt="Pixie Logo"
              fill
              className="object-contain"
              priority
            />     
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase">
            PIXIE<span className="text-teal-400">.</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Product", href: "/products" },
            { name: "Docs", href: "/docs" },
            { name: "Support", href: "/support" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenus}
              className={`text-sm font-bold transition-all hover:tracking-widest ${
                pathname === link.href ? "text-teal-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/checkout" onClick={closeMenus}>
            <button className="p-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all relative group border border-white/5">
              <ShoppingBag size={20} />
              <CartBadge />
            </button>
          </Link>

          <div className="hidden md:block">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 bg-white text-slate-950 rounded-full hover:bg-teal-400 transition-all group shadow-lg shadow-white/5"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-teal-400 overflow-hidden relative border border-slate-200/10">
                    {user.avatar_url ? (
                      <Image 
                        src={user.avatar_url} 
                        alt={user.name || "User"} 
                        fill 
                        className="object-cover" 
                        sizes="32px"
                      />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <span className="text-xs font-bold max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-52 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2 rounded-2xl shadow-2xl"
                    >
                      <Link 
                        href="/dashboard" 
                        onClick={closeMenus}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-all"
                      >
                        <LayoutDashboard size={16} className="text-teal-400" /> Dashboard
                      </Link>
                      <div className="my-2 border-t border-white/5" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login" 
                onClick={closeMenus}
                className="px-8 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-full hover:bg-teal-400 transition-all shadow-lg shadow-white/10"
              >
                Sign In
              </Link>
            )}
          </div>

          <button 
            className="md:hidden p-2.5 text-white bg-white/5 rounded-xl border border-white/5"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-28 left-6 right-6 bg-slate-900/95 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] shadow-2xl flex flex-col gap-4"
          >
            {[
              { name: "Home", href: "/" },
              { name: "Product", href: "/products" },
              { name: "Dashboard", href: "/dashboard" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className="text-lg font-bold text-slate-300 px-4 py-3 hover:bg-white/5 hover:text-teal-400 rounded-2xl transition-all border border-transparent hover:border-white/5"
              >
                {link.name}
              </Link>
            ))}
            {!user ? (
              <Link 
                href="/login"
                onClick={closeMenus}
                className="mt-2 w-full py-4 bg-white text-slate-950 text-center font-bold rounded-2xl hover:bg-teal-400 transition-all"
              >
                Sign In
              </Link>
            ) : (
              <button 
                onClick={handleLogout}
                className="mt-2 w-full py-4 bg-red-500/10 text-red-400 text-center font-bold rounded-2xl border border-red-500/20"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}