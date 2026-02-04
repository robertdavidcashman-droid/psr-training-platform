/**
 * Password hashing and verification utilities
 * Uses argon2 for secure password hashing
 */

import argon2 from "argon2";

/**
 * Hash a password using argon2
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,
    parallelism: 4,
  });
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/**
 * Validate password strength (optional)
 * Returns error message if invalid, null if valid
 */
export function validatePasswordStrength(
  password: string
): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (password.length > 128) {
    return "Password must be less than 128 characters";
  }
  // Optional: Add more strength requirements
  // if (!/[A-Z]/.test(password)) {
  //   return "Password must contain at least one uppercase letter";
  // }
  // if (!/[a-z]/.test(password)) {
  //   return "Password must contain at least one lowercase letter";
  // }
  // if (!/[0-9]/.test(password)) {
  //   return "Password must contain at least one number";
  // }
  return null;
}
