"use client";

import { useState } from "react";
import { 
  Settings, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  User, 
  ChevronRight 
} from "lucide-react";
import SupportManager from "@/components/admin/SupportManager";
import DocsManager from "@/components/admin/DocsManager";

type TabID = "profile" | "support" | "docs" | "security";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabID>("support");

  const menuItems = [
    { id: "profile", label: "Admin Profile", icon: User, desc: "Manage your account" },
    { id: "support", label: "FAQ Terminal", icon: HelpCircle, desc: "Customer support center" },
    { id: "docs", label: "Knowledge Base", icon: BookOpen, desc: "Documentation editor" },
    { id: "security", label: "Security", icon: ShieldCheck, desc: "Privacy & Permissions" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-teal-400/10 rounded-2xl border border-teal-400/20">
            <Settings className="text-teal-400" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
              System <span className="text-teal-400">Settings</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Core Management Protocol v1.0
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabID)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                  isActive 
                  ? "bg-teal-400 border-teal-400 text-slate-950 shadow-lg shadow-teal-400/20" 
                  : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} className={isActive ? "text-slate-950" : "text-teal-400"} />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                      {item.label}
                    </p>
                    <p className={`text-[9px] font-medium opacity-50 ${isActive ? "text-slate-900" : "text-white/40"}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={14} className={`transition-transform ${isActive ? "rotate-90" : "group-hover:translate-x-1"}`} />
              </button>
            );
          })}
        </div>

        {/* CONTENT AREA */}
        <div className="lg:col-span-9">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "support" && (
              <div className="space-y-6">
                <div className="bg-teal-400/5 border border-teal-400/20 p-6 rounded-[2.5rem] mb-8">
                  <h3 className="text-teal-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Live FAQ Module</h3>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    Kelola pertanyaan yang sering diajukan pelanggan. Perubahan di sini akan langsung sinkron dengan Landing Page Support.
                  </p>
                </div>
                <SupportManager />
              </div>
            )}

            {activeTab === "docs" && (
              <div className="space-y-6">
                <div className="bg-blue-400/5 border border-blue-400/20 p-6 rounded-[2.5rem] mb-8">
                  <h3 className="text-blue-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Documentation Engine</h3>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    Update basis pengetahuan PixieMarket. Gunakan Markdown untuk format teks yang lebih kaya dan pastikan slug unik untuk SEO.
                  </p>
                </div>
                <DocsManager />
              </div>
            )}

            {(activeTab === "profile" || activeTab === "security") && (
              <div className="flex flex-col items-center justify-center py-32 bg-white/5 border border-dashed border-white/10 rounded-[3rem]">
                <ShieldCheck size={48} className="text-white/10 mb-4" />
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Module Under Construction</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}