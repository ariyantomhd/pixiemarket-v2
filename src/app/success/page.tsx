"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { Suspense } from "react"; // 1. Import Suspense

// 2. Pindahkan logika UI ke komponen terpisah
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Animasi Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-20 animate-pulse" />
        <CheckCircle className="w-20 h-20 text-teal-400 relative z-10" />
      </div>

      <h1 className="text-4xl font-black italic text-white mb-2">
        MAGIC CONFIRMED!
      </h1>
      <p className="text-slate-400 max-w-md mb-8">
        Payment successful for Order <span className="text-teal-400 font-mono">#{orderId?.slice(0, 8) || "N/A"}</span>. 
        Your digital assets are now ready in your vault.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 bg-teal-500 text-slate-950 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
        >
          <Download className="w-5 h-5" />
          Access My Assets
        </Link>
        
        <Link 
          href="/"
          className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
        >
          Continue Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

// 3. Export utama yang membungkus konten dengan Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-black tracking-widest uppercase text-xs">Loading Success Details...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}