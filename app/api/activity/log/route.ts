import { NextRequest, NextResponse } from 'next/server';
import { logActivity, ActionType } from '@/lib/activity-logger';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Silently succeed for anonymous users - don't log their activity
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const body = await request.json();
    const { action_type, action_details, page_url, session_id } = body;

    if (!action_type) {
      return NextResponse.json(
        { error: 'Action type is required' },
        { status: 400 }
      );
    }

    await logActivity(user.id, {
      action_type: action_type as ActionType,
      action_details,
      page_url,
      session_id,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log activity' },
      { status: 500 }
    );
  }
}
