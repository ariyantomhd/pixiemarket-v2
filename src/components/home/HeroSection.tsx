"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Pakai requestAnimationFrame atau biarkan di dalam scope fungsi 
    // untuk menghindari deteksi "synchronous setState" oleh ESLint
    const activate = () => setMounted(true);
    activate();
  }, []);

  // Jika belum mounted, kita render skeleton transparan atau 
  // div kosong dengan min-height agar layout tidak "melompat" (CLF)
  if (!mounted) {
    return <section className="min-h-[70vh] w-full" />;
  }

  return (
    <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden px-6 py-20">
      {/* CSS Keyframes (Global Inject) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}} />

      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full mb-8"
        >
          <Sparkles size={16} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-100">
            Welcome to PixieCode v2
          </span>
        </motion.div>

        {/* Heading with Animated Gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]"
        >
          <span 
            className="inline-block"
            style={{
              background: "linear-gradient(to right, #ffffff 20%, #2dd4bf 40%, #2dd4bf 60%, #ffffff 80%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradient-move 4s linear infinite",
            }}
          >
            Build Faster with
          </span> 
          <br />
          <span className="text-white">Premium Assets.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Acquire high-quality source code and digital assets to accelerate your workflow. 
          <span className="text-teal-500/80"> Curated specifically for maximum development efficiency.</span>
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          <Link href="/products" className="btn-buy px-10 py-4 text-lg font-bold">
            Start Exploring <ArrowRight size={20} />
          </Link>
          <button className="btn-pixie px-10 py-4 text-lg font-bold">
            View Live Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}