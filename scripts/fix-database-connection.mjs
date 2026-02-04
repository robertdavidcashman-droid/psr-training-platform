#!/usr/bin/env node

/**
 * Helper script to diagnose and fix database connection issues
 * Checks DATABASE_URL and suggests fixes for IPv6/IPv4 issues
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { resolve6 } from "dns/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🔍 Database Connection Diagnostic\n");
console.log("=".repeat(60));

// Load .env.local
const envPath = join(rootDir, ".env.local");
let databaseUrl = "";

if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  const match = envContent.match(/^DATABASE_URL=(.*)$/m);
  if (match) {
    databaseUrl = match[1].trim().replace(/^["']|["']$/g, "");
  }
}

if (!databaseUrl) {
  console.error("❌ DATABASE_URL not found in .env.local");
  console.error("\nPlease add DATABASE_URL to .env.local");
  process.exit(1);
}

console.log("\n1. Checking DATABASE_URL format...");
const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/:]+)(:\d+)?\/(.+)/);
if (!urlMatch) {
  console.error("❌ Invalid DATABASE_URL format");
  process.exit(1);
}

const [, user, password, host, port, database] = urlMatch;
const projectRefMatch = host.match(/db\.([^.]+)\.supabase\.co/);

if (projectRefMatch) {
  const projectRef = projectRefMatch[1];
  console.log(`   ✅ Detected Supabase project: ${projectRef}`);
  
  // Check if using direct connection
  if (host.startsWith("db.")) {
    console.log("\n2. Testing IPv6 connectivity...");
    try {
      const ipv6s = await resolve6(host);
      if (ipv6s?.length) {
        console.log(`   ✅ IPv6 resolved: ${ipv6s[0]}`);
        console.log("\n   ℹ️  Your connection uses IPv6. If tests fail, try the Session Pooler instead.");
      }
    } catch (error) {
      console.log("   ⚠️  IPv6 resolution failed");
      console.log("\n   💡 SOLUTION: Use Session Pooler connection (IPv4 compatible)");
      console.log("\n   Steps to fix:");
      console.log("   1. Go to Supabase Dashboard → Settings → Database");
      console.log("   2. Click 'Connection string' → Select 'Session pooler'");
      console.log("   3. Copy the connection string");
      console.log("   4. Update DATABASE_URL in .env.local");
      console.log("\n   Expected format:");
      console.log(`   DATABASE_URL=postgresql://postgres.${projectRef}:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`);
    }
  } else if (host.includes("pooler")) {
    console.log("   ✅ Using Session Pooler (IPv4 compatible)");
  }
} else {
  console.log("   ⚠️  Not a Supabase connection string");
}

// Check for placeholder password
if (password.includes("<") || password.includes("PASSWORD") || password.includes("YOUR")) {
  console.log("\n3. Password check...");
  console.error("   ❌ DATABASE_URL contains placeholder password");
  console.error("\n   Please replace [PASSWORD] or <NEW_PASSWORD> with your actual Supabase password");
  console.error("   Get it from: Supabase Dashboard → Settings → Database → Database password");
}

console.log("\n" + "=".repeat(60));
console.log("\n✅ Diagnostic complete!");
console.log("\nIf you're still having connection issues:");
console.log("1. Verify your Supabase password is correct");
console.log("2. Try using the Session Pooler connection string");
console.log("3. Check your network/firewall settings");
console.log("\n");
