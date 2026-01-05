import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's flashcards
    const searchParams = request.nextUrl.searchParams;
    const dueOnly = searchParams.get('due') === 'true';
    
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', user.id);
    
    if (dueOnly) {
      query = query.lte('next_review', new Date().toISOString());
    }
    
    query = query.order('next_review', { ascending: true });
    
    const { data: flashcards, error } = await query;

    if (error) {
      console.error('Error fetching flashcards:', error);
      return NextResponse.json(
        { error: 'Failed to fetch flashcards' },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards: flashcards || [] });
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { question_id, front_text, back_text, category, difficulty, statute, section } = await request.json();

    if (!front_text || !back_text) {
      return NextResponse.json(
        { error: 'front_text and back_text are required' },
        { status: 400 }
      );
    }

    // Create flashcard
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .insert({
        user_id: user.id,
        question_id: question_id || null,
        front_text,
        back_text,
        category: category || null,
        difficulty: difficulty || null,
        statute: statute || null,
        section: section || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating flashcard:', error);
      return NextResponse.json(
        { error: 'Failed to create flashcard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcard });
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, quality, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // Get current flashcard to calculate new interval
    const { data: currentCard } = await supabase
      .from('flashcards')
      .select('interval_days, ease_factor, review_count')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    let intervalDays = 1;
    let easeFactor = 2.5;
    
    if (currentCard) {
      intervalDays = currentCard.interval_days || 1;
      easeFactor = currentCard.ease_factor || 2.5;
      
      // Spaced repetition algorithm based on quality (0-5 scale)
      if (quality !== undefined) {
        easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
        
        if (quality >= 4) {
          // Good response - increase interval
          intervalDays = Math.round(intervalDays * easeFactor);
        } else if (quality === 3) {
          // Hard response - keep same interval
          intervalDays = intervalDays;
        } else {
          // Difficult response - reset to 1 day
          intervalDays = 1;
        }
      }
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);

    // Update flashcard (only if it belongs to the user)
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .update({
        ...updateData,
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString(),
        interval_days: intervalDays,
        ease_factor: easeFactor,
        review_count: currentCard ? (currentCard.review_count || 0) + 1 : 1,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating flashcard:', error);
      return NextResponse.json(
        { error: 'Failed to update flashcard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcard });
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // Update flashcard (only if it belongs to the user)
    const { data: flashcard, error } = await supabase
      .from('flashcards')
      .update({
        ...updateData,
        last_reviewed: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating flashcard:', error);
      return NextResponse.json(
        { error: 'Failed to update flashcard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcard });
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    // Delete flashcard (only if it belongs to the user)
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting flashcard:', error);
      return NextResponse.json(
        { error: 'Failed to delete flashcard' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Flashcards API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
