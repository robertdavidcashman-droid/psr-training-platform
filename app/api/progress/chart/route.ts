import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication - return empty data for anonymous users
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ data: [] });
    }

    // Get progress data from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('timestamp, answered_correctly')
      .eq('user_id', user.id)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      );
    }

    // Group by date and calculate daily accuracy
    const dailyStats: Record<string, { correct: number; total: number }> = {};
    
    progress?.forEach(p => {
      const date = new Date(p.timestamp).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { correct: 0, total: 0 };
      }
      dailyStats[date].total++;
      if (p.answered_correctly) {
        dailyStats[date].correct++;
      }
    });

    // Convert to chart data format
    const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
      date,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      questions: stats.total,
    }));

    return NextResponse.json({ data: chartData });
  } catch (error: any) {
    console.error('Progress chart API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
