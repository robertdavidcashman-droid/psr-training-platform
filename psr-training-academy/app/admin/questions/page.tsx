import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionCreateForm } from '@/components/admin/questions/QuestionCreateForm';
import { Button } from '@/components/ui/button';

export default async function AdminQuestionsPage() {
  const supabase = await createClient();
  const { data: questions } = await supabase
    .from('questions')
    .select('id,type,prompt,difficulty,status,updated_at')
    .order('updated_at', { ascending: false })
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Questions</h1>
        <p className="text-muted-foreground">Create and publish questions for practice sessions.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuestionCreateForm />

        <Card>
          <CardHeader>
            <CardTitle>All questions</CardTitle>
            <CardDescription>Latest first (max 200).</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diff</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {(questions ?? []).map((q) => (
                  <TableRow key={q.id}>
                    <TableCell className="text-xs">{q.type}</TableCell>
                    <TableCell className="text-xs">{q.status}</TableCell>
                    <TableCell className="text-xs">{q.difficulty}</TableCell>
                    <TableCell className="max-w-[420px] truncate">{q.prompt}</TableCell>
                    <TableCell>
                      <Link href={`/admin/questions/${q.id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {(questions ?? []).length === 0 ? (
              <p className="text-muted-foreground mt-4 text-sm">No questions yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
