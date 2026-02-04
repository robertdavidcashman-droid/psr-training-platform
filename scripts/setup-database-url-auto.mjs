#!/usr/bin/env node

/**
 * Non-interactive script to set up DATABASE_URL in .env.local
 * Reads from environment variable or command line argument
 * 
 * Usage:
 *   SUPABASE_DATABASE_URL="..." node scripts/setup-database-url-auto.mjs
 *   node scripts/setup-database-url-auto.mjs "postgresql://..."
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Get connection string from:
// 1. Command line argument
// 2. Environment variable SUPABASE_DATABASE_URL
// 3. Try Supabase CLI (if logged in)
async function getConnectionString() {
  // Try command line argument
  const args = process.argv.slice(2);
  if (args.length > 0) {
    return args[0];
  }

  // Try environment variable
  if (process.env.SUPABASE_DATABASE_URL) {
    return process.env.SUPABASE_DATABASE_URL;
  }

  // Try Supabase CLI
  try {
    const projectRef = "cvsawjrtgmsmadtrfwfa";
    console.log("Attempting to get connection string from Supabase CLI...");
    
    // Check if logged in
    try {
      execSync("supabase projects list", { stdio: "ignore" });
    } catch {
      throw new Error("Not logged in to Supabase CLI");
    }

    // Try to get connection info (CLI doesn't directly expose password, but we can get the format)
    // Note: Supabase CLI doesn't expose passwords for security, so we'll just provide the format
    throw new Error("Supabase CLI cannot provide passwords. Use SUPABASE_DATABASE_URL env var or pass as argument.");
  } catch (error) {
    if (error.message.includes("cannot provide passwords")) {
      throw error;
    }
    // CLI not available or not logged in, continue to manual instructions
  }

  // No connection string found
  throw new Error("No connection string provided");
}

async function main() {
  console.log("🔧 Database Connection Setup (Non-Interactive)\n");
  console.log("=".repeat(60));

  let connectionString;
  try {
    connectionString = await getConnectionString();
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n📋 Usage Options:\n");
    console.log("Option 1: Environment variable");
    console.log('  $env:SUPABASE_DATABASE_URL="postgresql://..." ; npm run db:setup:auto\n');
    console.log("Option 2: Command line argument");
    console.log('  npm run db:setup:auto "postgresql://..."\n');
    console.log("Option 3: Export in PowerShell");
    console.log('  $env:SUPABASE_DATABASE_URL="postgresql://postgres.xxx:password@..."\n');
    console.log("Then run: npm run db:setup:auto\n");
    console.log("=".repeat(60));
    console.log("\n💡 To get your connection string:");
    console.log("   1. Go to: https://app.supabase.com/project/cvsawjrtgmsmadtrfwfa/settings/database");
    console.log("   2. Click 'Connection string' → Select 'Session pooler'");
    console.log("   3. Copy the entire connection string");
    console.log("   4. Run: $env:SUPABASE_DATABASE_URL='<paste-here>' ; npm run db:setup:auto\n");
    process.exit(1);
  }

  const envPath = join(rootDir, ".env.local");
  
  // Read existing .env.local or create from example
  let envContent = "";
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, "utf-8");
  } else {
    const examplePath = join(rootDir, ".env.local.example");
    if (existsSync(examplePath)) {
      envContent = readFileSync(examplePath, "utf-8");
      console.log("📝 Created .env.local from .env.local.example\n");
    }
  }
  
  // Update .env.local
  const lines = envContent.split("\n");
  let updated = false;
  const newLines = lines.map((line) => {
    if (line.startsWith("DATABASE_URL=")) {
      updated = true;
      return `DATABASE_URL=${connectionString.trim()}`;
    }
    return line;
  });
  
  if (!updated) {
    // Add DATABASE_URL if it doesn't exist
    newLines.push(`DATABASE_URL=${connectionString.trim()}`);
  }
  
  writeFileSync(envPath, newLines.join("\n"), "utf-8");
  console.log("✅ Updated .env.local with DATABASE_URL\n");
  
  // Verify connection
  console.log("🔍 Verifying connection...\n");
  try {
    execSync("node scripts/fix-database-connection.mjs", { 
      stdio: "inherit", 
      cwd: rootDir,
      env: { ...process.env }
    });
  } catch (error) {
    console.log("\n⚠️  Connection verification had issues, but .env.local was updated.");
    console.log("   Run 'npm run db:check' to verify manually.\n");
  }
  
  console.log("\n✅ Setup complete!");
  console.log("   Run 'npm run setup:auth' to apply database migrations.\n");
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
