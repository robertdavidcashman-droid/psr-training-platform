import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Flashcards are user-specific - return empty array for anonymous users
  return NextResponse.json({ flashcards: [] });
}

export async function POST(request: NextRequest) {
  // Flashcards require authentication - no longer supported
  return NextResponse.json(
    { error: 'Flashcards are not available without user accounts' },
    { status: 403 }
  );
}

export async function PATCH(request: NextRequest) {
  // Flashcards require authentication - no longer supported
  return NextResponse.json(
    { error: 'Flashcards are not available without user accounts' },
    { status: 403 }
  );
}

export async function PUT(request: NextRequest) {
  // Flashcards require authentication - no longer supported
  return NextResponse.json(
    { error: 'Flashcards are not available without user accounts' },
    { status: 403 }
  );
}

export async function DELETE(request: NextRequest) {
  // Flashcards require authentication - no longer supported
  return NextResponse.json(
    { error: 'Flashcards are not available without user accounts' },
    { status: 403 }
  );
}
