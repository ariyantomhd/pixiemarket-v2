// src/app/dashboard/settings/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface UserMetadata {
  full_name?: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Pakai unknown as object untuk menghindari error property 'user_metadata'
  const metadata = (user as unknown as { user_metadata?: UserMetadata })?.user_metadata;
  const [fullName, setFullName] = useState(metadata?.full_name || "");

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: "Profile updated successfully!" });
      
      // Refresh page setelah delay agar user bisa melihat pesan sukses
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      // FIX: Ganti 'any' dengan pengecekan instance Error
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Sidebar user={user} />
        <main className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem]">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">Account Settings</h1>
          
          <div className="space-y-6 max-w-md">
            {/* Feedback Message */}
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                message.type === 'success' ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-400 transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <input 
                type="email" 
                disabled 
                value={user?.email || ""} 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed"
              />
            </div>

            <button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-teal-400 text-slate-950 font-bold rounded-xl hover:bg-teal-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}