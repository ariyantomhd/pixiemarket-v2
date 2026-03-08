"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Book, Edit3, Trash2, Save, 
  Loader2, Layout, Link as LinkIcon, 
  Type, AlignLeft, Eye, Plus, Sparkles 
} from "lucide-react";

// --- 1. Interfaces ---
interface Category {
  id: string;
  title: string;
  icon_name: string;
  sort_order: number;
  doc_articles?: Article[];
}

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

export default function DocsManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form States
  const [articleForm, setArticleForm] = useState({
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

  // --- 2. Data Fetching ---
  const fetchAllData = useCallback(async () => {
    // Kita set loading hanya di fetch awal atau refresh total
    const { data, error } = await supabase
      .from('doc_categories')
      .select('*, doc_articles(*)')
      .order('sort_order', { ascending: true });
    
    if (!error && data) {
      setCategories(data as Category[]);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      await fetchAllData();
      if (isMounted) setLoading(false);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [fetchAllData]);

  // --- 3. Handlers ---
  const handleTitleChange = (val: string) => {
    // Auto-generate slug: Lowercase, replace space with dash, remove special chars
    const generatedSlug = val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
    
    setArticleForm({ ...articleForm, title: val, slug: generatedSlug });
  };

  const handleSaveArticle = async () => {
    const { id, ...payload } = articleForm;
    
    if (!payload.category_id || !payload.title) {
      return alert("Pilih kategori dan isi judul dulu, Bang!");
    }

    const { error } = id 
      ? await supabase.from('doc_articles').update(payload).eq('id', id)
      : await supabase.from('doc_articles').insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      setArticleForm({ id: "", category_id: "", title: "", slug: "", content: "", description: "", is_published: true });
      fetchAllData();
    }
  };

  const handleSaveCategory = async () => {
    if (!catForm.title) return alert("Isi judul kategori dulu!");

    const { id, ...payload } = catForm;
    const { error } = id 
      ? await supabase.from('doc_categories').update(payload).eq('id', id)
      : await supabase.from('doc_categories').insert([payload]);

    if (error) {
      alert(error.message);
    } else {
      setCatForm({ id: "", title: "", icon_name: "Zap" });
      fetchAllData();
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("Hapus artikel ini dari database?")) return;
    const { error } = await supabase.from('doc_articles').delete().eq('id', id);
    if (!error) fetchAllData();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Hapus kategori ini? Semua artikel di dalamnya juga akan terhapus!")) return;
    const { error } = await supabase.from('doc_categories').delete().eq('id', id);
    if (!error) fetchAllData();
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-2">
      
      {/* COLUMN 1: EDITORS */}
      <div className="xl:col-span-1 space-y-6">
        
        {/* Category Editor */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layout className="text-teal-400" size={18} />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-white">Category Node</h2>
            </div>
            {catForm.id && (
              <button 
                onClick={() => setCatForm({ id: "", title: "", icon_name: "Zap" })}
                className="text-[8px] font-black text-red-400 uppercase hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          
          <div className="relative">
            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
            <input 
              placeholder="Category Name..."
              value={catForm.title}
              onChange={(e) => setCatForm({...catForm, title: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-teal-400 transition-all font-bold"
            />
          </div>
          
          <button 
            onClick={handleSaveCategory}
            className="w-full bg-white/10 hover:bg-teal-400 hover:text-slate-950 text-white font-black uppercase py-3 rounded-xl text-[10px] transition-all flex items-center justify-center gap-2 group"
          >
            <Sparkles size={12} className="group-hover:animate-pulse" />
            {catForm.id ? "Update Category" : "Build Category"}
          </button>
        </div>

        {/* Article Editor */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2 text-white">
            <Book className="text-teal-400" size={18} />
            <h2 className="text-[10px] font-black uppercase tracking-widest">Article Protocol</h2>
          </div>
          
          <div className="space-y-3">
            {/* Category Select */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-1">
              <Layout size={14} className="text-white/20" />
              <select 
                value={articleForm.category_id}
                onChange={(e) => setArticleForm({...articleForm, category_id: e.target.value})}
                className="w-full bg-transparent py-3 text-xs text-white outline-none font-bold"
              >
                <option value="" className="bg-slate-900">Select Parent Category</option>
                {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.title}</option>)}
              </select>
            </div>

            {/* Title Input */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4">
               <Type size={14} className="text-white/20" />
               <input 
                 placeholder="Knowledge Title"
                 value={articleForm.title}
                 onChange={(e) => handleTitleChange(e.target.value)}
                 className="w-full bg-transparent py-3 text-xs text-white outline-none font-bold"
               />
            </div>

            {/* Slug Display */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 opacity-60">
               <LinkIcon size={14} className="text-white/20" />
               <input 
                 placeholder="auto-generated-slug"
                 value={articleForm.slug}
                 readOnly
                 className="w-full bg-transparent py-3 text-[10px] font-mono text-teal-400 outline-none"
               />
            </div>

            {/* Description */}
            <div className="flex gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
               <AlignLeft size={14} className="text-white/20 mt-1" />
               <textarea 
                 placeholder="Brief summary / SEO Description..."
                 rows={2}
                 value={articleForm.description}
                 onChange={(e) => setArticleForm({...articleForm, description: e.target.value})}
                 className="w-full bg-transparent text-xs text-white outline-none resize-none font-medium leading-relaxed"
               />
            </div>

            {/* Content Markdown */}
            <textarea 
              placeholder="# Markdown Content..."
              rows={10}
              value={articleForm.content}
              onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs text-white outline-none font-mono focus:border-teal-400 transition-all leading-relaxed"
            />
          </div>

          <button 
            onClick={handleSaveArticle}
            className="w-full bg-teal-400 text-slate-950 font-black uppercase py-4 rounded-2xl text-[10px] tracking-widest hover:bg-teal-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-400/20"
          >
            <Save size={16} /> 
            {articleForm.id ? "Update Intelligence" : "Deploy Article"}
          </button>
        </div>
      </div>

      {/* COLUMN 2 & 3: KNOWLEDGE EXPLORER */}
      <div className="xl:col-span-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-teal-400" size={32} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Synchronizing...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 h-fit hover:border-teal-400/20 transition-all group/card shadow-inner">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-400/10 rounded-lg">
                      <Eye size={14} className="text-teal-400" />
                    </div>
                    <h3 className="text-xs font-black uppercase text-white tracking-widest">{cat.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCatForm({ id: cat.id, title: cat.title, icon_name: cat.icon_name })} 
                      className="p-2 text-white/20 hover:text-teal-400 hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Edit3 size={14}/>
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="p-2 text-white/10 hover:text-red-400 hover:bg-red-400/5 rounded-lg transition-all"
                    >
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {cat.doc_articles?.map((art) => (
                    <div key={art.id} className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-teal-400/30 transition-all">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white/80 group-hover:text-teal-400 transition-colors truncate">{art.title}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                           <LinkIcon size={10} className="text-white/10" />
                           <span className="text-[9px] text-white/20 font-mono italic truncate">{art.slug}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setArticleForm(art)} 
                          className="p-2 text-teal-400 hover:bg-teal-400/10 rounded-xl"
                        >
                          <Edit3 size={14}/>
                        </button>
                        <button 
                          onClick={() => deleteArticle(art.id)} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {(!cat.doc_articles || cat.doc_articles.length === 0) && (
                    <div className="text-center py-10 opacity-20 border-2 border-dashed border-white/5 rounded-2xl">
                      <Book size={24} className="mx-auto mb-2" />
                      <p className="text-[9px] uppercase font-black tracking-tighter">Database Empty</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <Layout size={40} className="mx-auto mb-4 text-white/10" />
                <p className="text-xs font-black text-white/20 uppercase tracking-widest">No Categories Initialized</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}