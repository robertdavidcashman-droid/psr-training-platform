import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  scenarioId: z.string().uuid(),
});

export async function POST(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { scenarioId } = parsed.data;

  // Ensure scenario is published.
  const { data: scenario, error: sErr } = await supabase
    .from('scenarios')
    .select('id,status')
    .eq('id', scenarioId)
    .single();
  if (sErr || !scenario) return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  if (scenario.status !== 'published')
    return NextResponse.json({ error: 'Scenario not available' }, { status: 400 });

  const { data: attempt, error: aErr } = await supabase
    .from('scenario_attempts')
    .insert({ user_id: user.id, scenario_id: scenarioId, responses: [] })
    .select('id')
    .single();
  if (aErr || !attempt)
    return NextResponse.json({ error: aErr?.message || 'Failed to start scenario' }, { status: 500 });

  return NextResponse.json({ attemptId: attempt.id });
}
