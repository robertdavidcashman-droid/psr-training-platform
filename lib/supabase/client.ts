'use client';

import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!isSupabaseConfigured()) {
    console.warn('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    // Return a mock client that won't crash but will fail on actual operations
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!);
}
