"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Plus, Minus, HelpCircle, MessageSquare, 
  LifeBuoy, ArrowRight, Loader2, Sparkles,
  Zap, ShieldCheck
} from "lucide-react";
import { PostgrestError } from "@supabase/supabase-js";

// --- Interfaces ---
interface FaqData {
  id: string;
  question: string;
  answer: string;
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

// --- Sub-Component: FaqItem ---
function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className={`border-b border-white/5 last:border-0 transition-all duration-500 ${isOpen ? 'bg-teal-400/[0.03]' : 'hover:bg-white/[0.01]'}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-7 px-6 md:px-10 text-left group"
      >
        <span className={`text-base font-bold tracking-tight transition-colors duration-300 uppercase italic ${isOpen ? 'text-teal-400' : 'text-slate-300 group-hover:text-white'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 ml-4 p-1.5 rounded-xl transition-all duration-500 ${isOpen ? 'rotate-180 bg-teal-500/20 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)]' : 'text-slate-600 bg-white/5'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-10 px-6 md:px-10 text-slate-400 text-sm leading-relaxed whitespace-pre-line font-medium border-l-2 border-teal-500/30 ml-6 md:ml-10">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error }: { data: FaqData[] | null; error: PostgrestError | null } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (err) {
      console.error("Knowledge Base Sync Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 relative overflow-hidden bg-slate-950">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-500/10 blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <LifeBuoy className="text-teal-400" size={14} />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400">Help Center</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
            ANY <span className="text-teal-500">ISSUES?</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Find answers in the intelligence base below or jump straight to our neural link for direct assistance.
          </p>
        </motion.div>

        {/* --- FAQ Section --- */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 overflow-hidden mb-12 shadow-2xl rounded-[3rem]"
        >
          <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-400/10 rounded-2xl">
                <Zap className="text-teal-400" size={24} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Intelligence Base</h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-teal-400/40 uppercase tracking-widest">
              <ShieldCheck size={14} /> Encrypted Data
            </div>
          </div>
          
          <div className="flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-teal-400 gap-6">
                <Loader2 className="animate-spin" size={40} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronizing Nodes...</span>
              </div>
            ) : faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <FaqItem
                  key={faq.id}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))
            ) : (
              <div className="py-32 text-center opacity-30">
                <p className="text-white font-black uppercase italic tracking-widest text-xs">No Data Stream Detected</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* --- Telegram Link Card --- */}
        <motion.a 
          href="https://t.me/your_telegram_username" // <--- Ganti Username Abang di sini
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="block group"
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 border-2 border-teal-500/20 rounded-[3rem] transition-all duration-500 group-hover:border-teal-400 group-hover:shadow-[0_0_60px_rgba(45,212,191,0.15)] relative overflow-hidden">
            
            {/* Background Icon Decor */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
              <MessageSquare size={300} />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="w-24 h-24 bg-teal-400 rounded-[2.5rem] flex items-center justify-center text-slate-950 shadow-[0_0_40px_rgba(45,212,191,0.4)] group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                <MessageSquare size={44} fill="currentColor" />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h3 className="text-white font-black text-4xl mb-3 italic uppercase tracking-tighter">Direct Neural Link</h3>
                <p className="text-slate-500 font-bold leading-relaxed max-w-md text-sm md:text-base">
                  Skip the protocol queue. Connect directly to our core unit via Telegram for real-time technical resolution.
                </p>
              </div>

              <div className="bg-white/5 px-10 py-5 rounded-2xl border border-white/10 text-teal-400 font-black text-xs tracking-[0.3em] uppercase flex items-center gap-4 group-hover:bg-teal-400 group-hover:text-slate-950 transition-all duration-300">
                Establish Link <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </motion.a>

      </div>
    </main>
  );
}