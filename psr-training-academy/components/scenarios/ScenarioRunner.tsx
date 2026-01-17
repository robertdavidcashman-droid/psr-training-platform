'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type StepType = 'info' | 'question' | 'decision';

type ScenarioStep = {
  id: string;
  step_order: number;
  content: string;
  step_type: StepType;
  payload: unknown;
};

type ScenarioSession = {
  scenario: {
    id: string;
    title: string;
    brief: string | null;
    difficulty: number;
  };
  attempt: {
    id: string;
    completedAt: string | null;
    score: number | null;
    notes: string | null;
    responses: unknown;
  };
  steps: ScenarioStep[];
};

type StepResponse = {
  stepId: string;
  type: StepType;
  value: unknown;
  at: string;
};

function safeArray(v: unknown): StepResponse[] {
  return Array.isArray(v) ? (v as StepResponse[]) : [];
}

function getDecisionOptions(payload: unknown): Array<{ id: string; text: string }> {
  if (!payload || typeof payload !== 'object') return [];
  const p = payload as { options?: unknown };
  if (!Array.isArray(p.options)) return [];
  return p.options
    .map((o) => {
      if (!o || typeof o !== 'object') return null;
      const oo = o as { id?: unknown; text?: unknown };
      if (typeof oo.id !== 'string' || typeof oo.text !== 'string') return null;
      return { id: oo.id, text: oo.text };
    })
    .filter((x): x is { id: string; text: string } => Boolean(x));
}

export function ScenarioRunner({ scenarioId, attemptId }: { scenarioId: string; attemptId: string }) {
  const [data, setData] = React.useState<ScenarioSession | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [index, setIndex] = React.useState(0);
  const [responses, setResponses] = React.useState<StepResponse[]>([]);
  const [draftText, setDraftText] = React.useState('');
  const [selectedDecision, setSelectedDecision] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [finishing, setFinishing] = React.useState(false);
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const res = await fetch(`/api/scenarios/session?scenarioId=${scenarioId}&attemptId=${attemptId}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? 'Failed to load scenario');
      const json = (await res.json()) as ScenarioSession;
      if (!cancelled) {
        setData(json);
        setResponses(safeArray(json.attempt.responses));
        setNotes(json.attempt.notes ?? '');
        setIndex(0);
      }
    })()
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load scenario');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scenarioId, attemptId]);

  const steps = data?.steps ?? [];
  const step = steps[index] ?? null;
  const total = steps.length;
  const isLast = index === total - 1;

  React.useEffect(() => {
    // Reset per-step inputs.
    setDraftText('');
    setSelectedDecision(null);
  }, [index]);

  async function persist(nextResponses: StepResponse[]) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/scenarios/progress', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ attemptId, responses: nextResponses }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Failed to save progress');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  }

  async function saveAndNext() {
    if (!step) return;

    // For info steps, no response needed.
    if (step.step_type === 'info') {
      setIndex((i) => Math.min(total - 1, i + 1));
      return;
    }

    let value: unknown;
    if (step.step_type === 'question') {
      if (!draftText.trim()) {
        setError('Please enter a response.');
        return;
      }
      value = { text: draftText.trim() };
    } else {
      if (!selectedDecision) {
        setError('Please select an option.');
        return;
      }
      value = { optionId: selectedDecision };
    }

    const entry: StepResponse = {
      stepId: step.id,
      type: step.step_type,
      value,
      at: new Date().toISOString(),
    };
    const next = [...responses.filter((r) => r.stepId !== step.id), entry].sort((a, b) =>
      a.at.localeCompare(b.at),
    );
    setResponses(next);
    await persist(next);
    if (!error) setIndex((i) => Math.min(total - 1, i + 1));
  }

  async function finish() {
    setFinishing(true);
    setError(null);
    try {
      const res = await fetch('/api/scenarios/complete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ attemptId, notes: notes.trim() ? notes.trim() : undefined }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Failed to complete scenario');
      window.location.assign('/scenarios');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to complete scenario');
      setFinishing(false);
    }
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading scenario…</div>;
  if (error) return <div className="text-destructive text-sm">{error}</div>;
  if (!data || !step) return <div className="text-muted-foreground text-sm">Scenario not found.</div>;

  const decisionOptions = step.step_type === 'decision' ? getDecisionOptions(step.payload) : [];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{data.scenario.title}</h1>
        {data.scenario.brief ? <p className="text-muted-foreground text-sm">{data.scenario.brief}</p> : null}
        <p className="text-muted-foreground text-xs">
          Step {index + 1} / {total} · Difficulty {data.scenario.difficulty}/5
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {step.step_type === 'info'
              ? 'Briefing'
              : step.step_type === 'question'
                ? 'Your response'
                : 'Decision'}
          </CardTitle>
          <CardDescription>Work through the scenario and keep notes as you go.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-base whitespace-pre-wrap">{step.content}</div>

          {step.step_type === 'question' ? (
            <div className="space-y-2">
              <Label htmlFor="response">Response</Label>
              <Textarea
                id="response"
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={5}
              />
              <p className="text-muted-foreground text-xs">
                Write what you would do/say next (training reflection).
              </p>
            </div>
          ) : null}

          {step.step_type === 'decision' ? (
            <div className="space-y-2">
              <Label>Choose one option</Label>
              <div className="space-y-2">
                {decisionOptions.map((o) => (
                  <label
                    key={o.id}
                    className="hover:bg-muted flex cursor-pointer items-start gap-3 rounded-md border p-3"
                  >
                    <input
                      type="radio"
                      name={`decision-${step.id}`}
                      checked={selectedDecision === o.id}
                      onChange={() => setSelectedDecision(o.id)}
                    />
                    <div className="text-sm">{o.text}</div>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          {saving ? <div className="text-muted-foreground text-xs">Saving…</div> : null}

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
            >
              Previous
            </Button>
            {!isLast ? (
              <Button onClick={saveAndNext} disabled={saving}>
                Next
              </Button>
            ) : (
              <Button onClick={finish} disabled={finishing || saving}>
                {finishing ? 'Finishing…' : 'Finish'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
