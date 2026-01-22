"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Target,
  Flame,
  BookOpen,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  getProgress,
  calculateOverallMastery,
  getPracticeHistory,
  type UserProgress,
  type PracticeSession,
} from "@/lib/storage";
import { getWeakCriteria, getExamReadiness } from "@/lib/analytics";
import topicsData from "@/content/topics.json";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mastery, setMastery] = useState(0);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    setProgress(getProgress());
    setMastery(calculateOverallMastery());
    setRecentSessions(getPracticeHistory().slice(0, 3));
  }, []);

  const weakestTopics = useMemo(() => {
    return progress
      ? Object.values(progress.topics)
          .filter((t) => t.mastery < 70)
          .sort((a, b) => a.mastery - b.mastery)
          .slice(0, 3)
      : [];
  }, [progress]);

  const weakCriteria = useMemo(() => getWeakCriteria(3), []);
  const examReadiness = useMemo(() => getExamReadiness(), []);

  const topicMap = useMemo(
    () => Object.fromEntries(topicsData.topics.map((t) => [t.id, t])),
    []
  );

  return (
    <div data-testid="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Continue your PSR accreditation training."
      />

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard
          title="Overall Mastery"
          value={`${mastery}%`}
          icon={Target}
          description="Across all topics"
        />
        <StatCard
          title="Exam Readiness"
          value={`${examReadiness.score}%`}
          icon={TrendingUp}
          description={`${examReadiness.readyCriteria}/${examReadiness.totalCriteria} criteria ready`}
        />
        <StatCard
          title="Current Streak"
          value={progress?.currentStreak || 0}
          icon={Flame}
          description="Days in a row"
        />
        <StatCard
          title="Total XP"
          value={progress?.totalXp || 0}
          icon={Zap}
          description={`Level ${progress?.level || 1}`}
        />
      </div>

      {/* Main Actions */}
      <div className="grid gap-8 lg:grid-cols-3 mb-10">
        {/* Daily Practice CTA */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Daily Practice</h2>
                <p className="text-lg text-muted-foreground">
                  Complete a quick practice session to maintain your streak and build mastery.
                </p>
              </div>
              <Link href="/practice">
                <Button size="lg" className="gap-2 text-lg px-6 py-3 h-auto" data-testid="start-practice-btn">
                  <Play className="h-5 w-5" />
                  Start Practice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-base mb-2">
                  <span>Overall Mastery</span>
                  <span className="font-medium">{mastery}%</span>
                </div>
                <Progress value={mastery} variant="gradient" />
              </div>
              <div className="pt-3">
                <Link
                  href="/syllabus"
                  className="text-base text-primary hover:underline flex items-center gap-1"
                >
                  View all topics
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Areas for Improvement</CardTitle>
              <Link href="/analytics">
                <Button variant="ghost" size="sm" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {weakCriteria.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Top criteria needing focus:
                </p>
                {weakCriteria.map((criterion) => (
                  <div key={criterion.criterionId} className="border-l-2 border-warning pl-3 py-2">
                    <p className="text-base font-medium">{criterion.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress
                        value={criterion.mastery}
                        className="flex-1"
                        variant="warning"
                      />
                      <Badge variant="warning" className="text-xs">
                        {criterion.mastery}%
                      </Badge>
                    </div>
                  </div>
                ))}
                <Link href="/practice">
                  <Button variant="outline" className="w-full mt-3 text-base" data-testid="practice-weak-topics-btn">
                    Practice These Areas
                  </Button>
                </Link>
              </div>
            ) : weakestTopics.length > 0 ? (
              <div className="space-y-5">
                {weakestTopics.map((topic) => (
                  <div key={topic.topicId} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium truncate">
                        {topicMap[topic.topicId]?.name || topic.topicId}
                      </p>
                      <Progress
                        value={topic.mastery}
                        className="mt-2"
                        variant={topic.mastery < 40 ? "warning" : "default"}
                      />
                    </div>
                    <Badge variant={topic.mastery < 40 ? "warning" : "secondary"}>
                      {topic.mastery}%
                    </Badge>
                  </div>
                ))}
                <Link href="/practice">
                  <Button variant="outline" className="w-full mt-3 text-base" data-testid="practice-weak-topics-btn">
                    Practice These Topics
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-base">Start practicing to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-medium capitalize">
                          {session.mode} Practice
                        </p>
                        <p className="text-base text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-base">
                      {session.correctAnswers}/{session.questionsAnswered}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-base">No practice sessions yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-4 mt-10">
        <Link href="/analytics">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Analytics</h3>
                <p className="text-base text-muted-foreground">
                  Detailed insights
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mock-exam">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Mock Exam</h3>
                <p className="text-base text-muted-foreground">
                  Timed exam simulation
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/incidents">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Critical Incidents</h3>
                <p className="text-base text-muted-foreground">
                  Scenario-based training
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portfolio">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Portfolio Workbook</h3>
                <p className="text-base text-muted-foreground">
                  Case reflection templates
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
