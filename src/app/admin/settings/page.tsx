"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Book, Edit3, Trash2, Save, 
  Loader2, Layout, Link as LinkIcon, 
  Type, Eye, Plus, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

// --- Interfaces ---
interface Article {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  is_published: boolean;
  sort_order: number;
}

interface Category {
  id: string;
  title: string;
  icon_name: string;
  sort_order: number;
  doc_articles?: Article[];
}

// Interface untuk Form State agar tidak 'implicit any'
interface ArticleFormState {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  is_published: boolean;
}

export default function DocsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  
  const [articleForm, setArticleForm] = useState<ArticleFormState>({
    id: "",
    category_id: "",
    title: "",
    slug: "",
    content: "",
    description: "",
    is_published: true
  });

  const [catForm, setCatForm] = useState({
    id: "",
    title: "",
    icon_name: "Zap"
  });

  // --- Fetch Data ---
  const fetchAllData = useCallback(async () => {
    try {
      const { data, error }: { data: Category[] | null; error: PostgrestError | null } = await supabase
        .from('doc_categories')
        .select('*, doc_articles(*)')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      if (data) setCategories(data);
    } catch (err) {
      // Casting error ke Error object alih-alih any
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Handlers ---
  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    setArticleForm(prev => ({ ...prev, title: val, slug: generatedSlug }));
  };

  const handleSaveArticle = async () => {
    if (!articleForm.category_id || !articleForm.title || !articleForm.content) {
      return toast.error("Semua field wajib diisi, Bang!");
    }

    setBtnLoading(true);
    const { id, ...payload } = articleForm;
    
    const { error } = id 
      ? await supabase.from('doc_articles').update(payload).eq('id', id)
      : await supabase.from('doc_articles').insert([payload]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(id ? "Node Updated!" : "Node Deployed!");
      setArticleForm({ 
        id: "", 
        category_id: "", 
        title: "", 
        slug: "", 
        content: "", 
        description: "", 
        is_published: true 
      });
      fetchAllData();
    }
    setBtnLoading(false);
  };

  const handleSaveCategory = async () => {
    if (!catForm.title) return toast.error("Isi judul kategori dulu!");

    setBtnLoading(true);
    const { id, ...payload } = catForm;
    const { error } = id 
      ? await supabase.from('doc_categories').update(payload).eq('id', id)
      : await supabase.from('doc_categories').insert([payload]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Category Synced!");
      setCatForm({ id: "", title: "", icon_name: "Zap" });
      fetchAllData();
    }
    setBtnLoading(false);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    const { error } = await supabase.from('doc_articles').delete().eq('id', id);
    if (!error) {
      toast.success("Article Purged!");
      fetchAllData();
    } else {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-12 text-slate-300">
      {/* HEADER */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Sparkles className="text-teal-400" size={36} /> Protocol Manager
          </h1>
          <p className="text-slate-500 font-bold text-xs mt-1 tracking-[0.3em]">PIXIESWAP_DOCUMENTATION_CORE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* COLUMN 1: EDITORS (Form) */}
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-slate-900 border-2 border-white/5 rounded-[2.5rem] p-8 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2">
              <Layout className="text-teal-400" size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Category_Node</h2>
            </div>
            <input 
              placeholder="E.g. GETTING STARTED"
              value={catForm.title}
              onChange={(e) => setCatForm({...catForm, title: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-teal-400/50 transition-all font-bold italic"
            />
            <button 
              onClick={handleSaveCategory}
              disabled={btnLoading}
              className="w-full bg-white/5 hover:bg-teal-400 hover:text-slate-950 text-white font-black uppercase py-4 rounded-2xl text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
            >
              {btnLoading ? <Loader2 className="animate-spin" size={14}/> : <Plus size={14} />}
              {catForm.id ? "Update Category" : "Build Category"}
            </button>
          </div>

          <div className="bg-slate-900 border-2 border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center gap-2 text-white">
              <Book className="text-teal-400" size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Article_Protocol</h2>
            </div>
            <div className="space-y-4">
              <select 
                value={articleForm.category_id}
                onChange={(e) => setArticleForm({...articleForm, category_id: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 text-xs text-white outline-none font-bold"
              >
                <option value="">Select Parent Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>

              <div className="relative">
                <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input 
                  placeholder="Article Title..."
                  value={articleForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white outline-none focus:border-teal-400/50 transition-all font-bold"
                />
              </div>

              <div className="relative opacity-50 font-mono">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                <input 
                  value={articleForm.slug}
                  readOnly
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] text-teal-400 outline-none"
                />
              </div>

              <textarea 
                placeholder="# Markdown Content Here..."
                rows={12}
                value={articleForm.content}
                onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-6 px-6 text-xs text-white outline-none font-mono focus:border-teal-400/50 transition-all leading-relaxed"
              />
            </div>

            <button 
              onClick={handleSaveArticle}
              disabled={btnLoading}
              className="w-full bg-teal-400 text-slate-950 font-black uppercase py-5 rounded-[2rem] text-[11px] tracking-[0.2em] hover:bg-teal-300 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
            >
              {btnLoading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />} 
              {articleForm.id ? "Update Intelligence" : "Deploy Protocol"}
            </button>
          </div>
        </div>

        {/* COLUMN 2: LIST */}
        <div className="xl:col-span-7">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-20">
              <Loader2 className="animate-spin text-teal-400" size={40} />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Syncing_Database...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-1 gap-6">
              {categories.map(cat => (
                <div key={cat.id} className="bg-slate-900 border border-white/5 rounded-[3rem] p-8 relative overflow-hidden group/card shadow-2xl">
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-teal-400/10 rounded-2xl flex items-center justify-center text-teal-400">
                        <Eye size={18} />
                      </div>
                      <h3 className="text-lg font-black italic uppercase text-white tracking-tighter">{cat.title}</h3>
                    </div>
                    <div className="flex gap-2 opacity-50 group-hover/card:opacity-100 transition-opacity">
                      <button onClick={() => setCatForm({ id: cat.id, title: cat.title, icon_name: cat.icon_name })} className="p-3 text-slate-500 hover:text-teal-400 transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => deleteArticle(cat.id)} className="p-3 text-slate-700 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {cat.doc_articles?.map((art) => (
                      <div key={art.id} className="flex justify-between items-center p-5 bg-black/40 rounded-3xl border border-white/5 group hover:border-teal-400/20 transition-all">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">{art.title}</span>
                          <span className="text-[10px] text-slate-600 font-mono mt-1">/{art.slug}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setArticleForm({...art})} className="p-2 text-slate-500 hover:text-teal-400"><Edit3 size={14}/></button>
                          <button onClick={() => deleteArticle(art.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}