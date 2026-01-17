import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  const user = await requireAuth();
  const supabase = await createClient();

  const nowIso = new Date().toISOString();
  const { data: due, error: dueErr } = await supabase
    .from('review_queue')
    .select('question_id')
    .eq('user_id', user.id)
    .lte('next_due_at', nowIso)
    .order('next_due_at', { ascending: true })
    .limit(20);

  if (dueErr) return NextResponse.json({ error: dueErr.message }, { status: 500 });
  const questionIds = (due ?? []).map((d) => d.question_id);
  if (questionIds.length === 0) {
    return NextResponse.json({ error: 'Nothing due for review yet.' }, { status: 400 });
  }

  // Only include questions that are still published.
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id')
    .in('id', questionIds)
    .eq('status', 'published');
  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

  const publishedIds = (questions ?? []).map((q) => q.id);
  if (publishedIds.length === 0) {
    return NextResponse.json({ error: 'No reviewable questions are currently published.' }, { status: 400 });
  }

  const { data: quiz, error: quizErr } = await supabase
    .from('quizzes')
    .insert({
      title: 'Review',
      mode: 'topic',
      settings: { kind: 'review', generated_at: nowIso },
      created_by: user.id,
    })
    .select('id')
    .single();

  if (quizErr || !quiz)
    return NextResponse.json({ error: quizErr?.message || 'Failed to create quiz' }, { status: 500 });

  const quizItems = publishedIds.map((id, idx) => ({ quiz_id: quiz.id, question_id: id, order: idx + 1 }));
  const { error: itemsErr } = await supabase.from('quiz_items').insert(quizItems);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  const { data: attempt, error: attemptErr } = await supabase
    .from('attempts')
    .insert({ user_id: user.id, quiz_id: quiz.id })
    .select('id')
    .single();

  if (attemptErr || !attempt) {
    return NextResponse.json({ error: attemptErr?.message || 'Failed to create attempt' }, { status: 500 });
  }

  return NextResponse.json({ quizId: quiz.id, attemptId: attempt.id });
}
