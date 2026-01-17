'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type QuestionType = 'mcq' | 'sba' | 'truefalse' | 'short' | 'scenario';
type QuestionStatus = 'draft' | 'published';

export function QuestionCreateForm() {
  const router = useRouter();
  const [type, setType] = React.useState<QuestionType>('mcq');
  const [status, setStatus] = React.useState<QuestionStatus>('draft');
  const [difficulty, setDifficulty] = React.useState(2);
  const [prompt, setPrompt] = React.useState('');
  const [explanation, setExplanation] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (prompt.trim().length < 5) {
      setError('Prompt must be at least 5 characters.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/admin/questions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        type,
        status,
        difficulty,
        prompt: prompt.trim(),
        explanation: explanation.trim() ? explanation.trim() : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to create question');
      return;
    }

    router.push(`/admin/questions/${json.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New question</CardTitle>
        <CardDescription>Create a draft question (publish when ready).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (optional)</Label>
            <Textarea
              id="explanation"
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
            />
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
