import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Logout route handler
 * Signs out the user and clears the session
 */
export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
