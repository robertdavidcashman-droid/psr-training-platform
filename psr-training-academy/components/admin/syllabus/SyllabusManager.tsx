'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Topic = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  parent_id: string | null;
};
type Competency = { id: string; code: string; title: string; description: string | null };

export function SyllabusManager() {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [competencies, setCompetencies] = React.useState<Competency[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [topicCode, setTopicCode] = React.useState('PSR.NEW');
  const [topicTitle, setTopicTitle] = React.useState('');
  const [topicDesc, setTopicDesc] = React.useState('');
  const [topicParentId, setTopicParentId] = React.useState<string | null>(null);

  const [compCode, setCompCode] = React.useState('C.NEW');
  const [compTitle, setCompTitle] = React.useState('');
  const [compDesc, setCompDesc] = React.useState('');

  async function load() {
    setLoading(true);
    setError(null);
    const [tRes, cRes] = await Promise.all([
      fetch('/api/admin/syllabus/topics', { cache: 'no-store' }),
      fetch('/api/admin/syllabus/competencies', { cache: 'no-store' }),
    ]);
    const tJson = await tRes.json().catch(() => ({}));
    const cJson = await cRes.json().catch(() => ({}));
    if (!tRes.ok) {
      setError(tJson?.error ?? 'Failed to load topics');
      setLoading(false);
      return;
    }
    if (!cRes.ok) {
      setError(cJson?.error ?? 'Failed to load competencies');
      setLoading(false);
      return;
    }
    setTopics(tJson.topics ?? []);
    setCompetencies(cJson.competencies ?? []);
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
  }, []);

  async function createTopic(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/syllabus/topics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        code: topicCode.trim(),
        title: topicTitle.trim(),
        description: topicDesc.trim() ? topicDesc.trim() : undefined,
        parentId: topicParentId,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to create topic');
      return;
    }
    setTopicTitle('');
    setTopicDesc('');
    await load();
  }

  async function createCompetency(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/admin/syllabus/competencies', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        code: compCode.trim(),
        title: compTitle.trim(),
        description: compDesc.trim() ? compDesc.trim() : undefined,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to create competency');
      return;
    }
    setCompTitle('');
    setCompDesc('');
    await load();
  }

  async function deleteTopic(id: string) {
    if (!confirm('Delete this topic?')) return;
    const res = await fetch(`/api/admin/syllabus/topics/${id}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json?.error ?? 'Failed to delete topic');
    else await load();
  }

  async function deleteCompetency(id: string) {
    if (!confirm('Delete this competency?')) return;
    const res = await fetch(`/api/admin/syllabus/competencies/${id}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json?.error ?? 'Failed to delete competency');
    else await load();
  }

  const topicById = React.useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  if (loading) return <div className="text-muted-foreground text-sm">Loading…</div>;

  return (
    <div className="space-y-6">
      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create topic</CardTitle>
            <CardDescription>Build your syllabus tree.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTopic} className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={topicCode} onChange={(e) => setTopicCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={topicDesc} onChange={(e) => setTopicDesc(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Parent (optional)</Label>
                <Select
                  value={topicParentId ?? 'none'}
                  onValueChange={(v) => setTopicParentId(v === 'none' ? null : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Parent topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent</SelectItem>
                    {topics.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.code} — {t.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create competency</CardTitle>
            <CardDescription>Add competency codes used for tagging.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createCompetency} className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={compCode} onChange={(e) => setCompCode(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={compTitle} onChange={(e) => setCompTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} value={compDesc} onChange={(e) => setCompDesc(e.target.value)} />
              </div>
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
          <CardDescription>All topics (delete is available; edit can be added next).</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-xs">{t.code}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell className="text-xs">
                    {t.parent_id ? (topicById.get(t.parent_id)?.code ?? '—') : '—'}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => deleteTopic(t.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Competencies</CardTitle>
          <CardDescription>All competencies (delete is available; edit can be added next).</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {competencies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xs">{c.code}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => deleteCompetency(c.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
