import { supabase } from "@/lib/supabase";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedSection from "@/components/home/FeaturedSection";
import PopularSection from "@/components/home/PopularSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ExploreCTA from "@/components/home/ExploreCTA";

// Revalidate every 1 hour (ISR)
export const revalidate = 3600; 

export default async function HomePage() {
  // 1. Concurrent Fetching for better performance
  const [
    { data: featuredProducts, error: featuredError },
    { data: popularProducts, error: popularError },
    { data: flashSaleProducts, error: flashError }
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .limit(4),
    
    supabase
      .from("products")
      .select("*")
      .eq("is_trending", true)
      .limit(4),
    
    supabase
      .from("products")
      .select("*")
      .not("discount_percentage", "is", null)
      .order("discount_percentage", { ascending: false })
      .limit(4)
  ]);

  if (featuredError || popularError || flashError) {
    console.error("Supabase Data Acquisition Error:", { 
      featuredError, 
      popularError, 
      flashError 
    });
  }

  return (
    <div className="relative z-10 flex flex-col pb-32 bg-transparent overflow-x-hidden">
      
      {/* SECTION 1: HERO & CATEGORY NODE */}
      <div className="relative flex flex-col"> 
        <HeroSection />
        
        {/* Negative margin elevates CategorySection into the Hero area for a modern layered look */}
        <div className="relative z-20 -mt-10 md:-mt-24 max-w-7xl mx-auto px-6 w-full">
          <CategorySection />
        </div>
      </div>

      {/* SECTION 2: DISCOVERY CONTENT */}
      <div className="flex flex-col gap-y-32 md:gap-y-40 mt-24 md:mt-32">
        
        {/* FEATURED ASSETS */}
        <div className="max-w-7xl mx-auto px-6 w-full">
          <FeaturedSection products={featuredProducts || []} />
        </div>
        
        {/* FLASH SALE PROTOCOL (With Decorative Glow) */}
        <section className="relative w-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <FlashSaleSection products={flashSaleProducts || []} />
          </div>
        </section>
        
        {/* TRENDING INTELLIGENCE (Popular Section) */}
        <div className="max-w-7xl mx-auto px-6 w-full">
          <PopularSection products={popularProducts || []} />
        </div>

        {/* SECTION 3: FINAL CONVERSION CTA */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-10">
          <ExploreCTA />
        </div>
      </div>

    </div>
  );
}