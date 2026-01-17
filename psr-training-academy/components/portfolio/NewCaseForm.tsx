'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function NewCaseForm() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [caseType, setCaseType] = React.useState('');
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
    const res = await fetch('/api/portfolio/cases', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), caseType: caseType.trim() ? caseType.trim() : undefined }),
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to create case');
      return;
    }

    router.push(`/portfolio/${json.caseId}`);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New portfolio case</CardTitle>
        <CardDescription>Create a structured, non-identifying training record.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Theft allegation – early advice"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caseType">Case type (optional)</Label>
            <Input
              id="caseType"
              placeholder="e.g. theft, assault, interview prep"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create case'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
