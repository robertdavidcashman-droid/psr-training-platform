#!/usr/bin/env node

/**
 * Auth verification script
 * Checks environment variables and auth health endpoint
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  log("\n📋 Checking environment variables...", "blue");

  try {
    const envPath = join(projectRoot, ".env.local");
    const envContent = readFileSync(envPath, "utf-8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });

    const hasUrl = !!envVars.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (hasUrl && hasKey) {
      log("✅ Environment variables found", "green");
      log(`   URL: ${envVars.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...`);
      log(`   Key: ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`);
      return true;
    } else {
      log("❌ Missing environment variables", "red");
      if (!hasUrl) log("   Missing: NEXT_PUBLIC_SUPABASE_URL", "red");
      if (!hasKey) log("   Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY", "red");
      return false;
    }
  } catch (error) {
    log("❌ Could not read .env.local file", "red");
    log(`   Error: ${error.message}`, "red");
    return false;
  }
}

async function checkHealthEndpoint() {
  log("\n🏥 Checking auth health endpoint...", "blue");

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/auth/health`);
    const data = await response.json();

    if (data.healthy) {
      log("✅ Auth health check passed", "green");
      log(`   Session: ${data.checks.session?.userId ? "Logged in" : "Not logged in"}`);
      if (data.checks.session?.email) {
        log(`   Email: ${data.checks.session.email}`);
      }
      return true;
    } else {
      log("❌ Auth health check failed", "red");
      if (data.checks.error) {
        log(`   Error: ${data.checks.error}`, "red");
      }
      if (!data.checks.env.hasUrl) {
        log("   Missing: NEXT_PUBLIC_SUPABASE_URL", "red");
      }
      if (!data.checks.env.hasKey) {
        log("   Missing: NEXT_PUBLIC_SUPABASE_ANON_KEY", "red");
      }
      return false;
    }
  } catch (error) {
    log("❌ Could not reach health endpoint", "red");
    log(`   Error: ${error.message}`, "red");
    log(`   Make sure the dev server is running: npm run dev`, "yellow");
    return false;
  }
}

async function main() {
  log("🔐 Auth Verification Script", "blue");
  log("=" .repeat(50), "blue");

  const envOk = checkEnvFile();
  const healthOk = await checkHealthEndpoint();

  log("\n" + "=".repeat(50), "blue");

  if (envOk && healthOk) {
    log("\n✅ All checks passed!", "green");
    process.exit(0);
  } else {
    log("\n❌ Some checks failed", "red");
    log("\nTo fix:", "yellow");
    log("1. Ensure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY", "yellow");
    log("2. Start the dev server: npm run dev", "yellow");
    log("3. Run this script again: npm run auth:verify", "yellow");
    process.exit(1);
  }
}

main().catch((error) => {
  log(`\n❌ Unexpected error: ${error.message}`, "red");
  process.exit(1);
});
