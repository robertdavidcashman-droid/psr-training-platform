'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AiGenerator() {
  const [prompt, setPrompt] = React.useState(
    'Write a question about professional boundaries at the police station.',
  );
  const [count, setCount] = React.useState(3);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<unknown>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await fetch('/api/admin/ai/generate-questions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, count }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to generate');
      return;
    }
    setResult(json);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate draft questions (stub)</CardTitle>
        <CardDescription>
          Returns suggested question drafts as JSON. Review before adding to the bank.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea id="prompt" rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="count">Count</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <Button onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate'}
        </Button>

        {result ? (
          <div className="space-y-2">
            <Label>Result</Label>
            <pre className="bg-muted max-h-[420px] overflow-auto rounded-md border p-3 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
