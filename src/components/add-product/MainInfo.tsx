import { Tag, LayoutGrid } from "lucide-react";
import { Product } from "@/types/product";

interface MainInfoProps {
  formData: Partial<Product>;
  // Menggunakan tipe State Dispatcher yang spesifik untuk Partial<Product>
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  tagInput: string;
  setTagInput: (v: string) => void;
  techInput: string;
  setTechInput: (v: string) => void;
}

export const MainInfo = ({ 
  formData, 
  setFormData, 
  tagInput, 
  setTagInput, 
  techInput, 
  setTechInput 
}: MainInfoProps) => {

  // Helper untuk update field agar kode di JSX lebih bersih
  const handleChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
      {/* Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Gear Name</label>
          <input 
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-teal-400/50 font-bold italic text-white"
            placeholder="The Cyber Deck..."
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Category</label>
          <select 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-teal-400/50 appearance-none font-bold italic text-white"
            value={formData.category || ""}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="Source Code" className="bg-slate-900 text-white">Source Code</option>
            <option value="UI Kit" className="bg-slate-900 text-white">UI Kit</option>
            <option value="3D Asset" className="bg-slate-900 text-white">3D Asset</option>
          </select>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-2">Sale Price ($)</label>
          <input 
            required 
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-teal-400/50 font-black text-white"
            value={formData.price || ""}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Normal Price ($)</label>
          <input 
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-white/20 text-white"
            value={formData.original_price || ""}
            onChange={(e) => handleChange("original_price", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Stock</label>
          <input 
            type="number"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm outline-none focus:border-white/20 text-white"
            value={formData.stock || ""}
            onChange={(e) => handleChange("stock", Number(e.target.value))}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Description</label>
        <textarea 
          rows={5} 
          required
          className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-sm outline-none focus:border-teal-400/50 resize-none font-medium text-slate-300 leading-relaxed"
          placeholder="Write the lore..."
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* Tags & Tech */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2">
            <Tag size={12}/> Tags
          </label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs outline-none focus:border-teal-400/50 text-white"
            placeholder="PHP, NextJS..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2">
            <LayoutGrid size={12}/> Tech Stack
          </label>
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-xs outline-none focus:border-teal-400/50 text-white"
            placeholder="React, Tailwind..."
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};