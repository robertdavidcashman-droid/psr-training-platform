import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const createSchema = z.object({
  title: z.string().min(2).max(200),
  brief: z.string().max(5000).optional(),
  difficulty: z.number().int().min(1).max(5),
  status: z.enum(['draft', 'published']).optional(),
});

export async function GET() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('scenarios')
    .select('id,title,brief,difficulty,status,updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ scenarios: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      title: parsed.data.title,
      brief: parsed.data.brief ?? null,
      difficulty: parsed.data.difficulty,
      status: parsed.data.status ?? 'draft',
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error || !data)
    return NextResponse.json({ error: error?.message || 'Failed to create scenario' }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'create',
    entity: 'scenarios',
    entityId: data.id,
    metadata: { status: parsed.data.status ?? 'draft', difficulty: parsed.data.difficulty },
  });

  return NextResponse.json({ id: data.id });
}
