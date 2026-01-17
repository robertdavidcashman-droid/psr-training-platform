import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { z } from 'zod';

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * POST /api/auth/reset-password
 * Server-side password reset request route
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

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.errors[0]?.message || 'Invalid email address' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email.trim().toLowerCase(), {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password/update`,
    });

    if (error) {
      console.error('Password reset error:', error);
      
      // Don't reveal if email exists or not (security best practice)
      // Always return success message
      return NextResponse.json({
        ok: true,
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
    }

    return NextResponse.json({
      ok: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (err: any) {
    console.error('Reset password route exception:', err);
    return NextResponse.json(
      { ok: false, error: 'Service unavailable. Please try again shortly.' },
      { status: 500 }
    );
  }
}
