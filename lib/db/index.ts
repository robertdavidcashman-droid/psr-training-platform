/**
 * Database connection using Drizzle ORM + Postgres
 * Server-only - never expose to client
 */

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: Pool | null = null;

/**
 * Get database connection (lazy initialization)
 * Throws error only when actually used, not at module load time
 */
async function _resolveIPv6IfNeeded(connectionString: string): Promise<string> {
  try {
    const match = connectionString.match(/@([^/:\s]+)(:\d+)?\//);
    const host = match?.[1];
    
    // Only try IPv6 resolution for Supabase direct connections
    if (host && host.startsWith("db.") && host.endsWith(".supabase.co") && !host.includes("[")) {
      const { resolve6 } = await import("dns/promises");
      try {
        const ipv6s = await resolve6(host);
        if (ipv6s?.length) {
          return connectionString.replace(`@${host}`, `@[${ipv6s[0]}]`);
        }
      } catch {
        // IPv6 resolution failed, use original connection string
        // This will let node-postgres handle it or fail with a clearer error
      }
    }
  } catch {
    // Ignore errors, return original
  }
  
  return connectionString;
}

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!_db) {
    const connectionString = process.env.DATABASE_URL;

    // Supabase direct DB host is often IPv6-only; node-postgres handles this reliably.
    // Also, Supabase typically requires SSL.
    _pool = new Pool({
      connectionString,
      max: 1,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 10_000,
      ssl: { rejectUnauthorized: false },
    });

    // Create drizzle instance
    _db = drizzle(_pool, { schema });
  }

  return _db;
}

// Export db as a proxy that lazily initializes
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const dbInstance = getDb();
    const value = dbInstance[prop as keyof ReturnType<typeof drizzle>];
    // If it's a function, bind it to the db instance
    if (typeof value === "function") {
      return value.bind(dbInstance);
    }
    return value;
  },
});

// Export schema for use in queries
export { schema };
