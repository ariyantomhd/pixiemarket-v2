"use client";

import FaqManager from "@/components/admin/FaqManager";
import { HelpCircle } from "lucide-react";

export default function FaqAdminPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <HelpCircle className="text-teal-400" size={32} /> FAQ_MANAGER
        </h1>
        <p className="text-slate-500 font-bold text-[10px] mt-2 tracking-[0.4em] uppercase">
          Knowledge_Base_Control_Protocol_v1.0
        </p>
      </div>

      {/* The Imported Component */}
      <FaqManager />
    </div>
  );
}