"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ShieldCheck, Globe } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Import Branding & Data
import { pixieBranding } from "@/lib/branding";
import { Product } from "@/types/product";
import { getDummyProducts } from "@/components/products/dummy-data";

// Import Modular Components
import PriceBox from "@/components/productdetail/PriceBox";
import ProductTabs from "@/components/productdetail/ProductTabs";
import InfoBox from "@/components/productdetail/InfoBox";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      const allProducts = await getDummyProducts();
      const found = allProducts.find((p: Product) => p.slug === slug);
      const targetProduct = found || allProducts[0];
      setProduct(targetProduct);
      
      if (targetProduct?.images && targetProduct.images.length > 0) {
        setMainImage(targetProduct.images[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* BREADCRUMB / BACK NAVIGATION */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
        <Link 
          href="/products" 
          className="hover:text-teal-400 transition flex items-center gap-1 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Marketplace
          {/* IMPLEMENTASI EXTERNALLINK DI SINI */}
          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 truncate max-w-[300px] font-bold">
          {product.name}
        </span>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* === LEFT COLUMN: CONTENT AREA (65%) === */}
        <div className="w-full lg:flex-1 min-w-0 space-y-8">
          
          {/* IMAGE PREVIEW BOX */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pixie-glass p-4 border border-white/5 shadow-2xl overflow-hidden"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-slate-900 mb-6 border border-white/5 group">
              <Image 
                src={pixieBranding.img(mainImage || "/placeholder.png")} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            </div>
            
            <div className="flex flex-wrap items-center gap-6 px-2">
              <button className="btn-pixie flex items-center gap-2 px-8 py-3.5 whitespace-nowrap group">
                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                Live Preview
              </button>

              <div className="flex flex-1 items-center gap-3 overflow-x-auto py-1 custom-scrollbar">
                {product.images?.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      mainImage === img 
                        ? 'border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.3)]' 
                        : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <Image 
                      src={pixieBranding.img(img)} 
                      alt={`Thumbnail ${index}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="pixie-glass border border-white/5">
            <ProductTabs product={product} />
          </div>

        </div>

        {/* === RIGHT COLUMN: SIDEBAR AREA (35%) === */}
        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="sticky top-24 space-y-6">
            <PriceBox product={product} />
            <InfoBox product={product} />

            <div className="p-6 rounded-[1.5rem] border border-teal-500/10 bg-teal-500/5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <ShieldCheck size={24} />
               </div>
               <div>
                  <h4 className="text-white font-bold text-sm">PixieCode Verified</h4>
                  <p className="text-slate-500 text-xs">Clean code & secure assets guaranteed.</p>
               </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}