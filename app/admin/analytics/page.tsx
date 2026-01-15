'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

interface UserSession {
  id: string;
  user_id: string;
  session_id: string;
  login_time: string;
  logout_time: string | null;
  ip_address: string | null;
  user_agent: string | null;
  users?: {
    email: string;
    full_name: string | null;
  };
}

interface UserProgress {
  user_id: string;
  total_answered: number;
  correct_answers: number;
  accuracy: number;
  users?: {
    email: string;
    full_name: string | null;
  };
}

export default function AdminAnalyticsPage() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [userStats, setUserStats] = useState<UserProgress[]>([]);
  const [activityCount, setActivityCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ user: 'all', timeRange: '30' });
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);

    // Load sessions
    let sessionsQuery = supabase
      .from('user_sessions')
      .select('*, users(email, full_name)')
      .order('login_time', { ascending: false })
      .limit(100);

    if (filter.timeRange !== 'all') {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(filter.timeRange));
      sessionsQuery = sessionsQuery.gte('login_time', daysAgo.toISOString());
    }

    const { data: sessionsData } = await sessionsQuery;

    // Load user progress stats
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('user_id, answered_correctly');

    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, full_name');

    const userMap = new Map(usersData?.map(u => [u.id, u]) || []);

    // Calculate user stats
    const statsMap = new Map<string, { total: number; correct: number }>();
    progressData?.forEach(p => {
      if (!statsMap.has(p.user_id)) {
        statsMap.set(p.user_id, { total: 0, correct: 0 });
      }
      const stats = statsMap.get(p.user_id)!;
      stats.total++;
      if (p.answered_correctly) {
        stats.correct++;
      }
    });

    const statsArray: UserProgress[] = Array.from(statsMap.entries()).map(([user_id, stats]) => ({
      user_id,
      total_answered: stats.total,
      correct_answers: stats.correct,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      users: userMap.get(user_id),
    })).sort((a, b) => b.total_answered - a.total_answered);

    setSessions(sessionsData as UserSession[] || []);
    setUserStats(statsArray);

    // Load activity count
    let activityQuery = supabase
      .from('user_activity_log')
      .select('id', { count: 'exact', head: true });

    if (filter.timeRange !== 'all') {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(filter.timeRange));
      activityQuery = activityQuery.gte('created_at', daysAgo.toISOString());
    }

    const { count } = await activityQuery;
    setActivityCount(count || 0);

    setLoading(false);
  };

  const getSessionDuration = (login: string, logout: string | null) => {
    if (!logout) return 'Active';
    const start = new Date(login);
    const end = new Date(logout);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m`;
    return `${diffMins}m`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold text-foreground mb-3">Analytics Dashboard</h1>
        <p className="text-lg text-muted-foreground">View user activity, sessions, and performance metrics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Time Range</Label>
              <Select
                value={filter.timeRange}
                onChange={(e) => setFilter({ ...filter, timeRange: e.target.value })}
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Sessions</CardTitle>
            <CardDescription className="text-base">User login sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Sessions</CardTitle>
            <CardDescription className="text-base">Sessions without logout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {sessions.filter(s => !s.logout_time).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Users</CardTitle>
            <CardDescription className="text-base">Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{userStats.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Total Activities</CardTitle>
            <CardDescription className="text-base">Logged user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{activityCount}</div>
            <Link href="/admin/activity" className="mt-4 inline-block">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                View All Activities
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User Performance</CardTitle>
          <CardDescription className="text-base">Question answering statistics by user</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-12 text-base text-muted-foreground">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Answered</TableHead>
                  <TableHead>Correct</TableHead>
                  <TableHead>Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map((stat) => (
                  <TableRow key={stat.user_id}>
                    <TableCell>{stat.users?.full_name || 'N/A'}</TableCell>
                    <TableCell>{stat.users?.email || 'N/A'}</TableCell>
                    <TableCell>{stat.total_answered}</TableCell>
                    <TableCell>{stat.correct_answers}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        stat.accuracy >= 80 ? 'text-green-600' :
                        stat.accuracy >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {stat.accuracy.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">User Sessions</CardTitle>
          <CardDescription className="text-base">Login/logout activity and IP addresses</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-12 text-base text-muted-foreground">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Logout Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.slice(0, 50).map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{(session.users as any)?.full_name || 'N/A'}</TableCell>
                      <TableCell>{(session.users as any)?.email || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(session.login_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {session.logout_time ? new Date(session.logout_time).toLocaleString() : 'Active'}
                      </TableCell>
                      <TableCell>
                        {getSessionDuration(session.login_time, session.logout_time)}
                      </TableCell>
                      <TableCell>{session.ip_address || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


