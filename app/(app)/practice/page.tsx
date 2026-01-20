"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Info,
} from "lucide-react";
import {
  updateTopicProgress,
  savePracticeSession,
  generateId,
} from "@/lib/storage";
import { shuffleArray } from "@/lib/utils";
import { questions as seededQuestions } from "@/content/questions";
import topicsData from "@/content/topics.json";
import type { Question } from "@/lib/schemas";
import { getPracticeTips, getReferenceSuggestions, isPaceCustodyTopic } from "@/lib/references";
import { ReferencesPanel } from "@/components/ReferencesPanel";

type PracticeMode = "quick" | "standard" | "long";
type SessionState = "setup" | "active" | "review" | "complete";

const MODE_COUNTS: Record<PracticeMode, number> = {
  quick: 10,
  standard: 20,
  long: 40,
};

function PracticeLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<PracticeLoading />}>
      <PracticeContent />
    </Suspense>
  );
}

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicFilter = searchParams.get("topic");

  const [mode, setMode] = useState<PracticeMode>("quick");
  const [state, setState] = useState<SessionState>("setup");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; correct: boolean }>>({});
  const [startTime, setStartTime] = useState<number>(0);

  const topicMap = Object.fromEntries(topicsData.topics.map((t) => [t.id, t]));
  const currentQuestion = questions[currentIndex];

  const startSession = useCallback((selectedMode: PracticeMode) => {
    let availableQuestions = seededQuestions as Question[];
    
    if (topicFilter) {
      availableQuestions = availableQuestions.filter((q) => q.topicId === topicFilter);
    }

    const shuffled = shuffleArray(availableQuestions);
    const selected = shuffled.slice(0, Math.min(MODE_COUNTS[selectedMode], shuffled.length));
    
    setQuestions(selected);
    setMode(selectedMode);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers({});
    setStartTime(Date.now());
    setState("active");
  }, [topicFilter]);

  const handleAnswer = (optionId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(optionId);
  };

  const submitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    const isCorrect = currentQuestion.correct === selectedAnswer;

    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: { selected: selectedAnswer, correct: isCorrect },
    }));

    updateTopicProgress(currentQuestion.topicId, isCorrect);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    const correctCount = Object.values(answers).filter((a) => a.correct).length;
    const duration = Math.round((Date.now() - startTime) / 1000);
    const topicsUsed = [...new Set(questions.map((q) => q.topicId))];

    savePracticeSession({
      id: generateId(),
      date: new Date().toISOString(),
      mode,
      questionsAnswered: questions.length,
      correctAnswers: correctCount,
      topics: topicsUsed,
      duration,
    });

    setState("complete");
  };

  const correctCount = Object.values(answers).filter((a) => a.correct).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // Auto-scroll to feedback when shown
  useEffect(() => {
    if (showFeedback) {
      document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showFeedback]);

  if (state === "setup") {
    return (
      <div data-testid="practice-page">
        <PageHeader
          title="Practice Mode"
          description={
            topicFilter
              ? `Practicing: ${topicMap[topicFilter]?.name || topicFilter}`
              : "Choose a session length and start practicing."
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(["quick", "standard", "long"] as PracticeMode[]).map((m) => (
            <Card
              key={m}
              className="cursor-pointer hover:shadow-card-hover transition-shadow"
              onClick={() => startSession(m)}
              data-testid={`mode-${m}`}
            >
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {MODE_COUNTS[m]}
                </div>
                <h3 className="font-semibold capitalize mb-1">{m}</h3>
                <p className="text-sm text-muted-foreground">
                  {m === "quick" && "~5 minutes"}
                  {m === "standard" && "~15 minutes"}
                  {m === "long" && "~30 minutes"}
                </p>
                <Button className="mt-4 w-full gap-2" data-testid={`start-${m}-btn`}>
                  <Play className="h-4 w-4" />
                  Start
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert className="mt-6 max-w-4xl">
          <Info className="h-4 w-4" />
          <AlertTitle>Training Disclaimer</AlertTitle>
          <AlertDescription>
            This platform provides educational content for training purposes. It does not
            constitute legal advice. Always refer to current legislation and official guidance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (state === "active" && currentQuestion) {
    const effectiveReferences =
      currentQuestion.references?.length
        ? currentQuestion.references
        : isPaceCustodyTopic(currentQuestion.topicId)
          ? getReferenceSuggestions(currentQuestion.topicId)
          : [];

    const usedFallbackReferences =
      (!currentQuestion.references || currentQuestion.references.length === 0) &&
      effectiveReferences.length > 0;

    const correctOption = currentQuestion.options?.find(
      (o) => o.id === currentQuestion.correct
    );

    return (
      <div data-testid="practice-active">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{correctCount} correct</span>
          </div>
          <Progress value={(currentIndex / questions.length) * 100} />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{topicMap[currentQuestion.topicId]?.name}</Badge>
              <Badge variant="secondary" className="capitalize">
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-xl" data-testid="question-text">
              {currentQuestion.stem}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showResult = showFeedback;
                const isCorrect = currentQuestion.correct === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      showResult
                        ? isCorrect
                          ? "border-success bg-success/10"
                          : isSelected
                          ? "border-destructive bg-destructive/10"
                          : "border-border"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    data-testid={`option-${option.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                          showResult
                            ? isCorrect
                              ? "border-success bg-success text-success-foreground"
                              : isSelected
                              ? "border-destructive bg-destructive text-destructive-foreground"
                              : "border-border"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {showResult && isCorrect && <CheckCircle className="h-4 w-4" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                      </div>
                      <span className="min-w-0 flex-1 break-words">{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!showFeedback && (
              <Button
                className="w-full mt-6"
                disabled={!selectedAnswer}
                onClick={submitAnswer}
                data-testid="submit-answer-btn"
              >
                Submit Answer
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Feedback */}
        {showFeedback && (
          <Card className="mb-6" id="feedback-section" data-testid="feedback-section">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                {answers[currentIndex]?.correct ? (
                  <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold mb-1">
                    {answers[currentIndex]?.correct ? "Correct!" : "Incorrect"}
                  </h3>
                  {!answers[currentIndex]?.correct && currentQuestion.correct ? (
                    <div className="mb-2 text-[15px]" data-testid="correct-answer">
                      <span className="font-semibold">Correct answer:</span>{" "}
                      <span className="font-semibold">{currentQuestion.correct}</span>
                      {correctOption ? <span className="text-muted-foreground"> — {correctOption.text}</span> : null}
                    </div>
                  ) : null}
                  <p className="text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm mb-1">What to do in practice</p>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground" data-testid="practice-tips">
                        {(getPracticeTips(currentQuestion.topicId).length
                          ? getPracticeTips(currentQuestion.topicId)
                          : ["Record key decisions and reasons contemporaneously.", "Check and document any safeguarding issues early."]
                        ).map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 flex-shrink-0" />
                            <span className="min-w-0">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {usedFallbackReferences ? (
                    <Alert variant="warning">
                      <Info className="h-4 w-4" />
                      <AlertTitle>References fallback used</AlertTitle>
                      <AlertDescription>
                        This question did not include references, so we showed curated topic references instead. Items marked “Check” should be verified against the current Code/Act.
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <ReferencesPanel references={effectiveReferences} />
                </div>
              </div>

              <Button className="w-full mt-4 gap-2" onClick={nextQuestion} data-testid="next-question-btn">
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (state === "complete") {
    return (
      <div data-testid="practice-complete">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div
              className={`h-24 w-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                score >= 80
                  ? "bg-success/20"
                  : score >= 60
                  ? "bg-warning/20"
                  : "bg-destructive/20"
              }`}
            >
              {score >= 80 ? (
                <CheckCircle className="h-12 w-12 text-success" />
              ) : (
                <span className="text-3xl font-bold">{score}%</span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
            <p className="text-muted-foreground">
              You got {correctCount} out of {questions.length} questions correct.
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{score}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{correctCount}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((Date.now() - startTime) / 60000)}m
                  </div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setState("setup")} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              New Session
            </Button>
            <Button onClick={() => startSession(mode)} className="gap-2" data-testid="try-again-btn">
              <Play className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
