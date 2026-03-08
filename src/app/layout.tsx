import type { Metadata } from "next";
import "./globals.css";

// Layout Components
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopLoader from "@/components/ui/TopLoader";
import CartDrawer from "@/components/cart/CartDrawer";
import { Suspense } from "react";

// Providers
import PayPalProvider from "@/components/providers/PayPalProvider";
import { AuthProvider } from "@/context/AuthContext"; // 1. Import AuthProvider

/* ============================================================
   PIXIECODE FONT SYSTEM
   ============================================================ */
import {
  Plus_Jakarta_Sans,
  Outfit,
  Space_Grotesk,
} from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-title" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-tech" });

export const metadata: Metadata = {
  title: "PixieCode | Magic Tech Experience",
  description: "Marketplace for premium digital assets and source code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${jakarta.variable} ${outfit.variable} ${grotesk.variable}`}
    >
      <body className="antialiased font-display bg-transparent text-white">
        
        {/* GLOBAL BACKGROUND ENGINE */}
        <div className="bg-pixie" />

        {/* 2. Bungkus SEMUANYA dengan AuthProvider */}
        <AuthProvider>
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>

          <PayPalProvider>
            {/* Sekarang CartDrawer, Navbar, dan Children bisa tau siapa Usernya */}
            <CartDrawer />
            <Navbar />

            <main className="min-h-screen pt-28 overflow-x-hidden relative z-10">
              {children}
            </main>

            <Footer />
          </PayPalProvider>
        </AuthProvider>

        {/* Style override NProgress */}
        <style dangerouslySetInnerHTML={{ __html: `
          #nprogress .bar { background: #2dd4bf !important; height: 3px !important; }
          #nprogress .spinner-icon { border-top-color: #2dd4bf !important; border-left-color: #2dd4bf !important; }
        `}} />
      </body>
    </html>
  );
}