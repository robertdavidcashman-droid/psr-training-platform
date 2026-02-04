#!/usr/bin/env node

/**
 * Interactive script to set up DATABASE_URL in .env.local
 * Prompts user for password and updates the file
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log("🔧 Database Connection Setup\n");
  console.log("=".repeat(60));
  
  const projectRef = "cvsawjrtgmsmadtrfwfa";
  const envPath = join(rootDir, ".env.local");
  
  // Read existing .env.local or create from example
  let envContent = "";
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, "utf-8");
  } else {
    const examplePath = join(rootDir, ".env.local.example");
    if (existsSync(examplePath)) {
      envContent = readFileSync(examplePath, "utf-8");
    }
  }
  
  console.log("\nYour Supabase project: " + projectRef);
  console.log("\nChoose connection type:");
  console.log("1. Session Pooler (Recommended - IPv4 compatible, better for serverless)");
  console.log("2. Direct Connection (IPv6, may have connectivity issues)");
  
  const choice = await question("\nEnter choice (1 or 2) [1]: ");
  const usePooler = choice.trim() !== "2";
  
  console.log("\n📋 Connection String Format:");
  if (usePooler) {
    console.log(`postgresql://postgres.${projectRef}:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`);
    console.log("\nTo get this:");
    console.log("1. Go to: https://app.supabase.com/project/" + projectRef + "/settings/database");
    console.log("2. Click 'Connection string' → Select 'Session pooler'");
    console.log("3. Copy the entire connection string");
  } else {
    console.log(`postgresql://postgres:[PASSWORD]@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`);
    console.log("\nTo get this:");
    console.log("1. Go to: https://app.supabase.com/project/" + projectRef + "/settings/database");
    console.log("2. Click 'Connection string' → Select 'Direct connection'");
    console.log("3. Copy the entire connection string");
  }
  
  console.log("\n" + "=".repeat(60));
  const connectionString = await question("\nPaste your full DATABASE_URL connection string: ");
  
  if (!connectionString.trim()) {
    console.log("\n❌ No connection string provided. Exiting.");
    rl.close();
    process.exit(1);
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
  console.log("\n✅ Updated .env.local with DATABASE_URL");
  console.log("\n🔍 Verifying connection...\n");
  
  rl.close();
  
  // Run the diagnostic
  try {
    const { execSync } = await import("child_process");
    execSync("node scripts/fix-database-connection.mjs", { stdio: "inherit", cwd: rootDir });
  } catch (error) {
    console.log("\n⚠️  Could not verify connection automatically");
  }
  
  console.log("\n✅ Setup complete! Run 'npm run setup:auth' to apply migrations.");
}

main().catch((error) => {
  console.error("Error:", error.message);
  rl.close();
  process.exit(1);
});
