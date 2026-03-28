"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Globe, ShieldCheck, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react"; // Tambah useMemo

import { pixieBranding } from "@/lib/branding";
import { Product } from "@/types/product";
import { getDummyProducts } from "@/components/products/dummy-data";

import PriceBox from "@/components/productdetail/PriceBox";
import ProductTabs from "@/components/productdetail/ProductTabs";
import InfoBox from "@/components/productdetail/InfoBox";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Logic Fetching (Yang tadi ketinggalan)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const allProducts = await getDummyProducts();
        const found = allProducts.find((p: Product) => p.slug === slug);
        
        if (found) {
          setProduct(found);
          if (found.images && found.images.length > 0) {
            setMainImage(found.images[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) fetchProduct();
  }, [slug]);

  // 2. Wrap images di useMemo biar ESLint nggak ngomel di useCallback
  const images = useMemo(() => product?.images || [], [product]);
  const currentIndex = images.indexOf(mainImage);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setMainImage(images[nextIndex]);
  }, [currentIndex, images]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images.length === 0) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setMainImage(images[prevIndex]);
  }, [currentIndex, images]);

  // 3. Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, handleNext, handlePrev]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-teal-500 font-bold">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 mr-3"></div>
        Loading Pixie Assets...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h2 className="text-2xl font-bold mb-4">Aset tidak ditemukan, Bang!</h2>
        <Link href="/products" className="btn-pixie px-6 py-2">Kembali ke Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 z-[110] p-4 bg-white/5 hover:bg-red-500/20 text-white rounded-full border border-white/10 transition-all"
            >
              <X size={28} />
            </button>

            {images.length > 1 && (
              <button 
                onClick={handlePrev}
                className="absolute left-4 md:left-10 z-[110] p-5 bg-white/5 hover:bg-teal-500/20 text-white rounded-full border border-white/10 transition-all group"
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </button>
            )}

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full h-[80vh] rounded-[2.5rem] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image 
                src={pixieBranding.img(mainImage || "/placeholder.png")} 
                alt="Full Preview"
                fill
                className="object-contain"
                quality={100}
              />
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 text-sm font-bold">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>

            {images.length > 1 && (
              <button 
                onClick={handleNext}
                className="absolute right-4 md:right-10 z-[110] p-5 bg-white/5 hover:bg-teal-500/20 text-white rounded-full border border-white/10 transition-all group"
              >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
        <Link href="/products" className="hover:text-teal-400 transition flex items-center gap-1 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Marketplace
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 truncate max-w-[300px] font-bold">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="w-full lg:flex-1 min-w-0 space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="pixie-glass p-4 border border-white/5 shadow-2xl"
          >
            <div 
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-slate-900 mb-6 border border-white/5 group cursor-zoom-in"
              onClick={() => setIsModalOpen(true)}
            >
              <Image 
                src={pixieBranding.img(mainImage || "/placeholder.png")} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <ZoomIn className="text-white" size={32} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 px-2">
              <button className="btn-pixie flex items-center gap-2 px-8 py-3.5 whitespace-nowrap group">
                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                Live Preview
              </button>

              <div className="flex flex-1 items-center gap-3 overflow-x-auto py-1 custom-scrollbar">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative w-24 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      mainImage === img ? 'border-teal-500 shadow-lg scale-110 z-10' : 'border-white/5 opacity-50 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <Image src={pixieBranding.img(img)} alt="thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="pixie-glass border border-white/5">
            <ProductTabs product={product} />
          </div>
        </div>

        <aside className="w-full lg:w-[400px] space-y-6">
          <div className="sticky top-24 space-y-6">
            <PriceBox product={product} />
            <InfoBox product={product} />
            <div className="p-6 rounded-[1.5rem] border border-teal-500/10 bg-teal-500/5 flex items-center gap-4">
               <ShieldCheck className="text-teal-400" size={24} />
               <div>
                 <h4 className="text-white font-bold text-sm">PixieCode Verified</h4>
                 <p className="text-slate-500 text-xs">Clean code & secure assets.</p>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}