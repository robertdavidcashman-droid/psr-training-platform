import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find user
    const users = await db
      .select()
      .from(schema.appUsers)
      .where(eq(schema.appUsers.email, email.toLowerCase().trim()))
      .limit(1);

    const user = users[0];
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session
    const { token, expiresAt } = await createSession(user.id);

    // Create response
    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email },
    });

    // Set session cookie
    setSessionCookie(response, token, expiresAt);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
