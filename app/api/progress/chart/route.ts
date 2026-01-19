import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Progress tracking is user-specific - return empty data for anonymous users
  return NextResponse.json({ data: [] });
}
