"use client";

import { useState, useEffect } from "react"; // Hapus useCallback jika tidak benar-benar perlu antar komponen
import { supabase } from "@/lib/supabase";
import { 
  Trash2, Edit3, Save, HelpCircle, 
  Loader2, CheckCircle2, XCircle, 
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface FAQFormData {
  question: string;
  answer: string;
  category: string;
  is_published: boolean;
}

export default function SupportManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "General",
    is_published: true
  });

  // 1. Pindahkan fetcher ke luar useEffect tapi tetap di dalam komponen
  // Gunakan controller untuk cleanup jika perlu
  async function fetchFaqs() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      if (data) setFaqs(data as FAQ[]);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // 2. Gunakan useEffect dengan pola yang lebih bersih
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (isMounted && data) {
        setFaqs(data as FAQ[]);
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency karena kita cuma mau fetch sekali saat mount

  // 3. Logic Save & Delete tetap sama
  async function handleSave() {
    const payload = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    const { error } = editingId 
      ? await supabase.from('faqs').update(payload).eq('id', editingId)
      : await supabase.from('faqs').insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      setFormData({ question: "", answer: "", category: "General", is_published: true });
      setEditingId(null);
      fetchFaqs(); // Re-fetch setelah update
    }
  }

  // ... (Sisa fungsi delete dan render UI sama seperti sebelumnya)

  async function handleDelete(id: string) {
    if (confirm("Hapus FAQ ini?")) {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (!error) fetchFaqs();
    }
  }

  return (
    <div className="space-y-6">
      {/* UI tetap sama Bang, tidak perlu ada yang diubah di bagian return */}
      <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8 text-white">
             <div className="flex items-center gap-3">
                <HelpCircle className="text-teal-400" size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest italic">FAQ Terminal</h2>
             </div>
        </div>

        {/* Form Inputs */}
        <div className="grid gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-white/30 ml-2">Category</label>
                 <select 
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white outline-none font-bold appearance-none"
                 >
                    <option value="General" className="bg-slate-900">General</option>
                    <option value="Technical" className="bg-slate-900">Technical</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-white/30 ml-2">Status</label>
                 <button 
                   onClick={() => setFormData({...formData, is_published: !formData.is_published})}
                   className={`w-full py-4 px-6 rounded-xl border text-[10px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${formData.is_published ? 'border-teal-400/30 text-teal-400 bg-teal-400/5' : 'border-red-400/30 text-red-400 bg-red-400/5'}`}
                 >
                    {formData.is_published ? 'Published' : 'Draft'}
                    {formData.is_published ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                 </button>
              </div>
           </div>

           <input 
             placeholder="Question..."
             value={formData.question}
             onChange={(e) => setFormData({...formData, question: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white outline-none font-bold"
           />

           <textarea 
             placeholder="Answer..."
             value={formData.answer}
             onChange={(e) => setFormData({...formData, answer: e.target.value})}
             className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-xs text-white outline-none min-h-[100px]"
           />

           <button 
             onClick={handleSave}
             className="w-full bg-teal-400 text-slate-950 font-black uppercase py-4 rounded-xl text-xs hover:bg-teal-300 transition-all shadow-lg shadow-teal-400/10"
           >
             <Save size={16} className="inline mr-2" />
             {editingId ? "Update FAQ" : "Save FAQ"}
           </button>
        </div>

        {/* List Table */}
        <div className="mt-10 space-y-3">
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-400" /></div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-teal-400 text-slate-950 uppercase">{faq.category}</span>
                    {!faq.is_published && <span className="text-[8px] font-black text-red-400 uppercase tracking-tighter italic">Offline</span>}
                  </div>
                  <p className="text-xs font-bold text-white">{faq.question}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingId(faq.id); setFormData(faq); }} className="p-2 text-teal-400 hover:bg-white/5 rounded-lg"><Edit3 size={14}/></button>
                  <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-400 hover:bg-white/5 rounded-lg"><Trash2 size={14}/></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}