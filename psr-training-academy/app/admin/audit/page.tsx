import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AuditEvent = {
  id: string;
  actor_user_id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  metadata: unknown;
  created_at: string;
};

export default async function AdminAuditPage() {
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = host ? `${proto}://${host}` : '';

  const res = await fetch(`${origin}/api/admin/audit`, { cache: 'no-store' });
  const json = (await res.json().catch(() => ({}))) as { events?: AuditEvent[]; error?: string };
  const events = json.events ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Audit</h1>
        <p className="text-muted-foreground">Admin mutations are recorded here (latest 200).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent events</CardTitle>
          <CardDescription>Who did what, and when.</CardDescription>
        </CardHeader>
        <CardContent>
          {!res.ok ? (
            <p className="text-destructive text-sm">{json.error ?? 'Failed to load audit events'}</p>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-xs">{new Date(e.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{e.actor_user_id}</TableCell>
                  <TableCell className="text-xs">{e.action}</TableCell>
                  <TableCell className="text-xs">{e.entity}</TableCell>
                  <TableCell className="text-xs">{e.entity_id ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {events.length === 0 ? (
            <p className="text-muted-foreground mt-4 text-sm">No audit events yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
