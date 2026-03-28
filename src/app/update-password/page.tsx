"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState({ score: 0, label: "", color: "bg-white/10" });
  
  const router = useRouter();

  // Password Strength Meter Logic
  useEffect(() => {
    const checkStrength = (pass: string) => {
      let score = 0;
      if (pass.length === 0) return { score: 0, label: "", color: "bg-white/10" };
      if (pass.length > 6) score++;
      if (pass.length > 10) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^A-Za-z0-9]/.test(pass)) score++;

      if (score <= 2) return { score: 33, label: "Weak", color: "bg-red-500" };
      if (score <= 4) return { score: 66, label: "Medium", color: "bg-yellow-500" };
      return { score: 100, label: "Strong", color: "bg-teal-400" };
    };

    setStrength(checkStrength(password));
  }, [password]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Password and Password Confirmation do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        // Detect if the new password is the same as the old one
        if (updateError.message.toLowerCase().includes("same as the old")) {
          throw new Error("New password cannot be the same as the old password.");
        }
        throw updateError;
      }

      setSuccess(true);
      // Redirect to login after 2 seconds on success
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full px-6">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Secure Update
          </h1>
          <p className="text-white/50 text-sm">
            Use a unique combination to make your account more resilient.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-md">
          {!success ? (
            <form onSubmit={handleUpdate} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-teal-400/50 transition-all text-sm text-white" 
                    placeholder="New Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Strength Meter */}
                {password.length > 0 && (
                  <div className="px-1 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-white/30">Complexity:</span>
                      <span className={strength.label === "Strong" ? "text-teal-400" : strength.label === "Medium" ? "text-yellow-500" : "text-red-500"}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ease-out ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
                <input 
                  type={showConfirmPass ? "text" : "password"} 
                  required 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-teal-400/50 transition-all text-sm text-white" 
                  placeholder="Confirm New Password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPass(!showConfirmPass)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loading || strength.score < 66} 
                className="w-full bg-white text-slate-950 hover:bg-teal-400 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl disabled:opacity-30 disabled:grayscale mt-4"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Finalize Password"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className="flex justify-center">
                <div className="bg-teal-400/10 p-5 rounded-full border border-teal-400/20 animate-bounce">
                  <ShieldCheck className="text-teal-400" size={48} />
                </div>
              </div>
              <h2 className="text-white font-black text-2xl uppercase tracking-tighter">Account Secured</h2>
              <p className="text-white/50 text-sm">Returning to login gateway...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}