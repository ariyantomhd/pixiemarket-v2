import Link from "next/link";
import { ArrowLeft, Rocket, Loader2 } from "lucide-react";

interface HeaderProps {
  onDeploy: (e: React.FormEvent) => void;
  loading: boolean;
  uploading: boolean;
}

export const Header = ({ onDeploy, loading, uploading }: HeaderProps) => (
  <div className="flex items-center justify-between border-b border-white/5 pb-8">
    <div className="flex items-center gap-4">
      <Link href="/admin/products" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5">
        <ArrowLeft size={20} />
      </Link>
      <div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Deploy New <span className="text-teal-400">War Gear</span></h1>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Digital Asset Deployment Interface</p>
      </div>
    </div>
    <button 
      onClick={onDeploy} disabled={loading || uploading}
      className="flex items-center gap-3 px-8 py-4 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="animate-spin" /> : <><Rocket size={18}/> Deploy Asset</>}
    </button>
  </div>
);