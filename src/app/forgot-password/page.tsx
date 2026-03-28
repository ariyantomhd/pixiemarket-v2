"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (resetError) throw resetError;
      setIsSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim email reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Wrapper tambahan untuk membuat konten ke tengah layar */
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full px-6">
      
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Reset Password
          </h1>
          <p className="text-white/50 text-sm">
            Masukkan email kamu untuk menerima link reset password.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
          {!isSent ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <div className="relative group">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" 
                  size={18} 
                />
                <input 
                  type="email" 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-teal-400/50 transition-all text-sm text-white" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-white text-slate-950 hover:bg-teal-400 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="bg-teal-400/20 p-4 rounded-full">
                  <CheckCircle2 className="text-teal-400" size={40} />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-white font-bold text-lg">Cek Email Kamu!</h2>
                <p className="text-white/50 text-sm leading-relaxed">
                  Instruksi reset password telah dikirim ke <br/>
                  <span className="text-white font-medium">{email}</span>.
                </p>
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-teal-400 text-xs font-bold hover:text-white transition-colors"
              >
                Gak dapet email? Kirim ulang.
              </button>
            </div>
          )}
        </div>

        {/* Back to Login */}
        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordContent;