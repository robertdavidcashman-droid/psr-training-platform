#!/usr/bin/env node
/**
 * Apply the custom auth migration to Postgres using DATABASE_URL.
 * Idempotent (uses IF NOT EXISTS / CREATE OR REPLACE in migration).
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";
import { resolve6 } from "dns/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("Missing required env var: DATABASE_URL");
  process.exit(1);
}

const migrationPath = join(rootDir, "supabase", "migrations", "001_custom_auth.sql");
const migrationSql = readFileSync(migrationPath, "utf-8");

try {
  // Rewrite to IPv6 literal if using Supabase IPv6-only db host
  let effectiveUrl = databaseUrl;
  try {
    const m = databaseUrl.match(/@([^/:\s]+)(:\d+)?\//);
    const host = m?.[1];
    if (host && host.startsWith("db.") && host.endsWith(".supabase.co")) {
      const ipv6s = await resolve6(host);
      if (ipv6s?.length) {
        effectiveUrl = databaseUrl.replace(`@${host}`, `@[${ipv6s[0]}]`);
      }
    }
  } catch {
    // ignore parse errors
  }

  const client = new Client({
    connectionString: effectiveUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query(migrationSql);
  await client.end();
  console.log(`✅ Applied migration: ${migrationPath}`);
  process.exit(0);
} catch (err) {
  console.error("❌ Failed to apply migration.");
  const msg = err instanceof Error ? err.message : String(err);
  // Helpful guidance for common Supabase connectivity issues.
  if (
    msg.includes("ENETUNREACH") ||
    msg.includes("EHOSTUNREACH") ||
    msg.includes("network unreachable")
  ) {
    console.error(
      "\nYour environment cannot reach Supabase over IPv6.\n" +
        "Fix: In Supabase Dashboard click Connect → use a Pooler connection string (IPv4),\n" +
        "preferably 'Session pooler', and set DATABASE_URL to that value.\n"
    );
  }
  console.error(msg);
  process.exit(1);
}

