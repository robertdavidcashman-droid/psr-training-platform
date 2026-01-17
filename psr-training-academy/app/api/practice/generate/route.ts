import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';

export async function POST() {
  const user = await requireAuth();
  const supabase = await createClient();

  // Pick a small set of published questions for now.
  // Phase 3 will replace this with weak-topic + due-review selection.
  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('id')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10);

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });
  if (!questions || questions.length === 0) {
    return NextResponse.json(
      { error: 'No published questions available yet. Add/publish questions in the admin CMS.' },
      { status: 400 },
    );
  }

  const { data: quiz, error: quizErr } = await supabase
    .from('quizzes')
    .insert({
      title: 'Daily Practice',
      mode: 'daily',
      settings: { generated_at: new Date().toISOString() },
      created_by: user.id,
    })
    .select('id')
    .single();

  if (quizErr || !quiz)
    return NextResponse.json({ error: quizErr?.message || 'Failed to create quiz' }, { status: 500 });

  const quizItems = questions.map((q, idx) => ({ quiz_id: quiz.id, question_id: q.id, order: idx + 1 }));
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
