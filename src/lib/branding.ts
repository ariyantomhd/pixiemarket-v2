export const pixieBranding = {
  img: (path: string | undefined): string => {
    if (!path) return "/api/image/placeholder"; // Akan memicu placeholder di proxy
    
    // Pastikan path di-encode agar karakter seperti ':' dan '/' tidak merusak routing Next.js
    const encodedPath = encodeURIComponent(path);
    return `/api/image/${encodedPath}`;
  },
  
  zip: (id: string) => `/api/zip/${id}`,
};