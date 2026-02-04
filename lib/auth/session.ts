/**
 * Session management utilities
 * Handles session token generation, validation, and cookie management
 */

import { randomBytes, createHash } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import type { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "app_session";
const SESSION_DAYS = Number(process.env.AUTH_SESSION_DAYS || "14");
const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60; // seconds

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Hash a session token for storage in database
 */
export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a new session for a user
 */
export async function createSession(userId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await db.insert(schema.appSessions).values({
    userId,
    sessionTokenHash: tokenHash,
    expiresAt,
    lastSeenAt: new Date(),
  });

  return { token, expiresAt };
}

/**
 * Validate a session token and return the user ID if valid
 */
export async function validateSession(
  token: string
): Promise<{ userId: string; email: string } | null> {
  const tokenHash = hashSessionToken(token);

  const sessions = await db
    .select()
    .from(schema.appSessions)
    .where(
      and(
        eq(schema.appSessions.sessionTokenHash, tokenHash),
        gt(schema.appSessions.expiresAt, new Date())
      )
    )
    .limit(1);

  const session = sessions[0];
  if (!session) {
    return null;
  }

  // Update last seen timestamp
  await db
    .update(schema.appSessions)
    .set({ lastSeenAt: new Date() })
    .where(eq(schema.appSessions.id, session.id));

  // Get user email
  const users = await db
    .select()
    .from(schema.appUsers)
    .where(eq(schema.appUsers.id, session.userId))
    .limit(1);

  const user = users[0];
  if (!user) {
    return null;
  }

  return {
    userId: session.userId,
    email: user.email,
  };
}

/**
 * Delete a session by token
 */
export async function deleteSession(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await db
    .delete(schema.appSessions)
    .where(eq(schema.appSessions.sessionTokenHash, tokenHash));
}

/**
 * Set session cookie on response
 */
export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date
): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get session token from request
 */
export function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value || null;
}

/**
 * Get current user from session (convenience function)
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<{ userId: string; email: string } | null> {
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  return validateSession(token);
}
