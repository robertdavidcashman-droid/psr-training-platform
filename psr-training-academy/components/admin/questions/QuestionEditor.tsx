'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type QuestionType = 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';
type QuestionStatus = 'draft' | 'published';

type OptionDraft = { label: string; text: string; is_correct: boolean };

type QuestionPayload = {
  question: {
    id: string;
    type: QuestionType;
    prompt: string;
    explanation: string | null;
    difficulty: number;
    status: QuestionStatus;
  };
  options: Array<{ id: number; label: string | null; text: string; is_correct: boolean }>;
};

export function QuestionEditor({ questionId }: { questionId: string }) {
  const [data, setData] = React.useState<QuestionPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [type, setType] = React.useState<QuestionType>('mcq');
  const [status, setStatus] = React.useState<QuestionStatus>('draft');
  const [difficulty, setDifficulty] = React.useState(2);
  const [prompt, setPrompt] = React.useState('');
  const [explanation, setExplanation] = React.useState('');
  const [options, setOptions] = React.useState<OptionDraft[]>([]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/questions/${questionId}`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to load');
      setLoading(false);
      return;
    }
    const payload = json as QuestionPayload;
    setData(payload);
    setType(payload.question.type);
    setStatus(payload.question.status);
    setDifficulty(payload.question.difficulty);
    setPrompt(payload.question.prompt);
    setExplanation(payload.question.explanation ?? '');
    setOptions(
      (payload.options ?? []).map((o) => ({ label: o.label ?? '', text: o.text, is_correct: o.is_correct })),
    );
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  async function saveQuestion() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/questions/${questionId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type,
        status,
        difficulty,
        prompt: prompt.trim(),
        explanation: explanation.trim() ? explanation.trim() : null,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to save');
      setSaving(false);
      return;
    }

    const res2 = await fetch(`/api/admin/questions/${questionId}/options`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        options: options.map((o) => ({
          label: o.label.trim() ? o.label.trim() : null,
          text: o.text,
          is_correct: o.is_correct,
        })),
      }),
    });
    const json2 = await res2.json().catch(() => ({}));
    setSaving(false);
    if (!res2.ok) {
      setError(json2?.error ?? 'Failed to save options');
      return;
    }

    await load();
  }

  async function deleteQuestion() {
    if (!confirm('Delete this question?')) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/questions/${questionId}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to delete');
      return;
    }
    window.location.assign('/admin/questions');
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading…</div>;
  if (error && !data) return <div className="text-destructive text-sm">{error}</div>;
  if (!data) return <div className="text-muted-foreground text-sm">Not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Edit question</h1>
          <p className="text-muted-foreground text-sm">ID: {questionId}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions">
            <Button variant="outline">Back</Button>
          </Link>
          <Button variant="destructive" onClick={deleteQuestion} disabled={saving}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Publishing makes it eligible for practice sessions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as QuestionType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">MCQ</SelectItem>
                  <SelectItem value="sba">SBA</SelectItem>
                  <SelectItem value="truefalse">True/False</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="scenario">Scenario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as QuestionStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Explanation</Label>
            <Textarea rows={4} value={explanation} onChange={(e) => setExplanation(e.target.value)} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Options</div>
                <div className="text-muted-foreground text-xs">Mark the correct option(s).</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOptions((prev) => [...prev, { label: '', text: '', is_correct: false }])}
              >
                Add option
              </Button>
            </div>

            <div className="space-y-2">
              {options.map((o, idx) => (
                <div key={idx} className="grid gap-2 rounded-md border p-3 md:grid-cols-[120px_1fr_120px]">
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={o.label}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Text</Label>
                    <Input
                      value={o.text}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, text: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                  <div className="flex items-end justify-between gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={o.is_correct}
                        onChange={(e) =>
                          setOptions((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, is_correct: e.target.checked } : x)),
                          )
                        }
                      />
                      Correct
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOptions((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              {options.length === 0 ? <p className="text-muted-foreground text-sm">No options yet.</p> : null}
            </div>
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <Button onClick={saveQuestion} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
