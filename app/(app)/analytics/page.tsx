"use client";

import { useMemo, useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import {
  getWeakCriteria,
  getImprovingCriteria,
  getRecommendations,
  getExamReadiness,
  getAllCriterionAnalytics,
} from "@/lib/analytics";
import { getProgress, type UserProgress } from "@/lib/storage";
import Link from "next/link";

export default function AnalyticsPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const weakCriteria = useMemo(() => getWeakCriteria(10), []);
  const improvingCriteria = useMemo(() => getImprovingCriteria(), []);
  const recommendations = useMemo(() => getRecommendations(), []);
  const examReadiness = useMemo(() => getExamReadiness(), []);
  const allCriteria = useMemo(() => getAllCriterionAnalytics(), []);

  if (!progress) {
    return (
      <div>
        <PageHeader title="Analytics" description="Loading..." />
      </div>
    );
  }

  return (
    <div data-testid="analytics-page">
      <PageHeader
        title="Study Analytics"
        description="Detailed insights into your learning progress and recommendations"
      />

      {/* Exam Readiness */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exam Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-4xl font-bold mb-2">{examReadiness.score}%</div>
              <div className="text-base text-muted-foreground">Readiness Score</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {examReadiness.readyCriteria}/{examReadiness.totalCriteria}
              </div>
              <div className="text-base text-muted-foreground">Criteria Ready (≥80%)</div>
            </div>
            <div>
              {examReadiness.ready ? (
                <Badge variant="success" className="gap-1 text-lg px-4 py-2">
                  <CheckCircle className="h-4 w-4" />
                  Ready for Exam
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1 text-lg px-4 py-2">
                  <AlertTriangle className="h-4 w-4" />
                  Keep Practicing
                </Badge>
              )}
            </div>
          </div>
          <Progress value={examReadiness.score} className="mt-4" variant={examReadiness.ready ? "success" : "warning"} />
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <Alert
                  key={rec.criterionId}
                  variant={rec.type === "focus" ? "warning" : rec.type === "ready" ? "success" : "default"}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <AlertTitle className="capitalize">{rec.type}</AlertTitle>
                      <AlertDescription>{rec.message}</AlertDescription>
                      <div className="mt-2">
                        <Progress value={rec.mastery} className="w-48" />
                        <span className="text-sm text-muted-foreground ml-2">{rec.mastery}% mastery</span>
                      </div>
                    </div>
                    <Link href="/practice">
                      <Button size="sm" variant="outline" className="gap-1">
                        Practice <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </Alert>
              ))
            ) : (
              <p className="text-muted-foreground">Start practicing to get personalized recommendations!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weak Areas */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Areas Needing Focus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weakCriteria.length > 0 ? (
              weakCriteria.map((criterion) => (
                <div key={criterion.criterionId} className="border-l-2 border-warning pl-4 py-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{criterion.label}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={criterion.mastery} className="w-48" variant="warning" />
                        <span className="text-sm text-muted-foreground">
                          {criterion.mastery}% ({criterion.correctAnswers}/{criterion.questionsAnswered})
                        </span>
                      </div>
                    </div>
                    <Badge variant="warning" className="gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -{criterion.gap}%
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No weak areas identified. Great work!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Improving Areas */}
      {improvingCriteria.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Areas You're Improving In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {improvingCriteria.map((criterion) => (
                <div key={criterion.criterionId} className="border-l-2 border-success pl-4 py-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium">{criterion.label}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={criterion.mastery} className="w-48" variant="success" />
                        <span className="text-sm text-muted-foreground">
                          {criterion.mastery}% ({criterion.correctAnswers}/{criterion.questionsAnswered})
                        </span>
                      </div>
                    </div>
                    <Badge variant="success" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Improving
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Criterion Performance Table */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Criteria Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Criterion</th>
                  <th className="text-right p-2">Mastery</th>
                  <th className="text-right p-2">Questions</th>
                  <th className="text-right p-2">Correct</th>
                  <th className="text-center p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {allCriteria.map((criterion) => (
                  <tr key={criterion.criterionId} className="border-b">
                    <td className="p-2 font-medium">{criterion.label}</td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={criterion.mastery} className="w-24" />
                        <span className="w-12 text-right">{criterion.mastery}%</span>
                      </div>
                    </td>
                    <td className="p-2 text-right">{criterion.questionsAnswered}</td>
                    <td className="p-2 text-right">{criterion.correctAnswers}</td>
                    <td className="p-2 text-center">
                      {criterion.mastery >= 80 ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Ready
                        </Badge>
                      ) : criterion.mastery >= 60 ? (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Partial
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Needs Work
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center">
        <Link href="/practice">
          <Button size="lg" className="gap-2">
            Start Practice
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/coverage">
          <Button size="lg" variant="outline" className="gap-2">
            View Coverage Matrix
          </Button>
        </Link>
      </div>
    </div>
  );
}
