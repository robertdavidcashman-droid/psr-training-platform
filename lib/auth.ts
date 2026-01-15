import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.warn('Error getting current user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.warn('Error in getCurrentUser:', error);
    return null;
  }
}
