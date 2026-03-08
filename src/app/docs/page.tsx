"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Book, 
  Search,
  Loader2, 
  ChevronRight,
  Layout
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// --- Interfaces ---
interface Category {
  id: string;
  title: string;
  doc_articles?: Article[];
}

interface Article {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
}

export default function DocsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocs = useCallback(async () => {
    const { data, error } = await supabase
      .from('doc_categories')
      .select('*, doc_articles(*)')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setCategories(data);
      // Auto-select artikel pertama jika belum ada yang dipilih
      if (data[0]?.doc_articles?.[0]) {
        setSelectedArticle(data[0].doc_articles[0]);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initDocs = async () => {
      setLoading(true);
      await fetchDocs();
      if (isMounted) setLoading(false);
    };

    initDocs();

    return () => {
      isMounted = false;
    };
  }, [fetchDocs]);

  // Filter pencarian
  const filteredCategories = categories.map(cat => ({
    ...cat,
    doc_articles: cat.doc_articles?.filter(art => 
      art.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.doc_articles && cat.doc_articles.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-teal-400 mb-4" size={40} />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Initialising Protocol...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6 relative bg-slate-950">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* --- SIDEBAR --- */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-28 space-y-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/30 transition-all font-medium"
              />
            </div>

            <nav className="space-y-8">
              {filteredCategories.map((cat) => (
                <div key={cat.id} className="space-y-3">
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
                    <Layout size={14} className="text-teal-500/50" />
                    {cat.title}
                  </h4>
                  <ul className="space-y-1 border-l border-white/5 ml-2">
                    {cat.doc_articles?.map((art) => (
                      <li key={art.id}>
                        <button 
                          onClick={() => setSelectedArticle(art)}
                          className={`w-full text-left py-2 pl-4 text-sm transition-all relative ${
                            selectedArticle?.id === art.id 
                            ? "text-teal-400 font-bold border-l border-teal-400 -ml-px bg-teal-400/5" 
                            : "text-slate-400 hover:text-white hover:border-l hover:border-white/20 -ml-px"
                          }`}
                        >
                          {art.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- CONTENT --- */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {selectedArticle ? (
              <motion.div 
                key={selectedArticle.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/[0.02] p-8 md:p-12 border border-white/5 rounded-[3rem]"
              >
                <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-8 font-black uppercase tracking-widest">
                  <Book size={12} />
                  <span>Docs</span>
                  <ChevronRight size={10} />
                  <span className="text-teal-400">{selectedArticle.title}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 italic tracking-tighter">
                  {selectedArticle.title}<span className="text-teal-500">.</span>
                </h1>

                <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium border-l-2 border-teal-500/20 pl-6 italic">
                  {selectedArticle.description}
                </p>

                <article className="prose prose-invert prose-teal max-w-none 
                  prose-headings:italic prose-headings:tracking-tighter prose-headings:font-black
                  prose-p:text-slate-400 prose-p:leading-relaxed
                  prose-code:text-teal-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:rounded
                  prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-[2rem]">
                  <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                </article>
              </motion.div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-600 italic">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No documentation found matching your query.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}