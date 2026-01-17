import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * GET /api/auth/health
 * Check if server can read session cookies
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        ok: false,
        hasSession: false,
        error: 'Supabase not configured',
      });
    }

    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    return NextResponse.json({
      ok: true,
      hasSession: !!user,
      userId: user?.id || null,
      error: error?.message || null,
    });
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({
      ok: false,
      hasSession: false,
      error: error.message || 'Unknown error',
    });
  }
}
