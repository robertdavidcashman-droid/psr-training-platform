import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Return null for anonymous users
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ studyPlan: null });
    }

    const { data: studyPlan, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching study plan:', error);
      return NextResponse.json(
        { error: 'Failed to fetch study plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ studyPlan: studyPlan || null });
  } catch (error: any) {
    console.error('Study plan API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { exam_date, daily_hours } = await request.json();

    if (!exam_date || !daily_hours) {
      return NextResponse.json(
        { error: 'exam_date and daily_hours are required' },
        { status: 400 }
      );
    }

    const { data: studyPlan, error } = await supabase
      .from('study_plans')
      .insert({
        user_id: user.id,
        exam_date,
        daily_hours,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating study plan:', error);
      return NextResponse.json(
        { error: 'Failed to create study plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ studyPlan });
  } catch (error: any) {
    console.error('Study plan API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { exam_date, daily_hours } = await request.json();

    const { data: studyPlan, error } = await supabase
      .from('study_plans')
      .update({
        exam_date,
        daily_hours,
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating study plan:', error);
      return NextResponse.json(
        { error: 'Failed to update study plan' },
        { status: 500 }
      );
    }

    return NextResponse.json({ studyPlan });
  } catch (error: any) {
    console.error('Study plan API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
