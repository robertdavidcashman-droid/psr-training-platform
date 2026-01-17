import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const schema = z.object({
  options: z
    .array(
      z.object({
        label: z.string().max(10).nullable().optional(),
        text: z.string().min(1).max(4000),
        is_correct: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(12),
});

export async function PUT(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { questionId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  // Replace options (simple approach for now).
  const { error: delErr } = await supabase.from('question_options').delete().eq('question_id', questionId);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  const inserts = parsed.data.options.map((o) => ({
    question_id: questionId,
    label: o.label ?? null,
    text: o.text,
    is_correct: o.is_correct ?? false,
  }));
  const { error: insErr } = await supabase.from('question_options').insert(inserts);
  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update_options',
    entity: 'question_options',
    entityId: questionId,
    metadata: { count: inserts.length },
  });

  return NextResponse.json({ ok: true });
}
