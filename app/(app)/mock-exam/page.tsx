"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ChevronRight,
  Timer,
} from "lucide-react";
import { updateTopicProgress, savePracticeSession, generateId } from "@/lib/storage";
import { shuffleArray } from "@/lib/utils";
import questionsData from "@/content/questions.json";
import topicsData from "@/content/topics.json";
import type { Question } from "@/lib/schemas";

type ExamMode = "short" | "standard" | "full";
type ExamState = "setup" | "active" | "complete";

const EXAM_CONFIG: Record<ExamMode, { questions: number; minutes: number }> = {
  short: { questions: 5, minutes: 5 },
  standard: { questions: 20, minutes: 30 },
  full: { questions: 40, minutes: 60 },
};

export default function MockExamPage() {
  const [mode, setMode] = useState<ExamMode>("standard");
  const [state, setState] = useState<ExamState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const topicMap = Object.fromEntries(topicsData.topics.map((t) => [t.id, t]));
  const currentQuestion = questions[currentIndex];

  const startExam = useCallback((selectedMode: ExamMode) => {
    const config = EXAM_CONFIG[selectedMode];
    const shuffled = shuffleArray(questionsData.questions as Question[]);
    const selected = shuffled.slice(0, config.questions);

    setQuestions(selected);
    setMode(selectedMode);
    setCurrentIndex(0);
    setAnswers({});
    setTimeRemaining(config.minutes * 60);
    setState("active");
  }, []);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate results
    let correct = 0;
    questions.forEach((q, idx) => {
      const selectedId = answers[idx];
      const isCorrect = q.options?.find((o) => o.id === selectedId)?.isCorrect;
      if (isCorrect) {
        correct++;
        updateTopicProgress(q.topicId, true);
      } else if (selectedId) {
        updateTopicProgress(q.topicId, false);
      }
    });

    savePracticeSession({
      id: generateId(),
      date: new Date().toISOString(),
      mode: "mock",
      questionsAnswered: questions.length,
      correctAnswers: correct,
      topics: [...new Set(questions.map((q) => q.topicId))],
      duration: EXAM_CONFIG[mode].minutes * 60 - timeRemaining,
    });

    setState("complete");
  }, [questions, answers, mode, timeRemaining]);

  // Timer
  useEffect(() => {
    if (state !== "active") return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state, finishExam]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionId }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      const selectedId = answers[idx];
      if (q.options?.find((o) => o.id === selectedId)?.isCorrect) correct++;
    });
    return { correct, total: questions.length, percent: Math.round((correct / questions.length) * 100) };
  };

  const getTopicBreakdown = () => {
    const breakdown: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, idx) => {
      if (!breakdown[q.topicId]) breakdown[q.topicId] = { correct: 0, total: 0 };
      breakdown[q.topicId].total++;
      const selectedId = answers[idx];
      if (q.options?.find((o) => o.id === selectedId)?.isCorrect) {
        breakdown[q.topicId].correct++;
      }
    });
    return breakdown;
  };

  if (state === "setup") {
    return (
      <div data-testid="mock-exam-page">
        <PageHeader
          title="Mock Exam"
          description="Test yourself under timed exam conditions."
        />

        <div className="grid gap-4 md:grid-cols-3 max-w-4xl">
          {(["short", "standard", "full"] as ExamMode[]).map((m) => (
            <Card
              key={m}
              className="cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => startExam(m)}
              data-testid={`exam-mode-${m}`}
            >
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold capitalize text-lg mb-2">{m} Exam</h3>
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>{EXAM_CONFIG[m].questions} questions</p>
                  <p>{EXAM_CONFIG[m].minutes} minutes</p>
                </div>
                <Button className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="mt-6 max-w-4xl" variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Exam Conditions</AlertTitle>
          <AlertDescription>
            Once started, the timer cannot be paused. You can navigate between questions
            freely. Your exam will auto-submit when time expires.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (state === "active" && currentQuestion) {
    const answered = Object.keys(answers).length;

    return (
      <div data-testid="mock-exam-active">
        {/* Timer Bar */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur -mx-4 px-4 py-3 mb-6 border-b lg:-mx-6 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining < 60 ? "destructive" : "secondary"} className="gap-1">
                <Timer className="h-3 w-3" />
                {formatTime(timeRemaining)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {answered}/{questions.length} answered
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={finishExam} data-testid="finish-exam-btn">
              Finish Exam
            </Button>
          </div>
          <Progress
            value={(answered / questions.length) * 100}
            className="mt-2"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Question Navigator */}
          <div className="lg:col-span-1 order-2 lg:order-1 relative z-10">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-[16px]">Questions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToQuestion(idx)}
                      className={`h-10 w-10 rounded-xl text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        idx === currentIndex
                          ? "bg-primary text-primary-foreground"
                          : answers[idx]
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                      data-testid={`nav-q-${idx}`}
                      aria-label={`Go to question ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">
                    Question {currentIndex + 1} of {questions.length}
                  </Badge>
                  <Badge variant="secondary">
                    {topicMap[currentQuestion.topicId]?.name}
                  </Badge>
                </div>
                <CardTitle className="text-xl" data-testid="exam-question-text">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        answers[currentIndex] === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      data-testid={`exam-option-${option.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-full border-2 ${
                            answers[currentIndex] === option.id
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        />
                        <span>{option.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                    data-testid="exam-prev-btn"
                  >
                    Previous
                  </Button>
                  {currentIndex < questions.length - 1 ? (
                    <Button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="gap-1"
                      data-testid="exam-next-btn"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={finishExam} data-testid="submit-exam-btn">
                      Submit Exam
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (state === "complete") {
    const score = getScore();
    const breakdown = getTopicBreakdown();
    const passed = score.percent >= 70;

    return (
      <div data-testid="mock-exam-complete">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div
              className={`h-24 w-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                passed ? "bg-success/20" : "bg-destructive/20"
              }`}
            >
              {passed ? (
                <CheckCircle className="h-12 w-12 text-success" />
              ) : (
                <XCircle className="h-12 w-12 text-destructive" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {passed ? "Congratulations!" : "Keep Practicing"}
            </h1>
            <p className="text-muted-foreground">
              You scored {score.correct} out of {score.total} ({score.percent}%)
            </p>
            <Badge variant={passed ? "success" : "destructive"} className="mt-2">
              {passed ? "PASSED" : "NEEDS IMPROVEMENT"}
            </Badge>
          </div>

          {/* Score Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div className="text-3xl font-bold text-primary">{score.percent}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{score.correct}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{score.total - score.correct}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
              <Progress value={score.percent} variant={passed ? "success" : "warning"} />
            </CardContent>
          </Card>

          {/* Topic Breakdown */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Topic Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(breakdown).map(([topicId, data]) => {
                  const percent = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={topicId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{topicMap[topicId]?.name || topicId}</span>
                        <span>
                          {data.correct}/{data.total} ({percent}%)
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        variant={percent >= 70 ? "success" : percent >= 50 ? "warning" : "default"}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setState("setup")} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              New Exam
            </Button>
            <Button onClick={() => startExam(mode)} className="gap-2">
              <Play className="h-4 w-4" />
              Retry Same Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
