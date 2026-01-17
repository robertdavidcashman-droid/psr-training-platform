import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const patchSchema = z.object({
  code: z.string().min(3).max(50).optional(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ competencyId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { competencyId } = await params;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (parsed.data.code !== undefined) patch.code = parsed.data.code;
  if (parsed.data.title !== undefined) patch.title = parsed.data.title;
  if (parsed.data.description !== undefined) patch.description = parsed.data.description;

  const { error } = await supabase.from('competencies').update(patch).eq('id', competencyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'update',
    entity: 'competencies',
    entityId: competencyId,
    metadata: patch,
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ competencyId: string }> }) {
  const user = await requireAdmin();
  const supabase = await createClient();
  const { competencyId } = await params;

  const { error } = await supabase.from('competencies').delete().eq('id', competencyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'delete',
    entity: 'competencies',
    entityId: competencyId,
  });
  return NextResponse.json({ ok: true });
}
