import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { redirect } from 'next/navigation';

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

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    redirect('/login');
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      redirect('/login');
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      redirect('/');
    }

    return user;
  } catch (error) {
    console.warn('Error in requireAdmin:', error);
    redirect('/login');
  }
}
