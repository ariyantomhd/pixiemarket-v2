"use client";

import React, { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import Context
import { setAuthSession } from "@/app/actions/auth"; // Import Server Action
import { 
  User, Mail, Lock, Eye, EyeOff, 
  Loader2, CheckCircle2, ShieldCheck, AlertCircle 
} from "lucide-react";
import Link from "next/link";

// Tambahkan Interface untuk props agar bisa menerima fungsi buka modal
interface SignUpFormProps {
  onOpenModal?: (type: "terms" | "privacy") => void;
}

export default function SignUpForm({ onOpenModal }: SignUpFormProps) {
  const router = useRouter();
  const { login } = useAuth(); // Ambil fungsi login dari context
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "", 
    acceptTerms: false
  });

  const strength = useMemo(() => {
    const p = formData.password || "";
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s += 25;
    if (/[A-Z]/.test(p)) s += 25;
    if (/[0-9]/.test(p)) s += 25;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    return s;
  }, [formData.password]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.acceptTerms) {
      setError("Ceklis dulu dong syarat & ketentuannya, Bang!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password-nya nggak sinkron, Bang!");
      return;
    }

    if (strength < 50) {
      setError("Password-nya kurang kuat, Bang. Tambahin angka atau simbol dikit lagi.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username.toLowerCase(),
            name: formData.username,
            role: "user",
          }
        }
      });

      if (authError) throw authError;

      // JIKA AUTO-LOGIN AKTIF (Supabase default-nya langsung kasih session)
      if (data?.session && data.user) {
        const role = "user";
        
        // 1. Tulis Cookie via Server Action
        await setAuthSession(data.session.access_token, role, data.session.expires_in);

        // 2. Update Context UI
        login({
          id: data.user.id,
          username: data.user.user_metadata.username,
          name: data.user.user_metadata.name,
          email: data.user.email!,
          avatar_url: "",
          role: role
        });

        router.refresh();
        router.push("/dashboard");
      } else {
        // JIKA BUTUH VERIFIKASI EMAIL
        alert("Pendaftaran Berhasil! Silakan cek email kamu untuk aktivasi akun.");
        router.push("/login");
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal daftar, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4 w-full">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs animate-pulse">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Input Username */}
      <div className="relative group">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pc-purple-accent transition-colors" size={18} />
        <input 
          type="text" 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pc-purple-accent/50 transition-all text-sm text-white" 
          placeholder="Username" 
          value={formData.username} 
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
        />
      </div>

      {/* Input Email */}
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pc-purple-accent transition-colors" size={18} />
        <input 
          type="email" 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-pc-purple-accent/50 transition-all text-sm text-white" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
      </div>

      {/* Input Password */}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pc-purple-accent transition-colors" size={18} />
        <input 
          type={showPass ? "text" : "password"} 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-pc-purple-accent/50 transition-all text-sm text-white" 
          placeholder="Password" 
          value={formData.password} 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Strength Bar */}
      {formData.password && (
        <div className="space-y-1 px-1">
          <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><ShieldCheck size={12}/> Strength</span>
            <span>{strength}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${strength <= 50 ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${strength}%` }} 
            />
          </div>
        </div>
      )}

      {/* Confirm Password */}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pc-purple-accent transition-colors" size={18} />
        <input 
          type={showConfirmPass ? "text" : "password"} 
          required 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-pc-purple-accent/50 transition-all text-sm text-white" 
          placeholder="Confirm Password" 
          value={formData.confirmPassword} 
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
        />
        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
          {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Terms Checkbox - SEKARANG TRIGGER MODAL */}
      <div className="flex items-center gap-3 px-2 py-2 group">
        <label className="relative flex items-center h-5 cursor-pointer">
          <input 
            type="checkbox" 
            className="peer hidden" 
            checked={formData.acceptTerms}
            onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})} 
          />
          <div className={`w-5 h-5 border-2 rounded-lg transition-all flex items-center justify-center text-white ${
            formData.acceptTerms ? 'bg-pc-purple-accent border-pc-purple-accent shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'border-white/10 bg-white/5'
          }`}>
            {formData.acceptTerms && <CheckCircle2 size={14} />}
          </div>
        </label>
        
        <span className="text-[10px] text-white/40 uppercase tracking-wider select-none">
          Agree to {" "}
          <button 
            type="button"
            onClick={() => onOpenModal?.("terms")}
            className="text-pc-purple-accent font-black hover:text-white transition-colors underline decoration-purple-500/30"
          >
            Terms
          </button> 
          {" "}&{" "} 
          <button 
            type="button"
            onClick={() => onOpenModal?.("privacy")}
            className="text-pc-purple-accent font-black hover:text-white transition-colors underline decoration-purple-500/30"
          >
            Privacy
          </button>
        </span>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={loading || !formData.acceptTerms} 
        className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all ${
          formData.acceptTerms 
          ? 'bg-orange-500 text-black hover:bg-pc-purple-accent hover:text-white shadow-xl shadow-pc-purple-accent/10' 
          : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Magic Account"}
      </button>

      <div className="text-center mt-4">
        <p className="text-xs text-white/40 italic">
          Already a member? <Link href="/login" className="text-pc-purple-accent font-bold ml-1 hover:underline not-italic">Sign In here</Link>
        </p>
      </div>
    </form>
  );
}