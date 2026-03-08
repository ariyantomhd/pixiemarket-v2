import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 py-10 mt-10">
      {/* Container - Border disesuaikan dengan aura Dark V2 */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 pt-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
        
        {/* Brand Side - Konsisten dengan warna White/Teal */}
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
            <Sparkles size={14} fill="currentColor" />
          </div>
          <span className="font-black text-lg tracking-tighter text-white uppercase">
            PIXIE MARKET
          </span>
        </div>

        {/* Copyright - Menggunakan variabel pc-text-soft */}
        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 order-3 md:order-2">
          © {new Date().getFullYear()} Pixie. Made with 
          <Heart size={10} className="text-orange-500 fill-orange-500 animate-pulse" /> 
          for Devs.
        </p>

        {/* Links - Hover diganti ke warna Teal sesuai Design System */}
        <div className="flex gap-6 text-[11px] font-bold text-slate-500 order-2 md:order-3">
          <a href="#" className="hover:text-teal-400 transition-colors tracking-widest">TWITTER</a>
          <a href="#" className="hover:text-teal-400 transition-colors tracking-widest">DISCORD</a>
          <a href="#" className="hover:text-teal-400 transition-colors tracking-widest">TERMS</a>
        </div>
        
      </div>
    </footer>
  );
}