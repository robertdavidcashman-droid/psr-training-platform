import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ReviewStartPage() {
  await requireAuth();

  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') || 'http';
  const origin = host ? `${proto}://${host}` : '';

  const res = await fetch(`${origin}/api/review/generate`, {
    method: 'POST',
    cache: 'no-store',
  }).catch(() => null);

  if (!res || !res.ok) {
    redirect('/review?error=nothing_due');
  }

  const data = (await res.json()) as { quizId: string; attemptId: string };
  redirect(`/quiz/${data.quizId}?attemptId=${data.attemptId}`);
}
