"use client";

import React, { useEffect } from "react"; // Tambah useEffect di sini
import { useRouter, usePathname } from "next/navigation"; // Tambah useRouter & usePathname
import { Loader2 } from "lucide-react"; // Tambah Loader2
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Jika loading selesai dan user ternyata kosong, tendang ke login
    if (!isLoading && !user) {
      router.push(`/login?callback=${pathname}`);
    }
  }, [user, isLoading, pathname, router]);

  // Tampilkan loading screen selama pengecekan identity
  if (isLoading || !user) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-teal-400" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
          Scanning Warrior Identity...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}