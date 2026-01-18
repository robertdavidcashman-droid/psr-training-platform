export const metadata = {
  title: 'Dashboard',
  description: 'Your learning dashboard with progress, stats, and quick actions.',
};

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProgressChartClient } from '@/components/charts/ProgressChartClient';
import { Award, Flame, Zap, Target, Briefcase, BookOpen, FileText, Brain, GraduationCap, ClipboardList, Bookmark, ArrowRight, Download } from 'lucide-react';

export default async function DashboardPage() {
  // Optional: get user if available, but don't require it
  const user = await getCurrentUser();
  const supabase = await createClient();

  // Get user progress stats
  const { data: progress } = await supabase
    .from('user_progress')
    .select('answered_correctly, question_id, timestamp')
    .eq('user_id', user?.id || '');

  // Get questions for category breakdown
  const { data: questions } = await supabase
    .from('questions')
    .select('id, category')
    .eq('status', 'approved');

  const questionMap = new Map(questions?.map(q => [q.id, q.category]) || []);
  
  // Calculate stats by category
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  
  progress?.forEach(p => {
    const category = questionMap.get(p.question_id) || 'Unknown';
    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, correct: 0 };
    }
    categoryStats[category].total++;
    if (p.answered_correctly) {
      categoryStats[category].correct++;
    }
  });

  const totalAnswered = progress?.length || 0;
  const correctAnswers = progress?.filter((p) => p.answered_correctly).length || 0;

  // Get recent activity
  const recentProgress = progress?.slice(-5).reverse() || [];

  // Get user gamification data
  let userLevel = 1;
  let userXP = 0;
  let currentStreak = 0;
  
  try {
    const { data: userData, error } = await supabase
      .from('users')
      .select('level, xp, current_streak, longest_streak')
      .eq('id', user?.id || '')
      .single();

    if (!error && userData) {
      userLevel = userData.level ?? 1;
      userXP = userData.xp ?? 0;
      currentStreak = userData.current_streak ?? 0;
    }
  } catch (error) {
    console.log('Gamification columns not found, using defaults');
  }
  
  // Calculate XP needed for next level
  const getXPForLevel = (level: number) => {
    if (level === 1) return 1000;
    if (level === 2) return 2500;
    if (level === 3) return 5000;
    if (level === 4) return 10000;
    return 10000 + ((level - 5) * 5000);
  };
  const xpForNextLevel = getXPForLevel(userLevel);
  const xpProgress = userLevel === 1 ? userXP : userXP - getXPForLevel(userLevel - 1);
  const xpNeeded = xpForNextLevel - (userLevel === 1 ? 0 : getXPForLevel(userLevel - 1));
  const xpProgressPercent = xpNeeded > 0 
    ? Math.min(100, (xpProgress / xpNeeded) * 100)
    : 0;

  // Get module progress
  let modulesCompleted = 0;
  let totalModules = 4;
  
  try {
    const { data: moduleProgress } = await supabase
      .from('module_progress')
      .select('module_id, completed')
      .eq('user_id', user?.id || '');

    const { data: allModules } = await supabase
      .from('content_modules')
      .select('id');

    modulesCompleted = moduleProgress?.filter(m => m.completed).length || 0;
    totalModules = allModules?.length || 4;
  } catch (error) {
    console.log('Module progress table not found, using defaults');
  }

  // Get recommended content (weakest category)
  const weakestCategory = Object.entries(categoryStats).sort((a, b) => {
    const accA = a[1].total > 0 ? (a[1].correct / a[1].total) : 1;
    const accB = b[1].total > 0 ? (b[1].correct / b[1].total) : 1;
    return accA - accB;
  })[0]?.[0] || null;

  // Get user's full name from users table
  let userName = user?.email?.split('@')[0] || 'there';
  if (user?.id) {
    const { data: userData } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    if (userData?.full_name) {
      userName = userData.full_name.split(' ')[0];
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">Ready to continue your accreditation journey?</p>
        </div>
        <Link href="/practice">
          <Button variant="navy" size="lg" className="group">
            Continue Training
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards - Horizontal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Level</p>
                <p className="text-2xl font-bold text-foreground">{userLevel}</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{userXP} / {xpForNextLevel} XP</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Streak</p>
                <p className="text-2xl font-bold text-foreground">{currentStreak} <span className="text-sm font-normal text-muted-foreground">{currentStreak === 1 ? 'day' : 'days'}</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modules</p>
                <p className="text-2xl font-bold text-foreground">{modulesCompleted}<span className="text-sm font-normal text-muted-foreground">/{totalModules}</span></p>
              </div>
            </div>
            <div className="mt-3 w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(modulesCompleted / totalModules) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Integration Bar */}
      <Card className="bg-accent border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Advance Your Career</h3>
                <p className="text-sm text-navy/70">
                  Looking for a PSR job? Check our job board at policestationagent.com
                </p>
              </div>
            </div>
            <a
              href="https://policestationagent.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="navy" className="whitespace-nowrap">
                View Opportunities
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Recommended for You */}
      <div>
        <h2 className="section-divider text-xl font-bold text-foreground">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakestCategory && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="icon-box-green shrink-0">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{weakestCategory}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your accuracy in {weakestCategory.toLowerCase()} could use a boost. Try a quick 5-question drill.
                    </p>
                    <Link href={`/practice?category=${encodeURIComponent(weakestCategory)}&limit=5`}>
                      <Button variant="navy" size="sm">Start Drill</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="icon-box-yellow shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">Your Certificate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download your completion certificate to prove your readiness.
                  </p>
                  <Link href="/certificates">
                    <Button variant="navy" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress Over Time</CardTitle>
            <CardDescription>Your accuracy trend over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressChartClient />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Your accuracy across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(categoryStats).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No category data yet. Start practicing to see your performance!</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, stats]) => {
                  const categoryAccuracy = stats.total > 0 
                    ? ((stats.correct / stats.total) * 100).toFixed(0) 
                    : 0;
                  return (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold">{category}</span>
                        <span className="text-muted-foreground">{categoryAccuracy}% ({stats.correct}/{stats.total})</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${categoryAccuracy}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start practicing or learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/practice" className="block">
              <Button variant="navy" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-3" />
                Practice Questions
              </Button>
            </Link>
            <Link href="/modules" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-3" />
                Learning Modules
              </Button>
            </Link>
            <Link href="/scenarios" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-3" />
                Scenario Simulation
              </Button>
            </Link>
            <Link href="/flashcards" className="block">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="w-4 h-4 mr-3" />
                Flashcards
              </Button>
            </Link>
            <Link href="/bookmarks" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Bookmark className="w-4 h-4 mr-3" />
                Bookmarks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProgress.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No recent activity. Start practicing to see your history!</p>
            ) : (
              <div className="space-y-3">
                {recentProgress.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">
                      {new Date(p.timestamp).toLocaleDateString()} at {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-sm font-semibold ${
                      p.answered_correctly ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {p.answered_correctly ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
