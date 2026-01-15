import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // Handle PKCE flow (OAuth and newer magic links)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const redirectUrl = new URL(next, requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.error('Auth callback error (code exchange):', error);
  }

  // Handle magic link with token_hash (older flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'magiclink' | 'recovery' | 'invite' | 'signup',
    });

    if (!error) {
      const redirectUrl = new URL(next, requestUrl.origin);
      return NextResponse.redirect(redirectUrl);
    }
    
    console.error('Auth callback error (token verification):', error);
  }

  // If there's an error or no valid params, redirect to login with error
  return NextResponse.redirect(new URL('/login?error=auth_callback_error', requestUrl.origin));
}
