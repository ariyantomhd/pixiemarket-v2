import { createBrowserClient } from '@supabase/ssr'

// Khusus untuk dipanggil di "use client" components
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Ini kuncinya! Supaya token disimpan di cookie secara otomatis
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'pixie-auth-token',
      }
    }
  )

// Export instance tunggal untuk kemudahan (Opsional)
export const supabase = createClient()