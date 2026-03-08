'use server'

import { cookies } from 'next/headers';

/**
 * Mengatur session token dan role user di dalam HTTP-only cookies
 */
export async function setAuthSession(token: string, role: string, expires: number) {
  const cookieStore = await cookies();
  const options = {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expires,
    sameSite: 'lax' as const,
  };

  cookieStore.set('sb-access-token', token, options);
  cookieStore.set('user-role', role, options);
}

/**
 * Menghapus session cookie di sisi server
 */
export async function deleteAuthSession() {
  const cookieStore = await cookies();
  // Memberikan path secara eksplisit agar browser benar-benar menghapusnya
  cookieStore.delete({ name: 'sb-access-token', path: '/' });
  cookieStore.delete({ name: 'user-role', path: '/' });
}

/**
 * Alias untuk konsistensi penamaan
 */
export async function removeAuthSession() {
  return await deleteAuthSession();
}