"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, Scale } from "lucide-react";
import { useEffect } from "react";

// HAPUS IMPORT YANG ERROR TADI (Import ke diri sendiri tidak perlu)

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: "terms" | "privacy" | "license";
  children: React.ReactNode;
}

export default function LegalModal({ isOpen, onClose, title, type, children }: LegalModalProps) {
  // Prevent scroll saat modal buka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; }; // Cleanup
  }, [isOpen]);

  const icons = {
    terms: <Scale className="text-teal-400" size={24} />,
    privacy: <ShieldCheck className="text-orange-400" size={24} />,
    license: <FileText className="text-blue-400" size={24} />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 shadow-inner">
                  {icons[type]}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tight">
                    {title}
                  </h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Last Updated: March 2026
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-8 overflow-y-auto custom-scrollbar text-slate-400 leading-relaxed space-y-6">
              {/* Jika ada teks manual di sini yang pakai tanda kutip, pastikan pakai &quot; */}
              {children}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/5 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white text-slate-950 font-black uppercase italic rounded-xl hover:bg-teal-400 transition-all active:scale-95"
              >
                Got It, Thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}