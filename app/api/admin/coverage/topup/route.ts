import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      error:
        "This admin endpoint was disabled during the Supabase Auth removal migration.",
    },
    { status: 410 }
  );
}
