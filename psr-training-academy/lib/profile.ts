import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export type ProfileRole = 'user' | 'supervisor' | 'admin';

export async function getCurrentProfile() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id,name,email,role')
    .eq('id', user.id)
    .maybeSingle();

  return profile ?? null;
}

export async function requireSupervisorOrAdmin() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/login');
  if (profile.role !== 'supervisor' && profile.role !== 'admin') redirect('/portfolio');
  return profile;
}
