import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Pastikan redirect ke update-password setelah sukses
  const next = searchParams.get('next') ?? '/update-password'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Kita pakai spread options agar secure, httpOnly, dll terbawa otomatis
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // BERHASIL: Langsung arahkan ke halaman form update password
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    // Log error di terminal biar abang bisa liat penyebab aslinya
    console.error('Login Error:', error.message)
  }

  // GAGAL: Balik ke login
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`)
}