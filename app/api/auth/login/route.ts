import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'Authentication service is not configured. Please check environment variables.',
          code: 'config_error',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if it's a network/connection error
      const errorMessage = error.message?.toLowerCase() || '';
      const isNetworkError = 
        errorMessage.includes('network') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('econnrefused') ||
        errorMessage.includes('enotfound');

      return NextResponse.json(
        {
          error: isNetworkError 
            ? 'Network issue. Please check your connection and try again.' 
            : error.message || 'Authentication failed',
          code: isNetworkError ? 'network_error' : (error.status || 'auth_error'),
        },
        { status: isNetworkError ? 503 : 401 }
      );
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (error: any) {
    // Check if it's a network/connection error
    const errorMessage = error.message?.toLowerCase() || '';
    const isNetworkError = 
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('econnrefused') ||
      errorMessage.includes('enotfound');

    return NextResponse.json(
      {
        error: isNetworkError
          ? 'Network issue. Please check your connection and try again.'
          : error.message || 'Internal server error',
        code: isNetworkError ? 'network_error' : 'server_error',
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
