import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const createSchema = z.object({
  code: z.string().min(3).max(50),
  title: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
});

export async function GET() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('competencies')
    .select('id,code,title,description')
    .order('code', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ competencies: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { data, error } = await supabase
    .from('competencies')
    .insert({
      code: parsed.data.code,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
    })
    .select('id')
    .single();

  if (error || !data)
    return NextResponse.json({ error: error?.message || 'Failed to create competency' }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'create',
    entity: 'competencies',
    entityId: data.id,
    metadata: { code: parsed.data.code },
  });

  return NextResponse.json({ id: data.id });
}
