import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Activity logging removed - no longer tracking user activities
    // Return success for all requests to maintain API compatibility
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in activity log endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
