import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Auth health check endpoint
 * Returns the current authentication status and configuration
 */
export async function GET() {
  const checks = {
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    session: null as { userId: string | null; email: string | null } | null,
    error: null as string | null,
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    checks.session = {
      userId: user?.id || null,
      email: user?.email || null,
    };
  } catch (error) {
    checks.error = error instanceof Error ? error.message : "Unknown error";
  }

  const healthy =
    checks.env.hasUrl &&
    checks.env.hasKey &&
    checks.error === null;

  return NextResponse.json(
    {
      healthy,
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
