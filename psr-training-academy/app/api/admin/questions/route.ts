import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { logAuditEvent } from '@/lib/audit';

const createSchema = z.object({
  type: z.enum(['mcq', 'sba', 'truefalse', 'short', 'scenario']),
  prompt: z.string().min(5).max(8000),
  explanation: z.string().max(20000).optional(),
  difficulty: z.number().int().min(1).max(5),
  status: z.enum(['draft', 'published']).optional(),
});

export async function GET() {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('questions')
    .select('id,type,prompt,difficulty,status,created_at,updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ questions: data ?? [] });
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  const supabase = await createClient();

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { data, error } = await supabase
    .from('questions')
    .insert({
      type: parsed.data.type,
      prompt: parsed.data.prompt,
      explanation: parsed.data.explanation ?? null,
      difficulty: parsed.data.difficulty,
      status: parsed.data.status ?? 'draft',
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error || !data)
    return NextResponse.json({ error: error?.message || 'Failed to create question' }, { status: 500 });

  await logAuditEvent(supabase, user.id, {
    action: 'create',
    entity: 'questions',
    entityId: data.id,
    metadata: {
      status: parsed.data.status ?? 'draft',
      difficulty: parsed.data.difficulty,
      type: parsed.data.type,
    },
  });

  return NextResponse.json({ id: data.id });
}
