import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const stepSchema = z.object({
  step_order: z.number().int().min(1).max(200),
  content: z.string().min(1).max(12000),
  step_type: z.enum(['info', 'question', 'decision']),
  payload: z.unknown().optional(),
});

const schema = z.object({
  steps: z.array(stepSchema).min(1).max(200),
});

export async function PUT(request: Request, { params }: { params: Promise<{ scenarioId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { scenarioId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { error: delErr } = await supabase.from('scenario_steps').delete().eq('scenario_id', scenarioId);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  const inserts = parsed.data.steps
    .slice()
    .sort((a, b) => a.step_order - b.step_order)
    .map((s) => ({
      scenario_id: scenarioId,
      step_order: s.step_order,
      content: s.content,
      step_type: s.step_type,
      payload: s.payload ?? {},
    }));

  const { error: insErr } = await supabase.from('scenario_steps').insert(inserts);
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update_steps',
    entity: 'scenario_steps',
    entityId: scenarioId,
    metadata: { count: inserts.length },
  });

  return NextResponse.json({ ok: true });
}
