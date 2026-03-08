import React from "react";
// Ganti FolderZip menjadi FileArchive atau FolderArchive
import { FileArchive, Loader2, FileCode } from "lucide-react";

interface AssetSpecsProps {
  version: string;
  size: string;
  uploadingFile?: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (key: string, value: string) => void;
}

export const AssetSpecs = ({ 
  version, 
  size, 
  uploadingFile, 
  onFileChange, 
  onChange 
}: AssetSpecsProps) => (
  <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-xl">
    {/* Header Label */}
    <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2 ml-2">
      <FileCode size={14}/> Asset Specs & Package
    </label>
    
    {/* ZIP Upload Area */}
    <div className="space-y-2">
      <p className="text-[8px] font-black uppercase text-white/30 ml-2 italic">Source File (.zip, .rar)</p>
      <div className="relative group overflow-hidden rounded-2xl border border-white/10 transition-all hover:border-teal-400/30">
        <div className="w-full bg-black/40 py-4 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-lg ${uploadingFile ? 'bg-teal-400/10' : 'bg-white/5'}`}>
              {uploadingFile ? (
                <Loader2 className="animate-spin text-teal-400" size={16} />
              ) : (
                <FileArchive className="text-teal-400" size={16} />
              )}
            </div>
            <span className="text-[10px] font-bold text-white/60 truncate uppercase tracking-tight">
              {size ? `Package: ${size}` : "Upload Gear Package"}
            </span>
          </div>
          
          {!uploadingFile && (
            <div className="text-[8px] font-black bg-white/5 px-2 py-1 rounded text-white/40 group-hover:text-teal-400 transition-colors">
              SELECT FILE
            </div>
          )}
        </div>
        
        <input 
          type="file" 
          accept=".zip,.rar,.7z"
          onChange={onFileChange}
          disabled={uploadingFile}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
        />
      </div>
    </div>

    {/* Metadata Inputs */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase text-white/20 ml-2">Version</label>
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-teal-400/50 text-white placeholder:text-white/10 font-medium"
          placeholder="v1.0.0"
          value={version}
          onChange={(e) => onChange("version", e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase text-white/20 ml-2">Display Size</label>
        <input 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-xs outline-none focus:border-teal-400/50 text-white placeholder:text-white/10 font-medium"
          placeholder="MB / GB"
          value={size}
          onChange={(e) => onChange("file_size", e.target.value)}
        />
      </div>
    </div>
  </div>
);