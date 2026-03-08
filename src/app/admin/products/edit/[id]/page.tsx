"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";

// Import Komponen
import { Header } from "@/components/admin/edit-product/Header";
import { ImagePreview } from "@/components/admin/edit-product/ImagePreview";
import { PackageUpload } from "@/components/admin/edit-product/PackageUpload";
import { ReviewInjector } from "@/components/admin/edit-product/ReviewInjector"; 
import ProductForm from "@/components/admin/edit-product/ProductForm";

interface PostgrestError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

const pixieBranding = {
  img: (path: string | undefined): string => {
    if (!path) return "";
    return path.startsWith('http') ? `/api/image/${encodeURIComponent(path)}` : path;
  },
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    sold_count: 0 // Default value
  });
  const [tagInput, setTagInput] = useState<string>("");
  const [techInput, setTechInput] = useState<string>("");

  const fetchProductData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData(data as Product);
        setTagInput(data.tags?.join(", ") || "");
        setTechInput(data.tech_stack?.join(", ") || "");
      }
    } catch (err) {
      const error = err as PostgrestError;
      console.error("Fetch Error:", error.message);
      alert("Asset Core Not Found!");
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  }, [productId, router]);

  useEffect(() => {
    if (productId) fetchProductData();
  }, [fetchProductData, productId]);

  const createSlug = (text: string): string => {
    return text.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (saving || uploading || uploadingFile) return;
    setSaving(true);

    let discount: number | null = null;
    const currentPrice = formData.price || 0;
    const originalPrice = formData.original_price || 0;
    if (originalPrice > currentPrice) {
      discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    try {
      const updatePayload: Partial<Product> = { ...formData };
      delete updatePayload.id;
      delete updatePayload.created_at;

      updatePayload.slug = createSlug(formData.name || "");
      updatePayload.discount_percentage = discount;
      updatePayload.tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      updatePayload.tech_stack = techInput.split(',').map(t => t.trim()).filter(Boolean);
      
      // Pastikan sold_count terkirim sebagai number
      updatePayload.sold_count = Number(formData.sold_count) || 0;

      const { error } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', productId);

      if (error) throw error;

      alert("Gear Calibrated & Sold Count Updated!");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const error = err as PostgrestError;
      alert(`Calibration Failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'zip') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploading(true);
    else setUploadingFile(true);

    try {
      const bucket = 'pixie-assets';
      const folder = type === 'image' ? 'products' : 'packages';
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      
      if (type === 'image') {
        setFormData(prev => ({ ...prev, images: [data.publicUrl] }));
      } else {
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
        setFormData(prev => ({ ...prev, file_url: data.publicUrl, file_size: sizeInMB }));
      }
    } catch (err) {
      alert(`Upload failed: ${(err as Error).message}`);
    } finally {
      if (type === 'image') setUploading(false);
      else setUploadingFile(false);
    }
  };

  const updateField = <K extends keyof Product>(field: K, value: Product[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-teal-400" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Scanning Data Core...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <Header 
        productId={productId} 
        saving={saving} 
        onSave={handleUpdate} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <ImagePreview 
            image={pixieBranding.img(formData.images?.[0])}
            uploading={uploading}
            onUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'image')}
            flags={{
              is_featured: !!formData.is_featured,
              is_new_arrival: !!formData.is_new_arrival,
              is_trending: !!formData.is_trending
            }}
            onToggleFlag={(key: string) => updateField(key as keyof Product, !formData[key as keyof Product])}
          />

          <PackageUpload 
            fileSize={formData.file_size || ""}
            version={formData.version || ""}
            uploading={uploadingFile}
            onUpload={(e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e, 'zip')}
            onChange={(field: string, val: string) => updateField(field as keyof Product, val)}
          />

          <ReviewInjector productId={productId} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProductForm 
            formData={formData}
            setFormData={setFormData}
            tagInput={tagInput}
            setTagInput={setTagInput}
            techInput={techInput}
            setTechInput={setTechInput}
          />
        </div>
      </div>
    </div>
  );
}