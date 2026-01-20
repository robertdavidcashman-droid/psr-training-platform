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
import topicsData from "@/content/topics.json";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mastery, setMastery] = useState(0);
  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);

  useEffect(() => {
    setProgress(getProgress());
    setMastery(calculateOverallMastery());
    setRecentSessions(getPracticeHistory().slice(0, 3));
  }, []);

  const weakestTopics = progress
    ? Object.values(progress.topics)
        .filter((t) => t.mastery < 70)
        .sort((a, b) => a.mastery - b.mastery)
        .slice(0, 3)
    : [];

  const topicMap = Object.fromEntries(
    topicsData.topics.map((t) => [t.id, t])
  );

  return (
    <div data-testid="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Continue your PSR accreditation training."
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Overall Mastery"
          value={`${mastery}%`}
          icon={Target}
          description="Across all topics"
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
        <StatCard
          title="Topics Practiced"
          value={Object.keys(progress?.topics || {}).length}
          icon={BookOpen}
          description={`of ${topicsData.topics.length} total`}
        />
      </div>

      {/* Main Actions */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Daily Practice CTA */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">Daily Practice</h2>
                <p className="text-muted-foreground">
                  Complete a quick practice session to maintain your streak and build mastery.
                </p>
              </div>
              <Link href="/practice">
                <Button size="lg" className="gap-2" data-testid="start-practice-btn">
                  <Play className="h-4 w-4" />
                  Start Practice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Mastery</span>
                  <span className="font-medium">{mastery}%</span>
                </div>
                <Progress value={mastery} variant="gradient" />
              </div>
              <div className="pt-2">
                <Link
                  href="/syllabus"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View all topics
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            {weakestTopics.length > 0 ? (
              <div className="space-y-4">
                {weakestTopics.map((topic) => (
                  <div key={topic.topicId} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {topicMap[topic.topicId]?.name || topic.topicId}
                      </p>
                      <Progress
                        value={topic.mastery}
                        className="mt-1"
                        variant={topic.mastery < 40 ? "warning" : "default"}
                      />
                    </div>
                    <Badge variant={topic.mastery < 40 ? "warning" : "secondary"}>
                      {topic.mastery}%
                    </Badge>
                  </div>
                ))}
                <Link href="/practice">
                  <Button variant="outline" className="w-full mt-2" data-testid="practice-weak-topics-btn">
                    Practice These Topics
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start practicing to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {session.mode} Practice
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {session.correctAnswers}/{session.questionsAnswered}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No practice sessions yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3 mt-8">
        <Link href="/mock-exam">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Mock Exam</h3>
                <p className="text-sm text-muted-foreground">
                  Timed exam simulation
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/incidents">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Critical Incidents</h3>
                <p className="text-sm text-muted-foreground">
                  Scenario-based training
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portfolio">
          <Card className="hover:shadow-card-hover transition-shadow cursor-pointer h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Portfolio Workbook</h3>
                <p className="text-sm text-muted-foreground">
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
