import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { z } from 'zod';

// Simple in-memory rate limiting (for production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record || now > record.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function recordFailedAttempt(identifier: string) {
  const record = loginAttempts.get(identifier);
  if (record) {
    record.count++;
  }
}

function recordSuccess(identifier: string) {
  loginAttempts.delete(identifier);
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/login
 * Server-side login route with rate limiting and user-friendly errors
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

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const emailLower = email.trim().toLowerCase();
    
    // Check rate limit
    const rateLimit = checkRateLimit(emailLower);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: `Too many attempts. Please try again in ${rateLimit.retryAfter} seconds.` 
        },
        { status: 429 }
      );
    }

    const supabase = await createClient();

    // Sign in with password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailLower,
      password,
    });

    if (authError) {
      recordFailedAttempt(emailLower);
      
      // Map Supabase errors to user-friendly messages
      let errorMessage = 'Email or password incorrect.';
      let statusCode = 401;

      if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email before logging in.';
      } else if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email or password incorrect.';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please try again in 1 minute.';
        statusCode = 429;
      } else if (authError.message.includes('fetch') || authError.message.includes('network')) {
        errorMessage = 'Network issue. Please try again.';
        statusCode = 503;
      } else if (authError.message.includes('User not found')) {
        errorMessage = 'Email or password incorrect.';
      }

      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: statusCode }
      );
    }

    if (!authData.user || !authData.session) {
      recordFailedAttempt(emailLower);
      return NextResponse.json(
        { ok: false, error: 'Login failed. Please try again.' },
        { status: 500 }
      );
    }

    // Success - clear rate limit
    recordSuccess(emailLower);

    // Session is automatically set in cookies by createServerClient
    return NextResponse.json({
      ok: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (err: any) {
    console.error('Login route exception:', err);
    
    // Never expose internal errors
    return NextResponse.json(
      { ok: false, error: 'Service unavailable. Please try again shortly.' },
      { status: 500 }
    );
  }
}
