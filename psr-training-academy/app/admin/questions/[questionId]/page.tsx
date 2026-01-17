import { QuestionEditor } from '@/components/admin/questions/QuestionEditor';

export default async function AdminQuestionEditPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = await params;
  return <QuestionEditor questionId={questionId} />;
}
