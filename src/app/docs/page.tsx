"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, Globe, ChevronRight, 
  Book, Shield, Zap, Terminal, Check, Copy,
  Menu, X, ArrowRight, Layout
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

// --- Interfaces ---
interface Article {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  updated_at: string;
}

interface Category {
  id: string;
  title: string;
  icon_name: string;
  doc_articles: Article[];
}

export default function DocsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeDoc, setActiveDoc] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchDocsData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('doc_categories')
        .select(`id, title, icon_name, doc_articles (*)`)
        .order('sort_order', { ascending: true });

      if (data) {
        setCategories(data as Category[]);
        const firstCat = data.find(c => c.doc_articles && c.doc_articles.length > 0);
        if (firstCat) setActiveDoc(firstCat.doc_articles[0]);
      }
      setLoading(false);
    };
    fetchDocsData();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'book': return <Book size={14} />;
      case 'zap': return <Zap size={14} />;
      case 'shield': return <Shield size={14} />;
      default: return <Terminal size={14} />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Protocol copied!");
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-pink-500 font-black italic animate-pulse tracking-[0.4em]">INITIATING_CORE_DOCS...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen text-slate-300 selection:bg-pink-500/30">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-black/40 backdrop-blur-xl border-r border-white/5 
        transform transition-transform duration-300 lg:translate-x-0 lg:static
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Layout size={18} className="text-white" />
            </div>
            <span className="text-white font-black italic tracking-tighter text-xl">PIXIE_DOCS</span>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input 
              type="text"
              placeholder="Search protocol..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[11px] outline-none focus:border-pink-500/50 transition-all font-bold"
            />
          </div>

          <nav className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2 px-3">
                  {getCategoryIcon(cat.icon_name)} {cat.title}
                </h4>
                <ul className="space-y-1">
                  {cat.doc_articles
                    ?.filter(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveDoc(item);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full text-left py-2 px-4 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between ${
                          activeDoc?.id === item.id 
                          ? "bg-pink-500/10 text-pink-400" 
                          : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        {item.title}
                        {activeDoc?.id === item.id && <div className="w-1 h-1 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA (Lebih Luas) */}
      <main className="flex-1 relative">
        
        {/* Mobile Header Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-[60] p-4 bg-pink-600 text-white rounded-full shadow-2xl shadow-pink-600/40"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="max-w-5xl mx-auto px-6 lg:px-20 py-12 lg:py-24">
          {activeDoc ? (
            <div key={activeDoc.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-10">
                <Globe size={12} /> PROTOCOL <ChevronRight size={10} /> 
                <span className="text-pink-500">{activeDoc.title}</span>
              </nav>

              <h1 className="text-4xl lg:text-7xl font-black text-white mb-6 tracking-tighter italic uppercase leading-tight">
                {activeDoc.title}
              </h1>
              
              <p className="text-slate-500 mb-16 font-bold text-lg border-l-4 border-pink-500/30 pl-6 italic max-w-3xl">
                {activeDoc.description}
              </p>

              <div className="prose prose-invert prose-pink max-w-none 
                prose-headings:text-white prose-headings:font-black prose-headings:italic 
                prose-p:text-slate-400 prose-p:leading-relaxed prose-p:text-lg
                prose-strong:text-pink-400
                prose-code:text-pink-400 prose-code:bg-pink-500/5 prose-code:px-2 prose-code:rounded
                prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-3xl prose-pre:p-0">
                <ReactMarkdown
                  components={{
                    pre: ({ children }) => (
                      <div className="relative group/code overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                            <div className="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40" />
                          </div>
                          <button 
                            onClick={() => copyToClipboard(String(children))}
                            className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-slate-500 hover:text-pink-500"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        <pre className="p-6 m-0 overflow-x-auto text-sm">{children}</pre>
                      </div>
                    ),
                    li: ({children}) => (
                      <li className="flex gap-3 items-start mb-2">
                        <ArrowRight size={14} className="mt-1.5 text-pink-500 flex-shrink-0" /> 
                        <div>{children}</div>
                      </li>
                    )
                  }}
                >
                  {activeDoc.content}
                </ReactMarkdown>
              </div>

              {/* Meta Footer */}
              <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <span>LAST_SYNC: {new Date(activeDoc.updated_at).toLocaleDateString()}</span>
                <button className="flex items-center gap-2 hover:text-pink-500 transition-colors group">
                  <Check size={14} className="group-hover:scale-125 transition-transform" /> REPORT_INTELLIGENCE_ANOMALY
                </button>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center opacity-20">
              <div className="text-slate-500 font-black italic uppercase tracking-[1em]">SELECT_PROTOCOL</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}