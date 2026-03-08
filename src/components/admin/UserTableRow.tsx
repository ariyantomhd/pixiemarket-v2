"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Calendar, ShieldCheck, UserCheck, ShieldAlert, UserPlus, MoreHorizontal, DownloadCloud } from "lucide-react";
import { User } from "@/types/user";

interface Props {
  // Pakai array biasa agar tidak bentrok dengan hasil query Supabase
  user: User & { download_logs?: { count: number }[] }; 
  onToggleAdmin: (id: string | number, role: string) => void;
}

export const UserTableRow = ({ user, onToggleAdmin }: Props) => {
  // Ambil angka dari array download_logs indeks ke-0 (hasil count)
  const downloadCount = user.download_logs?.[0]?.count || 0;

  return (
    <motion.tr 
      layout 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="group hover:bg-white/[0.02] transition-colors"
    >
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center font-black text-xs text-teal-400 overflow-hidden relative">
            {user.avatar_url ? (
              <Image src={user.avatar_url} alt={user.name || "Avatar"} fill className="object-cover" sizes="40px" />
            ) : ( 
              user.name?.charAt(0) || user.username?.charAt(0) || "W" 
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase italic text-white">{user.name}</p>
            <div className="flex flex-col gap-0.5 mt-0.5">
              <p className="text-[9px] text-teal-400/60 font-bold italic lowercase">@{user.username}</p>
              <p className="text-[9px] text-white/30 font-bold flex items-center gap-1 italic">
                <Mail size={10} /> {user.email}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <div className="flex flex-col gap-2">
          <div className={`inline-flex items-center self-start gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
            user.role === 'admin' 
            ? "bg-teal-400/10 border-teal-400/20 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.1)]" 
            : "bg-white/5 border-white/10 text-white/40"
          }`}>
            {user.role === 'admin' ? <ShieldCheck size={12} /> : <UserCheck size={12} />}
            {user.role}
          </div>
          {/* Stats Download */}
          <div className="flex items-center gap-1.5 text-[8px] font-black text-white/20 uppercase tracking-tighter">
            <DownloadCloud size={10} className={downloadCount > 0 ? "text-teal-400/50" : ""} /> 
            {downloadCount} Assets Secured
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-[10px] font-bold text-white/40 flex items-center gap-2 tracking-tighter">
          <Calendar size={12} /> 
          {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
        </p>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onToggleAdmin(user.id, user.role)}
            className={`p-2.5 rounded-xl transition-all border ${
              user.role === 'admin'
              ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
              : "bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-slate-950"
            }`}
          >
            {user.role === 'admin' ? <ShieldAlert size={16} /> : <UserPlus size={16} />}
          </button>
          <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-white/20 hover:text-white">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};