import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './config';

export async function createClient() {
  if (!isSupabaseConfigured()) {
    // Avoid crashing builds/tests when env vars are missing.
    return createServerClient('https://placeholder.supabase.co', 'placeholder-key', {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op
        },
      },
    });
  }

  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Can be called from Server Components. Middleware will refresh sessions.
        }
      },
    },
  });
}
