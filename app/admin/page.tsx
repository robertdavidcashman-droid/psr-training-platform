import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get statistics
  const [questionsResult, usersResult, progressResult, sessionsResult, activityResult] = await Promise.all([
    supabase.from('questions').select('id, status', { count: 'exact' }),
    supabase.from('users').select('id', { count: 'exact' }),
    supabase.from('user_progress').select('id', { count: 'exact' }),
    supabase.from('user_sessions').select('id', { count: 'exact' }),
    supabase.from('user_activity_log').select('id', { count: 'exact', head: true }),
  ]);

  const totalQuestions = questionsResult.count || 0;
  const questionsData = questionsResult.data || [];
  const pendingQuestions = questionsData.filter(q => q.status === 'pending').length;
  const approvedQuestions = questionsData.filter(q => q.status === 'approved').length;
  const totalUsers = usersResult.count || 0;
  const totalProgress = progressResult.count || 0;
  const totalSessions = sessionsResult.count || 0;
  const totalActivities = activityResult.count || 0;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-semibold text-foreground mb-3">Admin Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage questions, users, and platform content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg font-semibold">Total Questions</CardTitle>
              <span className="text-3xl">❓</span>
            </div>
            <CardDescription className="text-base">All questions in database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-2">{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">
              {approvedQuestions} approved, {pendingQuestions} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
              <span className="text-3xl">👥</span>
            </div>
            <CardDescription className="text-base">Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg font-semibold">Progress Entries</CardTitle>
              <span className="text-3xl">📊</span>
            </div>
            <CardDescription className="text-base">User progress records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg font-semibold">Total Sessions</CardTitle>
              <span className="text-3xl">🔐</span>
            </div>
            <CardDescription className="text-base">User login sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{totalSessions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/questions">
              <Button className="w-full justify-start" size="lg">
                Manage Questions
              </Button>
            </Link>
            {pendingQuestions > 0 && (
              <Link href="/admin/questions?tab=pending">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  Review Pending Questions ({pendingQuestions})
                </Button>
              </Link>
            )}
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start" size="lg">
                View Users
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start" size="lg">
                View Analytics
              </Button>
            </Link>
            <Link href="/admin/activity">
              <Button variant="outline" className="w-full justify-start" size="lg">
                View Activity ({totalActivities})
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold text-foreground mb-2">{totalActivities}</div>
            <p className="text-muted-foreground mb-4">
              Total user activities logged across the platform
            </p>
            <Link href="/admin/activity">
              <Button className="w-full justify-start" size="lg">
                View All Activity
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
