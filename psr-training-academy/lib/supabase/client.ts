'use client';

import { createBrowserClient } from '@supabase/ssr';
import { isSupabaseConfigured } from './config';

export function createClient() {
  if (!isSupabaseConfigured()) {
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
