import { NextResponse } from 'next/server';

/**
 * PIXIE IMAGE PROXY ENGINE (Next.js 15)
 * Mendukung URL eksternal (Unsplash/Supabase), Auto-prefix Bucket, dan Caching Agresif.
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const { search } = new URL(request.url);

  try {
    const rawPath = path.join('/');
    // Menggunakan const untuk memperbaiki ESLint 'prefer-const'
    const fullPath = decodeURIComponent(rawPath);

    let targetUrl = "";

    if (fullPath.startsWith('http')) {
      targetUrl = fullPath.replace(/^(https?):\/+/, '$1://') + search;
    } else if (fullPath.includes('supabase.co')) {
      targetUrl = `https://${fullPath}${search}`;
    } else {
      const bucketUrl = "https://rdbchqljdjpamuonflqb.supabase.co/storage/v1/object/public/pixie-assets/products/";
      const cleanPath = fullPath.startsWith('/') ? fullPath.substring(1) : fullPath;
      targetUrl = `${bucketUrl}${cleanPath}${search}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      next: { revalidate: 31536000 },
      headers: {
        'User-Agent': 'PixieBot/1.0 (Marketplace Image Proxy)',
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Target responded with ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const imageStream = response.body;

    return new NextResponse(imageStream, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Access-Control-Allow-Origin': '*',
        'Server': 'Pixie-Image-Engine-v1'
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Proxy Error:", errorMessage);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: "Request Timeout" }, { status: 504 });
    }

    return NextResponse.json(
      { error: "Image fetch failed", details: errorMessage },
      { status: 500 }
    );
  }
}