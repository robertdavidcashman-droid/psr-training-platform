/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return false;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
    return true;
  } catch {
    return false;
  }
}






