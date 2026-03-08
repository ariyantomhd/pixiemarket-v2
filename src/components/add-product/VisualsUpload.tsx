import Image from "next/image";
import { ImageIcon, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { Product } from "@/types/product";

interface VisualsProps {
  formData: Partial<Product>;
  // Menggunakan tipe React Dispatch agar sesuai dengan useState di parent
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const VisualsUpload = ({ formData, setFormData, handleImageUpload, uploading }: VisualsProps) => {
  
  const images = formData.images || [];

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const setAsThumbnail = (index: number) => {
    const newImages = [...images];
    const selectedImage = newImages.splice(index, 1)[0];
    newImages.unshift(selectedImage);
    
    setFormData((prev) => ({ 
      ...prev, 
      images: newImages 
    }));
  };

  return (
    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400">War Gear Visuals</label>
        <span className="text-[8px] font-bold text-white/20 uppercase">{images.length} Images</span>
      </div>

      {/* Main Preview */}
      <div className="space-y-2">
        <p className="text-[8px] font-black uppercase text-white/40 ml-2 italic">Active Thumbnail</p>
        <div className="aspect-video bg-black/40 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group shadow-inner">
          {images.length > 0 ? (
            <Image src={images[0]} alt="thumbnail" fill className="object-cover" />
          ) : (
            <div className="text-center space-y-2 opacity-20">
              <ImageIcon className="mx-auto" size={40} />
              <p className="text-[8px] font-black uppercase">No Media Deployed</p>
            </div>
          )}
          
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
            <Plus className="text-teal-400" size={32} />
            <input type="file" onChange={handleImageUpload} className="hidden" multiple />
          </label>

          {uploading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
              <Loader2 className="animate-spin text-teal-400" size={32} />
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
              <Image src={img} alt={`gallery-${index}`} fill className="object-cover" />
              
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-1.5">
                {index !== 0 && (
                  <button 
                    type="button"
                    onClick={() => setAsThumbnail(index)}
                    className="p-1.5 bg-teal-500 text-slate-950 rounded-lg hover:scale-110 active:scale-95 transition-all"
                  >
                    <Star size={12} fill="currentColor" />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {index === 0 && (
                <div className="absolute top-1 left-1 bg-teal-400 text-slate-950 text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase shadow-lg">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Badges */}
      <div className="pt-4 border-t border-white/5">
        <div className="grid grid-cols-3 gap-2">
          {(['Featured', 'New Arrival', 'Trending'] as const).map((label) => {
            const key = `is_${label.toLowerCase().replace(' ', '_')}` as keyof Product;
            const isActive = formData[key];
            
            return (
              <button key={label} type="button"
                onClick={() => setFormData((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`py-3 rounded-xl text-[8px] font-black uppercase border transition-all ${
                  isActive 
                    ? "bg-teal-400 border-teal-400 text-slate-950 shadow-[0_0_15px_rgba(45,212,191,0.3)]" 
                    : "bg-white/5 border-white/5 text-white/30 hover:border-white/10"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};