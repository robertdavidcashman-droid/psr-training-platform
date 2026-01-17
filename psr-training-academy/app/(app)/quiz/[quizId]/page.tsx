import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { QuizRunner } from '@/components/quiz/QuizRunner';

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: Promise<{ quizId: string }>;
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>;
}) {
  await requireAuth();
  const { quizId } = await params;
  const sp = await Promise.resolve(searchParams);
  const attemptId = typeof sp?.attemptId === 'string' ? sp.attemptId : undefined;

  if (!attemptId) redirect('/practice?error=missing_attempt');

  return <QuizRunner quizId={quizId} attemptId={attemptId} />;
}
