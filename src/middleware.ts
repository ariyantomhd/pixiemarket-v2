import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase'; 

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value;
  const userRoleCookie = req.cookies.get('user-role')?.value;
  const { pathname } = req.nextUrl;

  // 1. BYPASS ASET & API
  if (
    pathname.match(/\.(.*)$/) || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // 2. VERIFIKASI USER & ROLE SECARA REAL-TIME
  let user = null;
  let finalRole = userRoleCookie;

  if (token) {
    // Ambil user langsung dari Supabase Auth menggunakan token
    const { data } = await supabase.auth.getUser(token);
    user = data.user;

    if (user) {
      // Ambil role dari metadata (prioritaskan app_metadata karena lebih aman)
      const roleFromMeta = user.app_metadata?.role || user.user_metadata?.role || 'user';
      
      // Jika role di cookie beda sama di database, pakai yang dari database
      if (roleFromMeta !== userRoleCookie) {
        finalRole = roleFromMeta;
      }
    }
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedRoute = ['/dashboard', '/checkout', '/profile', '/orders'].some(p => pathname.startsWith(p));

  // 3. LOGIKA PROTEKSI (BELUM LOGIN)
  if ((isProtectedRoute || isAdminRoute) && !user) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callback', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('sb-access-token');
    response.cookies.delete('user-role');
    return response;
  }

  // 4. LOGIKA REDIRECT (SUDAH LOGIN TAPI AKSES HALAMAN AUTH)
  if (isAuthPage && user) {
    const dest = finalRole === 'admin' ? '/admin' : '/dashboard';
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // 5. PROTEKSI KHUSUS ADMIN
  // Jika akses rute /admin tapi role-nya bukan admin
  if (isAdminRoute && finalRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 6. PROTEKSI USER BIASA AGAR TIDAK SALAH MASUK
  // Jika user biasa login tapi nyasar ke root '/', arahkan ke dashboard yang sesuai
  if (pathname === '/' && user) {
     const dest = finalRole === 'admin' ? '/admin' : '/dashboard';
     return NextResponse.redirect(new URL(dest, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|pixie.png).*)'],
};