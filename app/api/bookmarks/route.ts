import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Bookmarks are user-specific - return empty array for anonymous users
  return NextResponse.json({ bookmarks: [] });
}

export async function POST(request: NextRequest) {
  // Bookmarks require authentication - no longer supported
  return NextResponse.json(
    { error: 'Bookmarks are not available without user accounts' },
    { status: 403 }
  );
}

export async function DELETE(request: NextRequest) {
  // Bookmarks require authentication - no longer supported
  return NextResponse.json(
    { error: 'Bookmarks are not available without user accounts' },
    { status: 403 }
  );
}
