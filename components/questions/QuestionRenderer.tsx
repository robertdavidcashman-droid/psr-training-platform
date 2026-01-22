"use client";

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Question } from "@/lib/schemas";

interface QuestionRendererProps {
  question: Question;
  selectedAnswer: string | string[] | null;
  showFeedback: boolean;
  onAnswerChange: (answer: string | string[]) => void;
  onSubmit?: () => void;
  userAnswer?: string; // For short_answer type
  onUserAnswerChange?: (answer: string) => void;
}

export function QuestionRenderer({
  question,
  selectedAnswer,
  showFeedback,
  onAnswerChange,
  onSubmit,
  userAnswer = "",
  onUserAnswerChange,
}: QuestionRendererProps) {
  // Single-select MCQ
  if (question.type === "mcq" || question.type === "best-answer") {
    return (
      <div className="space-y-3">
        {question.options?.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = question.correct === option.id;

          return (
            <button
              key={option.id}
              onClick={() => !showFeedback && onAnswerChange(option.id)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                showFeedback
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
                    showFeedback
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
                  {showFeedback && isCorrect && <CheckCircle className="h-4 w-4" />}
                  {showFeedback && isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                </div>
                <span className="min-w-0 flex-1 break-words">{option.text}</span>
              </div>
            </button>
          );
        })}
        {!showFeedback && onSubmit && (
          <Button className="w-full mt-6" onClick={onSubmit} disabled={!selectedAnswer}>
            Submit Answer
          </Button>
        )}
      </div>
    );
  }

  // Multi-select MCQ
  if (question.type === "mcq_multi") {
    const selected = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    const correctAnswers = question.correctAnswers || [];

    const handleToggle = (optionId: string) => {
      if (showFeedback) return;
      const newSelected = selected.includes(optionId)
        ? selected.filter((id) => id !== optionId)
        : [...selected, optionId];
      onAnswerChange(newSelected);
    };

    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground mb-4">
          Select all that apply:
        </p>
        {question.options?.map((option) => {
          const isSelected = selected.includes(option.id);
          const isCorrect = correctAnswers.includes(option.id);

          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              disabled={showFeedback}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                showFeedback
                  ? isCorrect
                    ? isSelected
                      ? "border-success bg-success/10"
                      : "border-success/50 bg-success/5"
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
                  className={`h-6 w-6 rounded border-2 flex items-center justify-center ${
                    showFeedback
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
                  {isSelected && (
                    <CheckCircle
                      className={`h-4 w-4 ${
                        showFeedback && !isCorrect ? "text-destructive-foreground" : ""
                      }`}
                    />
                  )}
                  {showFeedback && isCorrect && !isSelected && (
                    <AlertCircle className="h-4 w-4 text-success" />
                  )}
                </div>
                <span className="min-w-0 flex-1 break-words">{option.text}</span>
              </div>
            </button>
          );
        })}
        {!showFeedback && onSubmit && (
          <Button className="w-full mt-6" onClick={onSubmit} disabled={selected.length === 0}>
            Submit Answer
          </Button>
        )}
        {showFeedback && (
          <div className="mt-4 p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-2">Expected answers:</p>
            <div className="flex flex-wrap gap-2">
              {correctAnswers.map((ans) => (
                <Badge key={ans} variant={selected.includes(ans) ? "success" : "outline"}>
                  {ans}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Short answer
  if (question.type === "short_answer") {
    const markingPoints = question.expectedAnswerOutline || [];

    return (
      <div className="space-y-4">
        <Textarea
          value={userAnswer}
          onChange={(e) => onUserAnswerChange?.(e.target.value)}
          placeholder="Type your answer here..."
          disabled={showFeedback}
          className="min-h-32"
          data-testid="short-answer-input"
        />
        {!showFeedback && onSubmit && (
          <Button className="w-full" onClick={onSubmit} disabled={!userAnswer.trim()}>
            Submit Answer
          </Button>
        )}
        {showFeedback && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-3">Key marking points:</p>
              <ul className="space-y-2">
                {markingPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <p className="text-sm font-medium mb-2">Your answer:</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{userAnswer || "(No answer provided)"}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback for other types
  return (
    <div className="p-4 rounded-lg border border-warning bg-warning/10">
      <p className="text-sm text-warning-foreground">
        Question type "{question.type}" is not yet supported in this view.
      </p>
    </div>
  );
}
