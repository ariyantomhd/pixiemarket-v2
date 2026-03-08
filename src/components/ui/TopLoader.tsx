"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

// 1. Kita buat dulu fungsi internalnya
function LoaderHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Selesai loading saat rute benar-benar berubah
    nProgress.done();

    return () => {
      // Mulai loading saat user mulai navigasi ke rute lain
      nProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}

// 2. Kita bungkus fungsi tadi dengan Suspense agar Next.js aman
export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <LoaderHandler />
    </Suspense>
  );
}