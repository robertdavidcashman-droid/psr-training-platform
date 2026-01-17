import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function PracticeStartPage() {
  await requireAuth();

  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = host ? `${proto}://${host}` : '';

  const res = await fetch(`${origin}/api/practice/generate`, {
    method: 'POST',
    cache: 'no-store',
  }).catch(() => null);

  if (!res || !res.ok) {
    redirect('/practice?error=generate_failed');
  }

  const data = (await res.json()) as { quizId: string; attemptId: string };
  redirect(`/quiz/${data.quizId}?attemptId=${data.attemptId}`);
}
