import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * POST /api/auth/login
 * Server-side login route to avoid CORS issues
 * Accepts email and password, returns session via cookies
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: 'Supabase not configured. Check environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign in with password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      console.error('Login error:', authError);
      
      // Return structured error without exposing sensitive details
      let errorMessage = 'Invalid email or password';
      if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email before logging in';
      } else if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }

      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 401 }
      );
    }

    if (!authData.user || !authData.session) {
      return NextResponse.json(
        { ok: false, error: 'Login failed: no session created' },
        { status: 500 }
      );
    }

    // Session is automatically set in cookies by createServerClient
    // Return success
    return NextResponse.json({
      ok: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (err: any) {
    console.error('Login route exception:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
