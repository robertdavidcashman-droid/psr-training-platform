'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Clock, FileText, Play, Home, RotateCcw, Trophy, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
  options: Record<string, string>;
  correct_answer: string[];
  explanation: string | null;
}

export default function MockExamPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [examSessionId, setExamSessionId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const EXAM_DURATION = 120;
  const QUESTION_COUNT = 50;

  useEffect(() => {
    if (started && !completed && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 60000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, completed, timeRemaining]);

  const startExam = async () => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('status', 'approved')
      .limit(QUESTION_COUNT);

    if (data) {
      const shuffled = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffled as Question[]);
      setTimeRemaining(EXAM_DURATION);
      setStarted(true);
      setAnswers({});

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: session } = await supabase
          .from('mock_exam_sessions')
          .insert({
            user_id: user.id,
            exam_name: 'Practice Mock Exam',
            total_questions: QUESTION_COUNT,
            time_limit_minutes: EXAM_DURATION,
            status: 'in_progress',
          })
          .select()
          .single();

        if (session) {
          setExamSessionId(session.id);
        }
      }
    }
  };

  const handleAnswerSelect = (questionId: string, answerKey: string, isMultiple: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (current.includes(answerKey)) {
        return { ...prev, [questionId]: current.filter((a) => a !== answerKey) };
      } else {
        return {
          ...prev,
          [questionId]: isMultiple ? [...current, answerKey] : [answerKey],
        };
      }
    });
  };

  const handleFinish = async () => {
    if (!examSessionId) return;

    // Letter to index mapping for answer normalization
    const letterToIdx: Record<string, string> = { 'A': '0', 'B': '1', 'C': '2', 'D': '3', 'a': '0', 'b': '1', 'c': '2', 'd': '3' };
    
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = (answers[q.id] || []).map(a => String(a));
      const normalizedCorrect = q.correct_answer.map(a => {
        const str = String(a).trim();
        return letterToIdx[str] || str;
      });
      const isCorrect =
        userAnswer.length === normalizedCorrect.length &&
        userAnswer.every((a) => normalizedCorrect.includes(a));
      if (isCorrect) correct++;
    });

    const percentage = (correct / questions.length) * 100;

    await supabase
      .from('mock_exam_sessions')
      .update({
        completed_at: new Date().toISOString(),
        answers,
        score: correct,
        percentage,
        status: 'completed',
      })
      .eq('id', examSessionId);

    setScore(correct);
    setCompleted(true);
    setStarted(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Start Screen
  if (!started && !completed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">Mock Exam</CardTitle>
                <CardDescription>Timed practice exam simulation</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-5 bg-muted/50 rounded-xl space-y-4">
              <h3 className="font-bold text-foreground">Exam Details</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <span><strong>{QUESTION_COUNT}</strong> multiple choice questions</span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <span><strong>{EXAM_DURATION}</strong> minutes time limit</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Once you start, the timer will begin. Make sure you have enough time to complete the exam.
              </p>
            </div>

            <Button onClick={startExam} variant="navy" size="lg" className="w-full">
              <Play className="w-5 h-5 mr-2" />
              Start Mock Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (completed) {
    const percentage = score !== null ? ((score / questions.length) * 100).toFixed(0) : 0;
    const passed = score !== null && (score / questions.length) >= 0.7;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center pb-0">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <Trophy className={`w-10 h-10 ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <CardTitle className="text-2xl">Exam Completed!</CardTitle>
            <CardDescription>{passed ? 'Congratulations! You passed.' : 'Keep practicing to improve your score.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center p-6 bg-muted/50 rounded-xl">
              <div className="text-5xl font-bold text-foreground mb-2">
                {score !== null ? `${score}/${questions.length}` : 'N/A'}
              </div>
              <div className={`text-2xl font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {percentage}%
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={() => router.push('/dashboard')} variant="outline" className="flex-1">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button onClick={() => {
                setCompleted(false);
                setScore(null);
                setExamSessionId(null);
                startExam();
              }} variant="navy" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam Screen
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mock Exam</h1>
          <p className="text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${
          timeRemaining < 30 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted'
        }`}>
          <Clock className={`w-5 h-5 ${timeRemaining < 30 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`} />
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time Remaining</div>
            <div className={`text-2xl font-bold ${timeRemaining < 30 ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-xl leading-relaxed">{currentQuestion?.question_text}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
              {currentQuestion?.category}
            </span>
            <span className="text-muted-foreground capitalize">{currentQuestion?.difficulty}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {Object.entries(currentQuestion?.options || {}).map(([key, value]) => {
              const isSelected = (answers[currentQuestion.id] || []).includes(key);
              // Handle both string values and object values
              let optionText: string;
              if (typeof value === 'string') {
                optionText = value;
              } else if (value && typeof value === 'object') {
                const objValue = value as Record<string, unknown>;
                optionText = (objValue.text as string) || (objValue.label as string) || JSON.stringify(value);
              } else {
                optionText = String(value);
              }
              return (
                <button
                  key={key}
                  onClick={() =>
                    handleAnswerSelect(
                      currentQuestion.id,
                      key,
                      currentQuestion.correct_answer.length > 1
                    )
                  }
                  className={`w-full text-left p-5 border-2 rounded-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-white dark:bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {key}
                    </span>
                    <span className="flex-1 font-medium text-foreground">{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              variant="outline"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              variant="outline"
              className="flex-1 gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
            {answeredCount >= questions.length * 0.5 && (
              <Button onClick={handleFinish} variant="navy" className="gap-2">
                Finish Exam
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Grid */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Progress</h3>
            <span className="text-sm text-muted-foreground">{answeredCount}/{questions.length} answered</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {questions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  idx === currentIndex
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : answers[q.id]
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
