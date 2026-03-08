"use client";

import Link from "next/link"; // FIX: Tambahkan ini
import { ArrowRight } from "lucide-react"; // FIX: Tambahkan ini

export default function ExploreCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 w-full py-20">
      <div className="pixie-glass relative overflow-hidden p-12 md:p-20 text-center border border-teal-500/20 bg-slate-950/50">
        <h2 className="relative z-10 text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
          Ready to build something <span className="text-gradient-teal">amazing?</span>
        </h2>
        <p className="relative z-10 text-slate-400 mb-10 max-w-xl mx-auto text-lg">
          Explore our full marketplace for more premium source codes and digital tools.
        </p>
        <Link href="/shop" className="btn-buy inline-flex px-12 py-5 text-xl">
          Explore All Products
          <ArrowRight size={24} />
        </Link>
      </div>
    </section>
  );
}