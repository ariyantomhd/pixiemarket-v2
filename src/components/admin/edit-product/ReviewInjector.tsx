"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Send, Trash2, Loader2, UserPlus } from "lucide-react";

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function ReviewInjector({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [fetching, setFetching] = useState(true);

  // Ambil data review yang sudah di-inject
  const fetchReviews = useCallback(async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', parseInt(productId))
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setFetching(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleInject = async () => {
    if (!name || !comment) return alert("Ghost identity incomplete!");
    setLoading(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: parseInt(productId), // Konversi bigint
        user_name: name,
        rating: rating,
        comment: comment,
        is_verified: true
      });

      if (error) throw error;

      alert("Social Proof Injected!");
      setName("");
      setComment("");
      setRating(5);
      fetchReviews(); // Refresh list
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Remove this testimonial?")) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) fetchReviews();
  };

  return (
    <div className="space-y-4">
      {/* FORM SECTION */}
      <div className="bg-[#0f172a]/50 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-2xl backdrop-blur-md">
        <label className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-2 ml-2">
          <UserPlus size={14}/> Marketing Injector
        </label>
        
        <div className="space-y-3">
          <input 
            placeholder="Ghost User Name" 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs text-white font-bold outline-none focus:border-pink-400/50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <div className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/10">
            <span className="text-[9px] font-black text-white/40 uppercase">Rating Score</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  size={16} 
                  className={`cursor-pointer transition-all ${s <= rating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-white/10"}`} 
                  onClick={() => setRating(s)}
                />
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Write convincing testimonial..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs text-white font-medium h-28 outline-none focus:border-pink-400/50 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            onClick={handleInject}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            Deploy Social Proof
          </button>
        </div>
      </div>

      {/* LIST SECTION (HISTORY) */}
      <div className="bg-black/20 rounded-[2rem] border border-white/5 p-4 space-y-3">
        <h4 className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-2">Active Injections</h4>
        
        {fetching ? (
          <div className="py-4 flex justify-center"><Loader2 className="animate-spin text-white/10" size={16}/></div>
        ) : reviews.length === 0 ? (
          <p className="text-[9px] text-white/10 italic text-center py-4">No ghost reviews found.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-start group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white">{rev.user_name}</span>
                    <div className="flex text-yellow-400">
                      {Array.from({length: rev.rating}).map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-[9px] text-white/50 leading-relaxed line-clamp-2">{rev.comment}</p>
                </div>
                <button 
                  onClick={() => deleteReview(rev.id)}
                  className="p-2 text-white/10 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}