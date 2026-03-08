import Image from "next/image";
import { Image as ImageIcon, Loader2 } from "lucide-react";

interface ImagePreviewProps {
  image: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Sesuaikan nama props dengan pemanggil (page.tsx)
  flags: { is_featured: boolean; is_new_arrival: boolean; is_trending: boolean };
  onToggleFlag: (key: string) => void;
}

export const ImagePreview = ({ 
  image, 
  uploading, 
  onUpload, 
  flags, 
  onToggleFlag 
}: ImagePreviewProps) => (
  <div className="bg-[#0f172a]/50 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-2xl backdrop-blur-md">
    <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-2">Main Preview</label>
    <div className="aspect-square bg-black/40 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group">
      {image ? (
        <Image src={image} alt="preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
      ) : (
        <ImageIcon className="opacity-10 text-white" size={48} />
      )}
      <input type="file" accept="image/*" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      {uploading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20 gap-2">
          <Loader2 className="animate-spin text-teal-400" />
          <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">Uploading...</span>
        </div>
      )}
    </div>
    
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(flags).map(([key, value]) => (
        <button 
          key={key} 
          type="button" // Biasakan pakai type="button" agar tidak trigger form submit
          onClick={() => onToggleFlag(key)}
          className={`py-3 rounded-xl text-[8px] font-black uppercase border transition-all ${
            value ? "bg-teal-400 border-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.4)]" : "bg-white/5 border-white/5 text-white/30"
          }`}
        >
          {key.replace('is_', '').replace(/_/g, ' ')}
        </button>
      ))}
    </div>
  </div>
);