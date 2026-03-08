// Taruh ini di VS Code, BUKAN di SQL Editor Supabase!
export const getProductImage = (imageArray: string[] | null) => {
  if (!imageArray || imageArray.length === 0) return "/placeholder.png";
  
  const firstImage = imageArray[0];

  // Logic untuk handle link Unsplash (seperti di baris atas tabel Abang)
  if (firstImage.startsWith("http")) return firstImage;

  // Logic untuk handle nama file (seperti "ai-img.png" di baris bawah tabel Abang)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/products/${firstImage}`;
};