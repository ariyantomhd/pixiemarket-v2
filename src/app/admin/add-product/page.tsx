"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { Header } from "@/components/add-product/Header";
import { VisualsUpload } from "@/components/add-product/VisualsUpload";
import { AssetSpecs } from "@/components/add-product/AssetSpecs";
import { MainInfo } from "@/components/add-product/MainInfo";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false); 
  
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    original_price: 0,
    category: "Source Code",
    stock: 999,
    sold_count: 0, // Inisialisasi awal untuk marketing
    version: "v1.0.0",
    file_size: "",
    file_url: "",
    is_featured: false,
    is_new_arrival: true,
    is_trending: false,
    images: [],
    tags: [],
    tech_stack: [],
  });

  const handleUpdate = (key: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const createSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  // Handler Upload ZIP / Package
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingFile(true);

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pixie-assets')
        .upload(`packages/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('pixie-assets').getPublicUrl(`packages/${fileName}`);

      setFormData(prev => ({ 
        ...prev, 
        file_url: data.publicUrl,
        file_size: sizeInMB 
      }));
      
      alert("Package Deployed Successfully!");
    } catch (error) {
      console.error(error);
      alert("Gagal upload package!");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        
        const { error: uploadError } = await supabase.storage
          .from('pixie-assets')
          .upload(`products/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('pixie-assets').getPublicUrl(`products/${fileName}`);
        newUrls.push(data.publicUrl);
      }

      setFormData(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), ...newUrls] 
      }));
      
    } catch (error) {
      console.error(error);
      alert("Gagal upload gambar!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || uploading || uploadingFile) return;
    setLoading(true);

    let discount = null;
    const price = Number(formData.price) || 0;
    const originalPrice = Number(formData.original_price) || 0;

    if (originalPrice > price) {
      discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    try {
      const payload = {
        ...formData,
        slug: createSlug(formData.name || ""),
        discount_percentage: discount,
        tags: tagInput.split(',').map(t => t.trim()).filter(Boolean),
        tech_stack: techInput.split(',').map(t => t.trim()).filter(Boolean),
        release_date: new Date().toISOString(),
        sold_count: Number(formData.sold_count) || 0, // Pastikan jadi number
        price: price,
        original_price: originalPrice,
        stock: Number(formData.stock) || 0
      };

      const { error } = await supabase
        .from('products')
        .insert([payload]);

      if (error) throw error;

      alert("War Gear Deployed Successfully!");
      router.push("/admin/products");
      router.refresh();
      
    } catch (error) {
      console.error(error);
      alert("Error saving product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <Header 
        onDeploy={handleSubmit} 
        loading={loading} 
        uploading={uploading || uploadingFile} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Media & Specs */}
        <div className="space-y-6">
          <VisualsUpload 
            formData={formData} 
            setFormData={setFormData} 
            handleImageUpload={handleImageUpload} 
            uploading={uploading} 
          />
          <AssetSpecs 
            version={formData.version || ""} 
            size={formData.file_size || ""} 
            uploadingFile={uploadingFile}
            onFileChange={handleZipUpload}
            onChange={handleUpdate} 
          />
        </div>

        {/* Kolom Kanan: Main Form Info */}
        <div className="lg:col-span-2 space-y-6">
          <MainInfo 
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