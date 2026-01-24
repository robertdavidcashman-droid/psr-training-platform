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
