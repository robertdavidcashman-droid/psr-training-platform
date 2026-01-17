import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * POST /api/auth/signup
 * Server-side signup route to avoid CORS issues
 * Accepts email, password, and name, returns session via cookies
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
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { ok: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Sign up with password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Signup error:', authError);
      
      // Return structured error without exposing sensitive details
      let errorMessage = 'Failed to create account';
      if (authError.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists';
      } else if (authError.message.includes('Password')) {
        errorMessage = 'Password does not meet requirements';
      } else if (authError.message.includes('Email')) {
        errorMessage = 'Invalid email address';
      } else if (authError.message.includes('fetch') || authError.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the authentication service';
      }

      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { ok: false, error: 'Signup failed: user not created' },
        { status: 500 }
      );
    }

    // Check if session was created (email confirmations disabled)
    if (authData.session) {
      // Session is automatically set in cookies by createServerClient
      return NextResponse.json({
        ok: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        session: true, // Indicates user is logged in
      });
    } else {
      // Email confirmation required
      return NextResponse.json({
        ok: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
        session: false, // Indicates email confirmation needed
        message: 'Please check your email to confirm your account',
      });
    }
  } catch (err: any) {
    console.error('Signup route exception:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
