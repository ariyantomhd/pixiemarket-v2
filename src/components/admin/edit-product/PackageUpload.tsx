import { FileCode, FileArchive, Loader2 } from "lucide-react";

interface PackageUploadProps {
  fileSize?: string;
  version?: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Kita satukan fungsinya di sini
  onChange: (field: string, val: string) => void; 
}

export const PackageUpload = ({ 
  fileSize, 
  version, 
  uploading, 
  onUpload, 
  onChange 
}: PackageUploadProps) => (
  <div className="bg-[#0f172a]/50 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-2xl backdrop-blur-md">
    <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2 ml-2">
      <FileCode size={14}/> Asset Specs & Package
    </label>
    
    <div className="relative group overflow-hidden rounded-2xl border border-white/10">
      <div className="w-full bg-black/40 py-4 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${uploading ? 'bg-teal-400/10' : 'bg-white/5'}`}>
            {uploading ? <Loader2 className="animate-spin text-teal-400" size={16} /> : <FileArchive className="text-teal-400" size={16} />}
          </div>
          <span className="text-[9px] font-bold text-white/60 uppercase tracking-tight truncate max-w-[120px]">
            {fileSize || "Upload ZIP"}
          </span>
        </div>
        <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded text-white/40 group-hover:text-teal-400">SELECT</div>
      </div>
      <input type="file" accept=".zip,.rar" onChange={onUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
    </div>

    <div className="grid grid-cols-2 gap-3">
        {/* Update field 'version' */}
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs outline-none focus:border-teal-400/50 text-white font-bold"
          placeholder="Version" 
          value={version || ""} 
          onChange={(e) => onChange('version', e.target.value)} 
        />
        {/* Update field 'file_size' */}
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-xs outline-none focus:border-teal-400/50 text-white font-bold"
          placeholder="Manual Size" 
          value={fileSize || ""} 
          onChange={(e) => onChange('file_size', e.target.value)} 
        />
    </div>
  </div>
);