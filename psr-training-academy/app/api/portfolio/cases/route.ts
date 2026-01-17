import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const createSchema = z.object({
  title: z.string().min(2).max(140),
  caseType: z.string().max(80).optional(),
});

export async function GET() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('portfolio_cases')
    .select('id,title,case_type,updated_at,status')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cases: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { title, caseType } = parsed.data;

  const { data, error } = await supabase
    .from('portfolio_cases')
    .insert({
      user_id: user.id,
      title,
      case_type: caseType ?? null,
      status: 'draft',
    })
    .select('id')
    .single();

  if (error || !data)
    return NextResponse.json({ error: error?.message || 'Failed to create case' }, { status: 500 });
  return NextResponse.json({ caseId: data.id });
}
