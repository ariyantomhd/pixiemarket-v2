"use client";

import { useState, Suspense } from "react"; // 1. Tambahkan Suspense
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import LegalModal from "@/components/modal/LegalModal";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-12 bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="flex items-center gap-3 group mb-3">
            <div className="relative w-16 h-16 group-hover:rotate-12 transition-transform duration-300">
              <Image
                src="/pixie.png"
                alt="Pixie Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-[1px] w-4 bg-white/20"></span>
            <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase">
              Marketplace for Warriors
            </p>
            <span className="h-[1px] w-4 bg-white/20"></span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          {/* Custom Tabs Header */}
          <div className="flex p-2 bg-black/20 m-4 rounded-2xl gap-1 border border-white/5">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 relative ${
                activeTab === "login" ? "text-teal-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === "login" && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10" 
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 relative ${
                activeTab === "register" ? "text-teal-400" : "text-slate-400 hover:text-white"
              }`}
            >
              {activeTab === "register" && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10" 
                />
              )}
              <span className="relative z-10">Sign Up</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 pt-4">
            {/* 2. Bungkus AnimatePresence dengan Suspense untuk menangani useSearchParams */}
            <Suspense fallback={
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "login" ? 10 : -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {activeTab === "login" ? (
                    <SignInForm />
                  ) : (
                    <SignUpForm onOpenModal={(type) => setLegalModal(type)} />
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setLegalModal("terms")}
            className="text-[10px] text-white uppercase font-bold tracking-widest hover:text-teal-400 transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-white/20 text-[10px]">•</span>
          <button 
            onClick={() => setLegalModal("privacy")}
            className="text-[10px] text-white uppercase font-bold tracking-widest hover:text-orange-400 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
      </motion.div>

      {/* Legal Modals */}
      <LegalModal
        isOpen={legalModal === "terms"}
        onClose={() => setLegalModal(null)}
        type="terms"
        title="Terms & Conditions"
      >
        <div className="space-y-4 text-white/70 text-sm leading-relaxed">
          <h3 className="text-white font-bold italic">Usage Agreement</h3>
          <p>By using Pixie Market, you agree to follow our code of conduct. No unauthorized distribution of premium assets.</p>
          <p>All digital products are non-refundable once the download link is generated for your account.</p>
        </div>
      </LegalModal>

      <LegalModal
        isOpen={legalModal === "privacy"}
        onClose={() => setLegalModal(null)}
        type="privacy"
        title="Privacy Policy"
      >
        <div className="space-y-4 text-white/70 text-sm leading-relaxed">
          <h3 className="text-white font-bold italic">Data Collection</h3>
          <p>We only store your email and transaction history to ensure secure delivery of your warriors&apos; assets.</p>
          <p>We do not sell your personal information to 3rd party corporations or data brokers.</p>
        </div>
      </LegalModal>
    </div>
  );
}