import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity-logger';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors
  if (errorParam) {
    console.error('OAuth error:', errorParam, errorDescription);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  if (!code) {
    console.error('No authorization code provided in callback');
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }

  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code for session:', error.message);
      
      // Provide more specific error based on error type
      let errorType = 'auth_callback_error';
      if (error.message.includes('expired') || error.message.includes('invalid')) {
        errorType = 'auth_callback_error'; // Link expired or invalid
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorType = 'connection_error';
      }
      
      return NextResponse.redirect(`${origin}/login?error=${errorType}`);
    }
    
    // Get user ID after successful authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    // Log login activity
    if (user) {
      try {
        await logActivity(user.id, {
          action_type: 'login',
          page_url: `${origin}${next}`,
        });
      } catch (logError) {
        // Don't fail login if activity logging fails
        console.warn('Failed to log login activity:', logError);
      }
    }
    
    return NextResponse.redirect(`${origin}${next}`);
  } catch (error: any) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
  }
}

