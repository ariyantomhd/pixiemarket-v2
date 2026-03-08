"use client";
import { Library, History, Settings, ExternalLink, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"; // Import ini untuk usir ESLint error
import { User } from "@/types/user";

export default function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 flex flex-col gap-6">
      <div className="pixie-glass p-8 rounded-[2rem] flex flex-col items-center text-center border border-white/5 shadow-2xl">
        <div className="relative w-24 h-24 mb-4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-3xl font-black text-white shadow-2xl overflow-hidden relative">
            {user?.avatar_url ? (
              <Image 
                src={user.avatar_url} 
                alt={user.username} 
                fill 
                className="object-cover"
                sizes="96px"
              />
            ) : (
              user?.username?.charAt(0).toUpperCase() || "D"
            )}
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-[#121214] rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">{user?.username || "Demo User"}</h2>
        <p className="text-xs text-white/40 font-medium truncate w-full">{user?.email || "user@example.com"}</p>
      </div>

      <nav className="pixie-glass p-4 rounded-[2rem] border border-white/5 flex flex-col gap-2">
        <MenuLink href="/dashboard" icon={Library} label="My Library" active={pathname === "/dashboard"} />
        <MenuLink href="/dashboard/transactions" icon={History} label="Transactions" active={pathname === "/dashboard/transactions"} />
        <MenuLink href="/dashboard/settings" icon={Settings} label="Profile Settings" active={pathname === "/dashboard/settings"} />
      </nav>
    </aside>
  );
}

// MenuLink helper
function MenuLink({ href, icon: Icon, label, active }: { href: string, icon: LucideIcon, label: string, active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${active ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}>
      <Icon size={18} className={active ? "text-white" : "group-hover:text-purple-400"} />
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {active && <ExternalLink size={14} className="ml-auto opacity-50" />}
    </Link>
  );
}