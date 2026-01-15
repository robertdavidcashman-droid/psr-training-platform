import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: bookmarks, error } = await supabase
      .from('bookmarks')
      .select('*, questions(*), content_modules(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookmarks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookmarks' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmarks: bookmarks || [] });
  } catch (error: any) {
    console.error('Bookmarks API error:', error);
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

    const { question_id, module_id } = await request.json();

    if (!question_id && !module_id) {
      return NextResponse.json(
        { error: 'question_id or module_id is required' },
        { status: 400 }
      );
    }

    const { data: bookmark, error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: user.id,
        question_id: question_id || null,
        module_id: module_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to create bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookmark });
  } catch (error: any) {
    console.error('Bookmarks API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get('question_id');
    const moduleId = searchParams.get('module_id');

    if (!questionId && !moduleId) {
      return NextResponse.json(
        { error: 'question_id or module_id is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id);

    if (questionId) {
      query = query.eq('question_id', questionId);
    }
    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error deleting bookmark:', error);
      return NextResponse.json(
        { error: 'Failed to delete bookmark' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Bookmarks API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
