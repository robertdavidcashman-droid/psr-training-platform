import { NextResponse } from 'next/server';
import { requireSupervisorOrAdmin } from '@/lib/profile';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  await requireSupervisorOrAdmin();
  const supabase = await createClient();

  // RLS will filter to only supervisee cases that are shared/signedoff.
  const { data, error } = await supabase
    .from('portfolio_cases')
    .select('id,title,case_type,updated_at,status,user_id')
    .in('status', ['shared', 'signedoff'])
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cases: data ?? [] });
}
