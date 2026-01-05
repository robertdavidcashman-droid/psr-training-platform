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
    
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code'); // Filter by code letter (A-H)
    const search = searchParams.get('search'); // Search query
    
    let query = supabase
      .from('pace_code_sections')
      .select('*')
      .order('code_letter', { ascending: true })
      .order('section_number', { ascending: true });
    
    // Filter by code letter if provided
    if (code) {
      query = query.eq('code_letter', code.toUpperCase());
    }
    
    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching PACE sections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch PACE sections' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ sections: data || [] });
  } catch (error: any) {
    console.error('PACE API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
