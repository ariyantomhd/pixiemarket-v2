import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* reactCompiler tetap true jika Abang pakai Next.js 15+ */
  reactCompiler: true, 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rdbchqljdjpamuonflqb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // WAJIB ADA karena di Dashboard tadi pakai link Unsplash
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Tambahkan pathname wildcard agar tidak error
      },
    ],
  },
};

export default nextConfig;