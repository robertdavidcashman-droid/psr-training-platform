import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from './config';

export async function getUserFromRequest(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  if (!isSupabaseConfigured()) {
    return { user: null, response };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set({ name, value, ...options });
        });
      },
    },
  });

  // Refresh session if needed (required for Server Components).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}
