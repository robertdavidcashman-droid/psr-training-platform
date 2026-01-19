import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Study plans are user-specific - return null for anonymous users
  return NextResponse.json({ studyPlan: null });
}

export async function POST(request: NextRequest) {
  // Study plans require authentication - no longer supported
  return NextResponse.json(
    { error: 'Study plans are not available without user accounts' },
    { status: 403 }
  );
}

export async function PATCH(request: NextRequest) {
  // Study plans require authentication - no longer supported
  return NextResponse.json(
    { error: 'Study plans are not available without user accounts' },
    { status: 403 }
  );
}
