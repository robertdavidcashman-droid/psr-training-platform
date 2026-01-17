'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ScenarioStatus = 'draft' | 'published';
type StepType = 'info' | 'question' | 'decision';

type StepDraft = {
  step_order: number;
  step_type: StepType;
  content: string;
  payload: string; // JSON string
};

type ScenarioPayload = {
  scenario: { id: string; title: string; brief: string | null; difficulty: number; status: ScenarioStatus };
  steps: Array<{ step_order: number; step_type: StepType; content: string; payload: unknown }>;
};

export function ScenarioEditor({ scenarioId }: { scenarioId: string }) {
  const [data, setData] = React.useState<ScenarioPayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState('');
  const [brief, setBrief] = React.useState('');
  const [difficulty, setDifficulty] = React.useState(2);
  const [status, setStatus] = React.useState<ScenarioStatus>('draft');
  const [steps, setSteps] = React.useState<StepDraft[]>([]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/scenarios/${scenarioId}`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to load');
      setLoading(false);
      return;
    }
    const payload = json as ScenarioPayload;
    setData(payload);
    setTitle(payload.scenario.title);
    setBrief(payload.scenario.brief ?? '');
    setDifficulty(payload.scenario.difficulty);
    setStatus(payload.scenario.status);
    setSteps(
      (payload.steps ?? []).map((s) => ({
        step_order: s.step_order,
        step_type: s.step_type,
        content: s.content,
        payload: JSON.stringify(s.payload ?? {}, null, 2),
      })),
    );
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  async function saveAll() {
    setSaving(true);
    setError(null);

    const res = await fetch(`/api/admin/scenarios/${scenarioId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        brief: brief.trim() ? brief.trim() : null,
        difficulty,
        status,
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to save scenario');
      setSaving(false);
      return;
    }

    let parsedSteps: Array<{ step_order: number; step_type: StepType; content: string; payload: unknown }> =
      [];
    try {
      parsedSteps = steps.map((s) => ({
        step_order: s.step_order,
        step_type: s.step_type,
        content: s.content,
        payload: s.payload.trim() ? JSON.parse(s.payload) : {},
      }));
    } catch {
      setError('One of the step payloads is not valid JSON.');
      setSaving(false);
      return;
    }

    const res2 = await fetch(`/api/admin/scenarios/${scenarioId}/steps`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ steps: parsedSteps }),
    });
    const json2 = await res2.json().catch(() => ({}));
    setSaving(false);
    if (!res2.ok) {
      setError(json2?.error ?? 'Failed to save steps');
      return;
    }

    await load();
  }

  async function deleteScenario() {
    if (!confirm('Delete this scenario?')) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/scenarios/${scenarioId}`, { method: 'DELETE' });
    const json = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to delete');
      return;
    }
    window.location.assign('/admin/scenarios');
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading…</div>;
  if (error && !data) return <div className="text-destructive text-sm">{error}</div>;
  if (!data) return <div className="text-muted-foreground text-sm">Not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Edit scenario</h1>
          <p className="text-muted-foreground text-sm">ID: {scenarioId}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/scenarios">
            <Button variant="outline">Back</Button>
          </Link>
          <Button variant="destructive" onClick={deleteScenario} disabled={saving}>
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Publishing makes it visible on the Scenarios page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
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
            <Label>Brief</Label>
            <Textarea rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Steps</div>
                <div className="text-muted-foreground text-xs">
                  Payload is JSON (used for decision options, etc.).
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSteps((prev) => [
                    ...prev,
                    {
                      step_order: prev.length ? Math.max(...prev.map((p) => p.step_order)) + 1 : 1,
                      step_type: 'info',
                      content: '',
                      payload: '{}',
                    },
                  ])
                }
              >
                Add step
              </Button>
            </div>

            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div key={idx} className="space-y-3 rounded-md border p-3">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Order</Label>
                      <Input
                        type="number"
                        min={1}
                        value={s.step_order}
                        onChange={(e) =>
                          setSteps((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, step_order: Number(e.target.value) } : x,
                            ),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={s.step_type}
                        onValueChange={(v) =>
                          setSteps((prev) =>
                            prev.map((x, i) => (i === idx ? { ...x, step_type: v as StepType } : x)),
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="decision">Decision</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSteps((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Content</Label>
                    <Textarea
                      rows={4}
                      value={s.content}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, content: e.target.value } : x)),
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Payload (JSON)</Label>
                    <Textarea
                      rows={4}
                      value={s.payload}
                      onChange={(e) =>
                        setSteps((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, payload: e.target.value } : x)),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {steps.length === 0 ? <p className="text-muted-foreground text-sm">No steps yet.</p> : null}
            </div>
          </div>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button onClick={saveAll} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
