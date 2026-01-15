import { NextRequest, NextResponse } from 'next/server';
import { endSession } from '@/lib/session-tracker';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity-logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // End the session by updating logout_time
    await endSession(sessionId);

    // Log logout activity
    await logActivity(user.id, {
      action_type: 'logout',
      session_id: sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error tracking logout:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track logout' },
      { status: 500 }
    );
  }
}
