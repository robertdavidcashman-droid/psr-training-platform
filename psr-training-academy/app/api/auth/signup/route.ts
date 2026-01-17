import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
});

/**
 * POST /api/auth/signup
 * Server-side signup route with proper error handling
 */
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, error: 'Service unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password, name } = parsed.data;
    const supabase = await createClient();

    // Sign up with password
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Signup error:', authError);
      
      // Map errors to user-friendly messages
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (authError.message.includes('User already registered')) {
        errorMessage = 'An account with this email already exists.';
      } else if (authError.message.includes('Password')) {
        errorMessage = 'Password does not meet requirements.';
      } else if (authError.message.includes('Email') || authError.message.includes('invalid')) {
        errorMessage = 'Invalid email address.';
      } else if (authError.message.includes('fetch') || authError.message.includes('network')) {
        errorMessage = 'Network issue. Please try again.';
      }

      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { ok: false, error: 'Account creation failed. Please try again.' },
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
        message: 'Please check your email to confirm your account, then log in.',
      });
    }
  } catch (err) {
    console.error('Signup route exception:', err);
    return NextResponse.json(
      { ok: false, error: 'Service unavailable. Please try again shortly.' },
      { status: 500 }
    );
  }
}
