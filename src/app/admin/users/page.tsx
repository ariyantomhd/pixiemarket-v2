"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Users, Search, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { User } from "@/types/user";
import { UserTableRow } from "@/components/admin/UserTableRow";

// Interface yang sinkron dengan UserTableRow
interface UserWithLogs extends User {
  download_logs: { count: number }[];
}

// Interface untuk menangkap error dari Supabase tanpa 'any'
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserWithLogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // AMBIL DATA USER + COUNT LOG DOWNLOAD
      const { data, error } = await supabase
        .from('users')
        .select('*, download_logs(count)') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion ke UserWithLogs[]
      setUsers((data as unknown as UserWithLogs[]) || []);
    } catch (err) {
      // Penanganan error tanpa 'any'
      const error = err as SupabaseError;
      console.error("WARRIOR DATABASE ERROR:", {
        msg: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // Tampilkan pesan error yang manusiawi
      alert(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchUsers(); 
  }, [fetchUsers]);

  const toggleAdmin = async (id: string | number, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (confirm(`Ubah akses user ini menjadi ${newRole.toUpperCase()}, Bang?`)) {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id);
        
      if (error) {
        alert(`Gagal update role: ${error.message}`);
      } else {
        fetchUsers();
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Warrior <span className="text-teal-400">Database</span>
          </h1>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em] mt-1">
            Authorized personnel only. Managing active user base.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl">
          <div className="text-right">
            <p className="text-[8px] font-black uppercase text-white/20">Total Population</p>
            <p className="text-xl font-black italic text-teal-400">{users.length}</p>
          </div>
          <Users className="text-teal-400" size={24} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-teal-400 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Find warrior by name, username or email..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs outline-none focus:border-teal-400/50 transition-all font-bold uppercase tracking-wider text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                <th className="px-8 py-6">Warrior Profile</th>
                <th className="px-6 py-6">Role / Logs</th>
                <th className="px-6 py-6">Joined Date</th>
                <th className="px-8 py-6 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="wait">
                {loading ? (
                  <tr key="loading">
                    <td colSpan={4} className="py-20 text-center">
                      <Loader2 className="animate-spin mx-auto mb-2 text-teal-400" size={32} />
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Scanning Network...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr key="empty">
                    <td colSpan={4} className="py-20 text-center">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest italic">No Warrior Detected in Sector</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <UserTableRow key={user.id} user={user} onToggleAdmin={toggleAdmin} />
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}