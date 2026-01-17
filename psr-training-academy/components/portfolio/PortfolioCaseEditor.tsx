'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  PORTFOLIO_REFLECTIONS,
  PORTFOLIO_SECTIONS,
  type PortfolioStatus,
} from '@/components/portfolio/templates';

type PortfolioCase = {
  id: string;
  title: string;
  case_type: string | null;
  status: PortfolioStatus;
  updated_at: string;
  created_at: string;
  user_id: string;
};

type CasePayload = {
  case: PortfolioCase;
  canEdit: boolean;
  entries: Array<{ section_key: string; content: unknown; updated_at: string }>;
  reflections: Array<{ prompt_key: string; response: string | null; updated_at: string }>;
  signoffs: Array<{ id: string; supervisor_user_id: string; signed_at: string; comments: string | null }>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asTextContent(v: unknown) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (isRecord(v) && typeof v.text === 'string') return v.text;
  return JSON.stringify(v, null, 2);
}

export function PortfolioCaseEditor({ caseId }: { caseId: string }) {
  const [data, setData] = React.useState<CasePayload | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState('');
  const [caseType, setCaseType] = React.useState('');
  const [status, setStatus] = React.useState<PortfolioStatus>('draft');

  const [sections, setSections] = React.useState<Record<string, string>>({});
  const [reflections, setReflections] = React.useState<Record<string, string>>({});

  const [signoffComment, setSignoffComment] = React.useState('');

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/portfolio/cases/${caseId}`, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json?.error ?? 'Failed to load case');
      setLoading(false);
      return;
    }
    setData(json as CasePayload);
    setTitle((json as CasePayload).case.title);
    setCaseType((json as CasePayload).case.case_type ?? '');
    setStatus((json as CasePayload).case.status);

    const s: Record<string, string> = {};
    for (const e of (json as CasePayload).entries ?? []) s[e.section_key] = asTextContent(e.content);
    setSections(s);
    const r: Record<string, string> = {};
    for (const rr of (json as CasePayload).reflections ?? []) r[rr.prompt_key] = rr.response ?? '';
    setReflections(r);
    setLoading(false);
  }

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  async function patchCase(
    patch: Partial<{ title: string; caseType: string | null; status: PortfolioStatus }>,
  ) {
    setSaving('case');
    setError(null);
    const res = await fetch(`/api/portfolio/cases/${caseId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to update case');
      return false;
    }
    await load();
    return true;
  }

  async function saveSection(sectionKey: string) {
    setSaving(sectionKey);
    setError(null);
    const res = await fetch('/api/portfolio/entries', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ caseId, sectionKey, content: { text: sections[sectionKey] ?? '' } }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) setError(json?.error ?? 'Failed to save section');
  }

  async function saveReflection(promptKey: string) {
    setSaving(promptKey);
    setError(null);
    const res = await fetch('/api/portfolio/reflections', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ caseId, promptKey, response: reflections[promptKey] ?? '' }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) setError(json?.error ?? 'Failed to save reflection');
  }

  async function supervisorSignoff() {
    setSaving('signoff');
    setError(null);
    const res = await fetch('/api/portfolio/signoff', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ caseId, comments: signoffComment.trim() ? signoffComment.trim() : undefined }),
    });
    const json = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) {
      setError(json?.error ?? 'Failed to sign off (check supervisor role/link).');
      return;
    }
    setSignoffComment('');
    await load();
  }

  if (loading) return <div className="text-muted-foreground text-sm">Loading case…</div>;
  if (error && !data) return <div className="text-destructive text-sm">{error}</div>;
  if (!data) return <div className="text-muted-foreground text-sm">Case not found.</div>;

  const canEdit = data.canEdit;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio case</h1>
          <p className="text-muted-foreground text-sm">
            Status: <span className="font-medium">{status}</span> · Updated:{' '}
            {new Date(data.case.updated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/api/portfolio/export?caseId=${caseId}`}>
            <Button variant="outline">Export</Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case details</CardTitle>
          <CardDescription>
            {canEdit ? 'Update the title/type and manage sharing.' : 'Read-only view (shared with you).'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                disabled={!canEdit}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="caseType">Case type</Label>
              <Input
                id="caseType"
                value={caseType}
                disabled={!canEdit}
                onChange={(e) => setCaseType(e.target.value)}
              />
            </div>
          </div>

          {canEdit ? (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  patchCase({ title: title.trim(), caseType: caseType.trim() ? caseType.trim() : null })
                }
                disabled={saving === 'case'}
              >
                {saving === 'case' ? 'Saving…' : 'Save details'}
              </Button>
              <Button
                variant="outline"
                onClick={() => patchCase({ status: 'ready' })}
                disabled={saving === 'case'}
              >
                Mark ready
              </Button>
              <Button
                variant="outline"
                onClick={() => patchCase({ status: 'shared' })}
                disabled={saving === 'case'}
              >
                Share with supervisor
              </Button>
              <Button
                variant="outline"
                onClick={() => patchCase({ status: 'draft' })}
                disabled={saving === 'case'}
              >
                Back to draft
              </Button>
            </div>
          ) : null}

          {error ? <p className="text-destructive text-sm">{error}</p> : null}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>Write in a non-identifying way. Don’t include personal data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {PORTFOLIO_SECTIONS.map((s) => (
              <div key={s.key} className="space-y-2">
                <div className="space-y-1">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-muted-foreground text-xs">{s.help}</div>
                </div>
                <Textarea
                  value={sections[s.key] ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => setSections((prev) => ({ ...prev, [s.key]: e.target.value }))}
                  rows={5}
                />
                {canEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveSection(s.key)}
                    disabled={saving === s.key}
                  >
                    {saving === s.key ? 'Saving…' : 'Save'}
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reflections</CardTitle>
            <CardDescription>Short reflections to support portfolio evidence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {PORTFOLIO_REFLECTIONS.map((r) => (
              <div key={r.key} className="space-y-2">
                <div className="font-medium">{r.prompt}</div>
                <Textarea
                  value={reflections[r.key] ?? ''}
                  disabled={!canEdit}
                  onChange={(e) => setReflections((prev) => ({ ...prev, [r.key]: e.target.value }))}
                  rows={4}
                />
                {canEdit ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveReflection(r.key)}
                    disabled={saving === r.key}
                  >
                    {saving === r.key ? 'Saving…' : 'Save'}
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supervisor sign-offs</CardTitle>
          <CardDescription>
            If a supervisor link exists, supervisors can sign off shared cases. (Admin linking UI comes
            later.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.signoffs ?? []).length ? (
            <ul className="space-y-2 text-sm">
              {data.signoffs.map((s) => (
                <li key={s.id} className="rounded-md border p-3">
                  <div className="font-medium">Signed: {new Date(s.signed_at).toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">Supervisor: {s.supervisor_user_id}</div>
                  {s.comments ? <div className="mt-2 text-sm">{s.comments}</div> : null}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-sm">No sign-offs yet.</div>
          )}

          {!canEdit ? (
            <div className="space-y-2">
              <Label htmlFor="signoffComment">Add sign-off comment (optional)</Label>
              <Textarea
                id="signoffComment"
                value={signoffComment}
                onChange={(e) => setSignoffComment(e.target.value)}
                rows={3}
              />
              <Button onClick={supervisorSignoff} disabled={saving === 'signoff'}>
                {saving === 'signoff' ? 'Signing…' : 'Sign off'}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-xs">
              Tip: after sharing, your supervisor can view it from{' '}
              <Link className="underline underline-offset-4" href="/portfolio/shared">
                Shared with me
              </Link>{' '}
              (if they are linked).
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
