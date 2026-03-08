"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Optimized for latest framer
import { supabase } from "@/lib/supabase";
import { 
  Plus, Minus, HelpCircle, MessageSquare, 
  Mail, LifeBuoy, ArrowRight, Loader2 
} from "lucide-react";

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

function FaqItem({ question, answer, isOpen, onClick }: FaqItemProps) {
  return (
    <div className={`border-b border-white/5 last:border-0 transition-all ${isOpen ? 'bg-white/[0.02]' : ''}`}>
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 px-4 md:px-8 text-left group"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-teal-400' : 'text-slate-300 group-hover:text-white'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 ml-4 p-1 rounded-full transition-transform duration-300 ${isOpen ? 'rotate-180 bg-teal-500/20 text-teal-400' : 'text-slate-500'}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-8 px-4 md:px-8 text-slate-400 text-sm leading-relaxed whitespace-pre-line">
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
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden bg-slate-950">
      {/* Glow Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-black tracking-widest uppercase">
            <LifeBuoy size={14} /> Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter">
            How can we help you<span className="text-teal-500">?</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Find rapid solutions in our intelligence base or reach out to our technical team for specialized assistance.
          </p>
        </div>

        {/* FAQ Section */}
        <section className="bg-slate-900/40 backdrop-blur-xl border border-white/5 overflow-hidden mb-12 shadow-2xl rounded-[2.5rem]">
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center gap-3">
            <HelpCircle className="text-teal-400" size={24} />
            <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Frequently Asked Questions</h2>
          </div>
          
          <div className="flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-teal-400 gap-4">
                <Loader2 className="animate-spin" size={32} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
                  Synchronizing Knowledge Base
                </span>
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
              <div className="py-24 text-center">
                <p className="text-slate-500 italic text-sm font-medium">No FAQ records found in the database.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Chat Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 border border-white/5 rounded-[2.5rem] group hover:border-teal-500/30 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-white font-black text-xl mb-2 italic uppercase tracking-tighter">Live Support</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">Connect with our developers in real-time for immediate technical resolution.</p>
            <div className="flex items-center gap-2 text-teal-400 text-[10px] font-black group-hover:gap-4 transition-all uppercase tracking-[0.2em]">
              Start Inquiry <ArrowRight size={14} />
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 border border-white/5 rounded-[2.5rem] group hover:border-orange-500/30 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Mail size={24} />
            </div>
            <h3 className="text-white font-black text-xl mb-2 italic uppercase tracking-tighter">Email Ticket</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium leading-relaxed">Submit a detailed inquiry and our team will respond within a 24-hour window.</p>
            <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black group-hover:gap-4 transition-all uppercase tracking-[0.2em]">
              Send Ticket <ArrowRight size={14} />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}