import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  quizId: z.string().uuid(),
  attemptId: z.string().uuid(),
});

export async function GET(request: Request) {
  const user = await requireAuth();
  const supabase = await createClient();

  const url = new URL(request.url);
  const parsed = schema.safeParse({
    quizId: url.searchParams.get('quizId'),
    attemptId: url.searchParams.get('attemptId'),
  });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });

  const { quizId, attemptId } = parsed.data;

  // Verify attempt belongs to user and matches quiz.
  const { data: attempt, error: attemptErr } = await supabase
    .from('attempts')
    .select('id,user_id,quiz_id,started_at,completed_at')
    .eq('id', attemptId)
    .single();

  if (attemptErr || !attempt) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
  if (attempt.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (attempt.quiz_id !== quizId)
    return NextResponse.json({ error: 'Attempt/quiz mismatch' }, { status: 400 });

  const { data: items, error: itemsErr } = await supabase
    .from('quiz_items')
    .select(
      `
      order,
      question:questions(
        id,
        type,
        prompt,
        explanation,
        difficulty,
        question_options(id,label,text)
      )
    `,
    )
    .eq('quiz_id', quizId)
    .order('order', { ascending: true });

  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  const { data: answered } = await supabase
    .from('attempt_items')
    .select('question_id,selected_option_ids,is_correct')
    .eq('attempt_id', attemptId);

  return NextResponse.json({
    quizId,
    attemptId,
    startedAt: attempt.started_at,
    completedAt: attempt.completed_at,
    items: (items ?? []).map((i) => ({
      order: i.order,
      question: i.question,
    })),
    answered: answered ?? [],
  });
}
