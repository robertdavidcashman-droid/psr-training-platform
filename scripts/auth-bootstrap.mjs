#!/usr/bin/env node
/**
 * One-command bootstrap:
 * - checks env
 * - applies DB migration
 * - runs verification (includes Playwright)
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { resolve6 } from "dns/promises";

// Load environment variables from .env.local if it exists (so user doesn't need to set PowerShell env vars)
try {
  const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch {
  // ignore if no .env.local
}

// Supabase DB host is often IPv6-only (db.<project-ref>.supabase.co). On some Windows setups,
// getaddrinfo won't return AAAA records, causing ENOENT. If so, resolve AAAA explicitly and
// rewrite DATABASE_URL to use an IPv6 literal, e.g. postgresql://...@[2a05:...]:5432/postgres
try {
  const raw = process.env.DATABASE_URL;
  if (raw) {
    const m = raw.match(/@([^/:\s]+)(:\d+)?\//);
    const host = m?.[1];
    if (host && host.startsWith("db.") && host.endsWith(".supabase.co")) {
      const ipv6s = await resolve6(host);
      if (ipv6s?.length) {
        // Replace only the hostname portion after '@'
        process.env.DATABASE_URL = raw.replace(
          `@${host}`,
          `@[${ipv6s[0]}]`
        );
      }
    }
  }
} catch {
  // ignore; migrate step will surface errors
}

if (!process.env.DATABASE_URL) {
  console.error("Missing required env var: DATABASE_URL");
  console.error("Set it in .env.local (see .env.local.example).");
  process.exit(1);
}

try {
  execSync("node scripts/auth-migrate.mjs", { stdio: "inherit" });
  execSync("node scripts/verify-custom-auth.mjs", {
    stdio: "inherit",
    env: { ...process.env, E2E_PORT: process.env.E2E_PORT || "3100" },
  });
  process.exit(0);
} catch {
  process.exit(1);
}

