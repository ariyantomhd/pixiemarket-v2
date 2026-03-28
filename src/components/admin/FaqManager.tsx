"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Save, Loader2, HelpCircle, Edit3, Sparkles } from "lucide-react";
import { toast } from "sonner";

// Definisi Interface untuk menghindari 'any'
interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at?: string;
}

export default function FaqManager() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [form, setForm] = useState({ id: "", question: "", answer: "", sort_order: 0 });

  // Gunakan useCallback untuk menghindari cascading renders & ESLint error
  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      if (data) setFaqs(data as Faq[]);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      toast.error("Failed to fetch data stream");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleSave = async () => {
    if (!form.question || !form.answer) return toast.error("Isi semua field!");
    setBtnLoading(true);
    
    const { id, ...payload } = form;
    const { error } = id 
      ? await supabase.from('faqs').update(payload).eq('id', id)
      : await supabase.from('faqs').insert([payload]);

    if (!error) {
      toast.success("Protocol Synced!");
      setForm({ id: "", question: "", answer: "", sort_order: 0 });
      fetchFaqs();
    } else {
      toast.error("Upload failed");
    }
    setBtnLoading(false);
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Hapus FAQ?")) return;
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (!error) {
      toast.success("Node Purged");
      fetchFaqs();
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-6 animate-in fade-in duration-700">
      
      {/* 1. EDITOR FORM SECTION */}
      <div className="xl:col-span-5 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/20 to-violet-500/20 rounded-[2.6rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
        
        <div className="relative bg-[#0a0b10] p-8 rounded-[2.5rem] border border-white/5 space-y-5 h-fit shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-white font-black italic uppercase tracking-tighter flex items-center gap-2 text-xl">
              <Sparkles className="text-teal-400" size={20} /> FAQ_EDITOR
            </h2>
            {form.id && (
              <button 
                onClick={() => setForm({ id: "", question: "", answer: "", sort_order: 0 })}
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                [ Cancel_Edit ]
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Question_Node</label>
              <input 
                placeholder="Ex: How to connect wallet?" 
                value={form.question}
                onChange={e => setForm({...form, question: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-teal-400/50 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-2">Intelligence_Answer</label>
              <textarea 
                placeholder="Provide detailed instructions..." 
                rows={5}
                value={form.answer}
                onChange={e => setForm({...form, answer: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-teal-400/50 transition-all font-medium leading-relaxed"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={btnLoading}
            className="w-full relative overflow-hidden group/btn bg-teal-400 text-slate-950 font-black py-4 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-teal-300 transition-all flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(45,212,191,0.2)]"
          >
            {btnLoading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            {form.id ? "Update_Protocol" : "Publish_to_Mainnet"}
          </button>
        </div>
      </div>

      {/* 2. LIST SECTION */}
      <div className="xl:col-span-7 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-2 px-2">
           Live_Data_Stream <div className="w-1 h-1 bg-teal-500 rounded-full animate-pulse" />
        </h4>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <Loader2 className="animate-spin text-teal-400 mb-4" size={32} />
            <span className="text-[10px] font-black tracking-widest uppercase text-white">Fetching_Vault...</span>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {faqs.map(f => (
              <div 
                key={f.id} 
                className="group relative bg-black/20 border border-white/5 p-6 rounded-[2rem] flex justify-between items-start transition-all duration-500 hover:bg-white/[0.03] hover:border-teal-500/30 hover:translate-x-1"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-0 bg-teal-500 group-hover:h-1/2 transition-all duration-500 rounded-full" />
                <div className="pr-8">
                  <p className="text-white font-black text-sm mb-2 italic tracking-tight group-hover:text-teal-400 transition-colors uppercase">{f.question}</p>
                  <p className="text-slate-500 text-xs line-clamp-2 italic font-medium leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setForm(f)} className="p-2.5 text-slate-600 hover:text-teal-400 transition-all"><Edit3 size={16}/></button>
                  <button onClick={() => deleteFaq(f.id)} className="p-2.5 text-slate-600 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
            
            {faqs.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                <HelpCircle className="mx-auto text-slate-800 mb-4" size={40} />
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">No_Faqs_Detected</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}