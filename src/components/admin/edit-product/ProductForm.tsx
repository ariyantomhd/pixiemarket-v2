import { Tag, LayoutGrid } from "lucide-react";
import { Product } from "@/types/product";

interface ProductFormProps {
  formData: Partial<Product>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  tagInput: string;
  setTagInput: (val: string) => void;
  techInput: string;
  setTechInput: (val: string) => void;
}

export default function ProductForm({ 
  formData, 
  setFormData, 
  tagInput, 
  setTagInput, 
  techInput, 
  setTechInput 
}: ProductFormProps) {
  const inputStyles = "w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-teal-400/50 text-white font-bold transition-all";

  /**
   * Menggunakan Generic <K extends keyof Product>
   * Ini memastikan 'value' harus sesuai dengan tipe data field yang dipilih di Product.
   */
  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[#0f172a]/50 p-8 rounded-[3rem] border border-white/10 space-y-8 shadow-2xl backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gear Designation */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Gear Designation</label>
          <input 
            required 
            className={`${inputStyles} text-base italic font-black`}
            value={formData.name || ""} 
            onChange={(e) => updateField('name', e.target.value)} 
          />
        </div>

        {/* Class Category */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Class Category</label>
          <select 
            className={`${inputStyles} bg-slate-900 appearance-none italic text-sm`}
            value={formData.category || ""} 
            onChange={(e) => updateField('category', e.target.value)} 
          >
            <option value="Source Code">Source Code</option>
            <option value="UI Kit">UI Kit</option>
            <option value="3D Model">3D Model</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Active Price */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-2 italic">Active Price ($)</label>
          <input 
            required 
            type="number" 
            className={`${inputStyles} bg-teal-400/5 border-teal-400/20 text-sm focus:border-teal-400`}
            value={formData.price || 0} 
            onChange={(e) => updateField('price', Number(e.target.value))} 
          />
        </div>

        {/* Base Price */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Base Price ($)</label>
          <input 
            type="number" 
            className={`${inputStyles} text-sm`}
            value={formData.original_price || 0} 
            onChange={(e) => updateField('original_price', Number(e.target.value))} 
          />
        </div>

        {/* Stock */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Stock Qty</label>
          <input 
            type="number" 
            className={`${inputStyles} text-sm`}
            value={formData.stock || 0} 
            onChange={(e) => updateField('stock', Number(e.target.value))} 
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-2 italic">Gear Lore & Description</label>
        <textarea 
          rows={6} 
          className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 px-7 text-sm outline-none focus:border-teal-400/50 resize-none font-medium leading-relaxed text-white/80"
          value={formData.description || ""} 
          onChange={(e) => updateField('description', e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {/* Tags */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2 ml-2 italic"><Tag size={12}/> Taxonomy Tags</label>
          <input 
            className={`${inputStyles} text-xs`} 
            placeholder="React, Tailwind, SaaS" 
            value={tagInput} 
            onChange={(e) => setTagInput(e.target.value)} 
          />
        </div>

        {/* Tech Stack */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 flex items-center gap-2 ml-2 italic"><LayoutGrid size={12}/> Tech Components</label>
          <input 
            className={`${inputStyles} text-xs`} 
            placeholder="Supabase, Next.js, Framer" 
            value={techInput} 
            onChange={(e) => setTechInput(e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
}