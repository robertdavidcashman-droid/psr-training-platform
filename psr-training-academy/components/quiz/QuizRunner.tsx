'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type QuestionType = 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';

type QuizSession = {
  quizId: string;
  attemptId: string;
  items: Array<{
    order: number;
    question: {
      id: string;
      type: QuestionType;
      prompt: string;
      explanation: string | null;
      difficulty: number;
      question_options: Array<{ id: number; label: string | null; text: string }>;
    } | null;
  }>;
  answered: Array<{ question_id: string; selected_option_ids: unknown; is_correct: boolean | null }>;
};

function isSingleSelect(type: QuestionType) {
  return type === 'mcq' || type === 'sba' || type === 'truefalse';
}

export function QuizRunner({ quizId, attemptId }: { quizId: string; attemptId: string }) {
  const [session, setSession] = React.useState<QuizSession | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [index, setIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [feedback, setFeedback] = React.useState<{ isCorrect: boolean; explanation?: string | null } | null>(
    null,
  );
  const [finishing, setFinishing] = React.useState(false);
  const startedAtRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const res = await fetch(`/api/quiz/session?quizId=${quizId}&attemptId=${attemptId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to load session');
      const data = (await res.json()) as QuizSession;
      if (!cancelled) {
        setSession(data);
        setIndex(0);
        startedAtRef.current = Date.now();
      }
    })()
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load session');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [quizId, attemptId]);

  React.useEffect(() => {
    // Reset selection/feedback when moving between questions.
    setSelected([]);
    setFeedback(null);
    startedAtRef.current = Date.now();
  }, [index]);

  const items = session?.items ?? [];
  const current = items[index]?.question ?? null;

  const answeredSet = React.useMemo(() => {
    const s = new Set<string>();
    for (const a of session?.answered ?? []) s.add(a.question_id);
    return s;
  }, [session]);

  const total = items.length;
  const progressLabel = total ? `${index + 1} / ${total}` : '—';

  async function submit() {
    if (!current) return;
    setError(null);
    const startedAt = startedAtRef.current;
    const timeSpentSeconds = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : undefined;

    const res = await fetch('/api/attempts/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        attemptId,
        questionId: current.id,
        selectedOptionIds: selected,
        timeSpentSeconds,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to submit answer');
      return;
    }

    setFeedback({ isCorrect: Boolean(json?.isCorrect), explanation: current.explanation });
    // Mark as answered locally so the UI can show "Already answered" if needed.
    setSession((prev) =>
      prev
        ? {
            ...prev,
            answered: [
              ...prev.answered,
              {
                question_id: current.id,
                selected_option_ids: selected,
                is_correct: Boolean(json?.isCorrect),
              },
            ],
          }
        : prev,
    );
  }

  async function finish() {
    setFinishing(true);
    setError(null);
    try {
      const res = await fetch('/api/attempts/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ attemptId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Failed to complete attempt');
      window.location.assign('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to complete attempt');
      setFinishing(false);
    }
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading session…</div>;
  if (error) return <div className="text-destructive text-sm">{error}</div>;
  if (!current) return <div className="text-muted-foreground text-sm">No questions found.</div>;

  const alreadyAnswered = answeredSet.has(current.id);
  const canSubmit = selected.length > 0 && !feedback;
  const isLast = index === total - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Quiz</h1>
          <p className="text-muted-foreground text-sm">Progress: {progressLabel}</p>
        </div>
        <div className="text-muted-foreground text-xs">Attempt: {attemptId.slice(0, 8)}…</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
          <CardDescription>
            {alreadyAnswered ? 'Already answered (this session).' : 'Select an answer and submit.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-base">{current.prompt}</div>

          <div className="space-y-2">
            {current.question_options?.map((opt) => {
              const checked = selected.includes(opt.id);
              const single = isSingleSelect(current.type);
              return (
                <label
                  key={opt.id}
                  className="hover:bg-muted flex cursor-pointer items-start gap-3 rounded-md border p-3"
                >
                  <input
                    type={single ? 'radio' : 'checkbox'}
                    name={`q-${current.id}`}
                    checked={checked}
                    onChange={() => {
                      setSelected((prev) => {
                        if (single) return [opt.id];
                        return prev.includes(opt.id) ? prev.filter((x) => x !== opt.id) : [...prev, opt.id];
                      });
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {opt.label ? <span className="mr-2">{opt.label}.</span> : null}
                      {opt.text}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {feedback ? (
            <div className="rounded-md border p-3">
              <div className="text-sm font-medium">{feedback.isCorrect ? 'Correct' : 'Not quite'}</div>
              {feedback.explanation ? (
                <div className="text-muted-foreground mt-1 text-sm">{feedback.explanation}</div>
              ) : null}
            </div>
          ) : null}

          {error ? <div className="text-destructive text-sm">{error}</div> : null}

          <div className="flex flex-wrap gap-2">
            <Button onClick={submit} disabled={!canSubmit}>
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              Previous
            </Button>
            {!isLast ? (
              <Button
                variant="outline"
                onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
                disabled={!feedback}
              >
                Next
              </Button>
            ) : (
              <Button variant="outline" onClick={finish} disabled={!feedback || finishing}>
                {finishing ? 'Finishing…' : 'Finish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-xs">
        <Label>Tip:</Label> Answering updates your spaced repetition queue automatically.
      </div>
    </div>
  );
}
