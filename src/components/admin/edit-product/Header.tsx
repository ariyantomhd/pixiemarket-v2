import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  productId: string;
  saving: boolean;
  onSave: (e: React.FormEvent) => Promise<void>;
}

export const Header = ({ productId, saving, onSave }: HeaderProps) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-8">
    <div className="flex items-center gap-4">
      <Link href="/admin/products" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 text-white/60">
        <ArrowLeft size={20} />
      </Link>
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">
          Edit <span className="text-teal-400">War Gear</span>
        </h1>
        <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] italic">System ID: {productId}</p>
      </div>
    </div>
    <button 
      onClick={onSave}
      disabled={saving}
      className="group flex items-center gap-3 px-10 py-4 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
    >
      {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
      Deploy Changes
    </button>
  </div>
);