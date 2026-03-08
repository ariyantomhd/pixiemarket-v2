"use client";

import Link from "next/link";
import { LucideIcon, ExternalLink } from "lucide-react";

interface MenuLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export default function MenuLink({ href, icon: Icon, label, active = false }: MenuLinkProps) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
        active 
        ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" 
        : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`${active ? "text-white" : "group-hover:text-purple-400"}`}>
        <Icon size={18} />
      </span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {active && <ExternalLink size={14} className="ml-auto opacity-50" />}
    </Link>
  );
}