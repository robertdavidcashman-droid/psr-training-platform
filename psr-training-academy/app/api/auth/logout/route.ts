import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/logout
 * Server-side logout route that clears session cookies
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Sign out (clears session and cookies)
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Logout route exception:', err);
    // Even if logout fails, return success to avoid blocking user
    return NextResponse.json({ ok: true });
  }
}
