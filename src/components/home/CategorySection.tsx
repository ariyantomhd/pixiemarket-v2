"use client";

import Link from "next/link"; // FIX: Import Link
import { Code2, Cpu, Globe, Layout } from "lucide-react"; // FIX: Import Icons

// FIX: Pastikan variabel categories ada di dalam file ini (di luar fungsi komponen)
const categories = [
  { 
    name: "Source Code", 
    slug: "Source Code", 
    icon: <Code2 />, 
    count: "120+ Items" 
  },
  { 
    name: "Web Templates", 
    slug: "Web Templates", 
    icon: <Layout />, 
    count: "85 Items" 
  },
  { 
    name: "Smart Contracts", 
    slug: "Smart Contracts", 
    icon: <Cpu />, 
    count: "40 Items" 
  },
  { 
    name: "SaaS Kits", 
    slug: "SaaS Kits", 
    icon: <Globe />, 
    count: "25 Items" 
  },
];

export default function CategorySection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/shop?category=${encodeURIComponent(cat.slug)}`}
            className="pixie-card group hover:border-teal-500/40"
          >
            <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 mb-6">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl text-white group-hover:text-teal-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-slate-500 mt-2">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}