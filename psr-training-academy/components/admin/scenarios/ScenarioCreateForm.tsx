'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ScenarioStatus = 'draft' | 'published';

export function ScenarioCreateForm() {
  const router = useRouter();
  const [status, setStatus] = React.useState<ScenarioStatus>('draft');
  const [difficulty, setDifficulty] = React.useState(2);
  const [title, setTitle] = React.useState('');
  const [brief, setBrief] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 2) {
      setError('Title must be at least 2 characters.');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/admin/scenarios', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        status,
        difficulty,
        brief: brief.trim() ? brief.trim() : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to create scenario');
      return;
    }

    router.push(`/admin/scenarios/${json.id}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New scenario</CardTitle>
        <CardDescription>Create a draft scenario (publish when ready).</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as ScenarioStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="brief">Brief (optional)</Label>
            <Textarea id="brief" rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} />
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
