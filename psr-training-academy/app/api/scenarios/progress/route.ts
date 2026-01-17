import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  attemptId: z.string().uuid(),
  responses: z.array(z.unknown()),
});

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { attemptId, responses } = parsed.data;

  const { data: attempt, error: aErr } = await supabase
    .from('scenario_attempts')
    .select('id,user_id,completed_at')
    .eq('id', attemptId)
    .single();
  if (aErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.completed_at) return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });

  const { error: updErr } = await supabase
    .from('scenario_attempts')
    .update({ responses })
    .eq('id', attemptId);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
