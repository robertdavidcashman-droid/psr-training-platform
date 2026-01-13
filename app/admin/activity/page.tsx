'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LogIn, 
  LogOut, 
  HelpCircle, 
  BookOpen, 
  Bookmark, 
  Brain, 
  Target, 
  FileText,
  Download,
  Search,
  User,
  Calendar,
  Filter
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user_id: string;
  session_id: string | null;
  action_type: string;
  action_details: Record<string, any>;
  page_url: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  users?: {
    email: string;
    full_name: string | null;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

const ACTION_ICONS: Record<string, any> = {
  login: LogIn,
  logout: LogOut,
  question_answered: HelpCircle,
  module_started: BookOpen,
  module_completed: BookOpen,
  bookmark_created: Bookmark,
  bookmark_removed: Bookmark,
  flashcard_reviewed: Brain,
  study_plan_created: Target,
  scenario_started: FileText,
  scenario_completed: FileText,
  mock_exam_started: FileText,
  mock_exam_completed: FileText,
};

const ACTION_COLORS: Record<string, string> = {
  login: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  logout: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  question_answered: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  module_started: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  module_completed: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  bookmark_created: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  bookmark_removed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  flashcard_reviewed: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  study_plan_created: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  scenario_started: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  scenario_completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  mock_exam_started: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  mock_exam_completed: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
};

function formatActionDetails(actionType: string, details: Record<string, any>): string {
  switch (actionType) {
    case 'question_answered':
      return `Question: ${details.question_id?.substring(0, 8)}... | ${details.answered_correctly ? 'Correct' : 'Incorrect'} | Category: ${details.category || 'N/A'}`;
    case 'module_started':
    case 'module_completed':
      return `Module: ${details.module_title || details.module_id || 'N/A'} | Category: ${details.category || 'N/A'}`;
    case 'bookmark_created':
    case 'bookmark_removed':
      return `Type: ${details.bookmark_type || 'N/A'}`;
    case 'flashcard_reviewed':
      return `Quality: ${details.quality}/5 | Interval: ${details.interval_days || 'N/A'} days`;
    case 'study_plan_created':
      return `Exam Date: ${details.exam_date || 'N/A'}`;
    default:
      return JSON.stringify(details);
  }
}

function AdminActivityPageContent() {
  const searchParams = useSearchParams();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    userId: searchParams.get('userId') || 'all',
    actionType: 'all',
    timeRange: '30',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [filters, currentPage]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .order('email', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Build base query for count
      let countQuery = supabase
        .from('user_activity_log')
        .select('id', { count: 'exact', head: true });

      // Build query for data
      let query = supabase
        .from('user_activity_log')
        .select('*, users(email, full_name)')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      // Apply filters to both queries
      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId);
        countQuery = countQuery.eq('user_id', filters.userId);
      }

      if (filters.actionType !== 'all') {
        query = query.eq('action_type', filters.actionType);
        countQuery = countQuery.eq('action_type', filters.actionType);
      }

      if (filters.timeRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(filters.timeRange));
        query = query.gte('created_at', daysAgo.toISOString());
        countQuery = countQuery.gte('created_at', daysAgo.toISOString());
      }

      if (filters.search) {
        query = query.or(`action_type.ilike.%${filters.search}%,page_url.ilike.%${filters.search}%`);
        countQuery = countQuery.or(`action_type.ilike.%${filters.search}%,page_url.ilike.%${filters.search}%`);
      }

      // Get count and data in parallel
      const [countResult, dataResult] = await Promise.all([
        countQuery,
        query
      ]);

      if (countResult.error) {
        console.error('Error loading activity count:', countResult.error);
        // If it's a permission error, show helpful message
        if (countResult.error.code === 'PGRST301' || countResult.error.message?.includes('permission')) {
          throw new Error('You do not have permission to view activity logs. Please ensure you are logged in as an admin.');
        }
        throw countResult.error;
      }
      if (dataResult.error) {
        console.error('Error loading activities:', dataResult.error);
        // If it's a permission error, show helpful message
        if (dataResult.error.code === 'PGRST301' || dataResult.error.message?.includes('permission')) {
          throw new Error('You do not have permission to view activity logs. Please ensure you are logged in as an admin.');
        }
        throw dataResult.error;
      }

      setTotalCount(countResult.count || 0);
      setActivities((dataResult.data as ActivityLog[]) || []);
    } catch (error: any) {
      console.error('Error loading activities:', error);
      // Show user-friendly error message
      if (error.message) {
        // Error message will be displayed in the UI
      }
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    // Load all activities matching current filters for export
    try {
      let query = supabase
        .from('user_activity_log')
        .select('*, users(email, full_name)')
        .order('created_at', { ascending: false });

      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.actionType !== 'all') {
        query = query.eq('action_type', filters.actionType);
      }

      if (filters.timeRange !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(filters.timeRange));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      if (filters.search) {
        query = query.or(`action_type.ilike.%${filters.search}%,page_url.ilike.%${filters.search}%`);
      }

      const { data } = await query;
      const exportActivities = (data as ActivityLog[]) || [];

      const headers = ['Timestamp', 'User', 'Email', 'Action Type', 'Details', 'Page URL', 'IP Address'];
      const rows = exportActivities.map(activity => [
        new Date(activity.created_at).toLocaleString(),
        (activity.users as any)?.full_name || 'N/A',
        (activity.users as any)?.email || 'N/A',
        activity.action_type,
        formatActionDetails(activity.action_type, activity.action_details),
        activity.page_url || 'N/A',
        activity.ip_address || 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy-800 dark:text-navy-200 mb-2">User Activity Log</h1>
        <p className="text-muted-foreground text-lg">
          Track and review all user activities across the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="user-filter" className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4" />
                User
              </Label>
              <select
                id="user-filter"
                value={filters.userId}
                onChange={(e) => {
                  setFilters({ ...filters, userId: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name || user.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="action-filter" className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4" />
                Action Type
              </Label>
              <select
                id="action-filter"
                value={filters.actionType}
                onChange={(e) => {
                  setFilters({ ...filters, actionType: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="all">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="question_answered">Question Answered</option>
                <option value="module_started">Module Started</option>
                <option value="module_completed">Module Completed</option>
                <option value="bookmark_created">Bookmark Created</option>
                <option value="bookmark_removed">Bookmark Removed</option>
                <option value="flashcard_reviewed">Flashcard Reviewed</option>
                <option value="study_plan_created">Study Plan Created</option>
              </select>
            </div>

            <div>
              <Label htmlFor="time-filter" className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                Time Range
              </Label>
              <select
                id="time-filter"
                value={filters.timeRange}
                onChange={(e) => {
                  setFilters({ ...filters, timeRange: e.target.value });
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

            <div>
              <Label htmlFor="search" className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4" />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search actions or URLs..."
                value={filters.search}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Showing {activities.length} of {totalCount} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading activities...</p>
            </div>
          ) : activities.length === 0 && totalCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No activities found matching your filters.</p>
              <p className="text-sm text-muted-foreground">
                {filters.userId !== 'all' || filters.actionType !== 'all' || filters.timeRange !== 'all' || filters.search
                  ? 'Try adjusting your filters or check back later.'
                  : 'Activity logs will appear here as users interact with the platform.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => {
                      const Icon = ACTION_ICONS[activity.action_type] || FileText;
                      const colorClass = ACTION_COLORS[activity.action_type] || 'bg-gray-100 text-gray-800';
                      
                      return (
                        <TableRow key={activity.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(activity.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {(activity.users as any)?.full_name || 'N/A'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {(activity.users as any)?.email || 'N/A'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                              <Icon className="w-3 h-3" />
                              {activity.action_type.replace(/_/g, ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="text-sm truncate" title={formatActionDetails(activity.action_type, activity.action_details)}>
                              {formatActionDetails(activity.action_type, activity.action_details)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {activity.page_url ? (
                              <a 
                                href={activity.page_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {activity.page_url.substring(0, 40)}...
                              </a>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {activity.ip_address || 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminActivityPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading activity log...</p>
        </div>
      </div>
    }>
      <AdminActivityPageContent />
    </Suspense>
  );
}
