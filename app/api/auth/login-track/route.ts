import { NextRequest, NextResponse } from 'next/server';
import { startSession } from '@/lib/session-tracker';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Return null for anonymous users - don't throw error
    if (!user) {
      return NextResponse.json({ sessionId: null });
    }

    const sessionId = await startSession(user.id);
    return NextResponse.json({ sessionId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


























