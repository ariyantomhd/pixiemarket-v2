"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { setAuthSession } from "@/app/actions/auth";

export default function SignInForm() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callback");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (data.session && data.user) {
        const expires = data.session.expires_in;

        /**
         * PERBAIKAN ROLE:
         * Kita cek 'app_metadata' dulu (Role dari SQL UPDATE tadi masuk ke sini).
         * Jika kosong, baru cek 'user_metadata' atau default ke 'user'.
         */
        const role = data.user.app_metadata?.role || data.user.user_metadata?.role || 'user';
        
        console.log("Detected Role on Login:", role);

        // 1. SINKRONISASI COOKIE (Untuk Middleware)
        await setAuthSession(data.session.access_token, role, expires);

        // 2. UPDATE STATE GLOBAL (AuthContext)
        login({
          id: data.user.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0],
          name: data.user.user_metadata?.full_name || "Pixie User",
          email: data.user.email!,
          avatar_url: data.user.user_metadata?.avatar_url || "",
          role: role // Pastikan role admin masuk ke sini
        });

        // 3. REFRESH & REDIRECT
        // Kita refresh agar Server Components mendapatkan cookie terbaru
        router.refresh(); 

        // Tentukan target redirect: Jika ada callback (misal dari link produk) ke sana, 
        // jika tidak, cek apakah dia admin atau user biasa.
        const target = callbackUrl || (role === 'admin' ? "/admin" : "/dashboard");
        
        // Gunakan window.location.href jika router.push terasa lambat 
        // untuk memastikan middleware langsung mencegat di rute yang benar
        router.push(target);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk, cek kembali email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-5 w-full">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Email Input */}
      <div className="relative group">
        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
        <input 
          type="email" 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-teal-400/50 transition-all text-sm text-white" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      {/* Password Input */}
      <div className="space-y-3">
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
          <input 
            type={showPass ? "text" : "password"} 
            required 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-teal-400/50 transition-all text-sm text-white" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-black/70 transition-colors"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="text-right">
          <Link 
            href="/forgot-password" 
            className="text-xs font-bold text-teal-400 hover:text-white transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-white text-slate-950 hover:bg-teal-400 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-white/5"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Verifying...</span>
          </>
        ) : (
          "Sign In to Pixie"
        )}
      </button>
    </form>
  );
}