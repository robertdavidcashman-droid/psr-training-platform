import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('audit_events')
    .select('id,actor_user_id,action,entity,entity_id,metadata,created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}
