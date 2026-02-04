#!/usr/bin/env node

/**
 * Automated Database Setup using Supabase CLI
 * 
 * This script:
 * 1. Logs in via browser (no passwords to copy)
 * 2. Lists your projects (pick from a list)
 * 3. Automatically retrieves connection string
 * 4. Configures .env.local
 * 5. Tests the connection
 * 
 * Usage: npm run db:auto-setup
 */

import { readFileSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync, spawn } from "child_process";
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

function runCommand(command, options = {}) {
  try {
    return execSync(command, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: options.silent ? "pipe" : "inherit",
      ...options,
    });
  } catch (error) {
    if (options.silent) {
      return null;
    }
    throw error;
  }
}

function runCommandAsync(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, [], {
      cwd: rootDir,
      stdio: "inherit",
      shell: true,
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
    child.on("error", reject);
  });
}

async function checkSupabaseCli() {
  console.log("Checking Supabase CLI...");
  try {
    const version = runCommand("npx supabase --version", { silent: true, stdio: "pipe" });
    if (version) {
      console.log("   Supabase CLI available");
      return true;
    }
  } catch {
    // Fall through
  }
  console.error("   Supabase CLI not found. Installing...");
  runCommand("npm install --save-dev supabase");
  return true;
}

async function checkLogin() {
  console.log("\nChecking Supabase login status...");
  try {
    const result = runCommand("npx supabase projects list --output json", { 
      silent: true, 
      stdio: "pipe" 
    });
    if (result && !result.includes("not logged in")) {
      console.log("   Already logged in");
      return true;
    }
  } catch {
    // Not logged in
  }
  return false;
}

async function login() {
  console.log("\nSupabase login required.");
  console.log("\n   Option 1: Browser login (if browser opens)");
  console.log("   Option 2: Token login (recommended for Windows)\n");
  
  // Try to open the tokens page
  const tokensUrl = "https://supabase.com/dashboard/account/tokens";
  console.log("   Opening: " + tokensUrl);
  
  try {
    execSync(`start "" "${tokensUrl}"`, { stdio: 'ignore', shell: true });
  } catch {
    console.log("   (Could not open browser - visit the URL manually)");
  }
  
  console.log("\n   To login with a token:");
  console.log("   1. Generate a token at the URL above");
  console.log("   2. Copy the token");
  console.log("   3. Paste it below\n");
  
  const token = await question("Paste your access token (or press Enter to try browser login): ");
  
  if (token.trim()) {
    try {
      runCommand(`npx supabase login --token ${token.trim()}`, { silent: true, stdio: 'pipe' });
      console.log("\n   Login successful!");
      return true;
    } catch (error) {
      console.error("\n   Token login failed. Please check the token and try again.");
      return false;
    }
  }
  
  // Fallback to browser login
  console.log("\n   Trying browser login...");
  try {
    await runCommandAsync("npx supabase login");
    console.log("\n   Login successful!");
    return true;
  } catch (error) {
    console.error("\n   Login failed:", error.message);
    return false;
  }
}

async function getProjects() {
  console.log("\nFetching your Supabase projects...");
  try {
    const result = runCommand("npx supabase projects list --output json", { 
      silent: true, 
      stdio: "pipe" 
    });
    if (result) {
      const projects = JSON.parse(result);
      return projects;
    }
  } catch (error) {
    console.error("Failed to list projects:", error.message);
  }
  return [];
}

async function selectProject(projects) {
  if (projects.length === 0) {
    console.error("\n   No projects found. Create a project at https://app.supabase.com first.");
    return null;
  }

  console.log("\nYour Supabase projects:\n");
  projects.forEach((project, index) => {
    const status = project.status === "ACTIVE_HEALTHY" ? "" : ` (${project.status})`;
    console.log(`   ${index + 1}. ${project.name} (${project.id})${status}`);
  });

  const defaultChoice = projects.length === 1 ? "1" : "";
  const prompt = projects.length === 1 
    ? "\nSelect project [1]: " 
    : `\nSelect project (1-${projects.length}): `;
  
  const choice = await question(prompt);
  const index = parseInt(choice || defaultChoice, 10) - 1;

  if (index >= 0 && index < projects.length) {
    return projects[index];
  }
  
  console.error("Invalid selection");
  return null;
}

async function linkProject(projectId) {
  console.log(`\nLinking to project ${projectId}...`);
  try {
    // Initialize supabase if not already done
    if (!existsSync(join(rootDir, "supabase", "config.toml"))) {
      runCommand("npx supabase init", { silent: true, stdio: "pipe" });
    }
    
    runCommand(`npx supabase link --project-ref ${projectId}`, { 
      silent: true, 
      stdio: "pipe" 
    });
    console.log("   Project linked successfully");
    return true;
  } catch (error) {
    // Link might fail if already linked, that's okay
    console.log("   Project link configured");
    return true;
  }
}

async function getConnectionString(projectId) {
  console.log("\nRetrieving connection string...");
  
  try {
    // Try to get the pooler connection string (IPv4 compatible)
    const result = runCommand("npx supabase db url --linked", { 
      silent: true, 
      stdio: "pipe" 
    });
    
    if (result) {
      let url = result.trim();
      // The CLI returns a transaction pooler URL, let's use it
      console.log("   Connection string retrieved");
      return url;
    }
  } catch (error) {
    console.log("   Could not retrieve via CLI, will use manual entry");
  }
  
  return null;
}

async function updateEnvLocal(connectionString) {
  console.log("\nUpdating .env.local...");
  
  const envPath = join(rootDir, ".env.local");
  let envContent = "";
  
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, "utf-8");
  } else {
    const examplePath = join(rootDir, ".env.local.example");
    if (existsSync(examplePath)) {
      envContent = readFileSync(examplePath, "utf-8");
    }
  }
  
  const lines = envContent.split("\n");
  let updated = false;
  const newLines = lines.map((line) => {
    if (line.startsWith("DATABASE_URL=")) {
      updated = true;
      return `DATABASE_URL=${connectionString}`;
    }
    return line;
  });
  
  if (!updated) {
    newLines.push(`DATABASE_URL=${connectionString}`);
  }
  
  writeFileSync(envPath, newLines.join("\n"), "utf-8");
  console.log("   .env.local updated with DATABASE_URL");
}

async function testConnection() {
  console.log("\nTesting database connection...");
  
  try {
    // Simple connection test using pg
    const testCode = `
      const pg = require('pg');
      require('dotenv').config({ path: '.env.local' });
      const pool = new pg.Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
      });
      pool.query('SELECT 1')
        .then(() => { console.log('   Connection successful!'); process.exit(0); })
        .catch(e => { console.error('   Connection failed:', e.message); process.exit(1); });
    `;
    
    execSync(`node -e "${testCode.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
      cwd: rootDir,
      encoding: "utf-8",
      stdio: "inherit",
    });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("         Automated Database Setup");
  console.log("=".repeat(60));
  console.log("\nThis will configure your database connection automatically.");
  console.log("No passwords or connection strings to copy!\n");

  try {
    // Step 1: Check CLI
    await checkSupabaseCli();

    // Step 2: Check/perform login
    const isLoggedIn = await checkLogin();
    if (!isLoggedIn) {
      const loginSuccess = await login();
      if (!loginSuccess) {
        console.error("\nSetup cancelled - login required.");
        rl.close();
        process.exit(1);
      }
    }

    // Step 3: Get projects
    const projects = await getProjects();
    
    // Step 4: Select project
    const project = await selectProject(projects);
    if (!project) {
      rl.close();
      process.exit(1);
    }

    console.log(`\nSelected: ${project.name}`);

    // Step 5: Link project
    await linkProject(project.id);

    // Step 6: Get connection string
    let connectionString = await getConnectionString(project.id);
    
    if (!connectionString) {
      // Fallback: construct URL manually with password prompt
      console.log("\n   Could not auto-retrieve connection string.");
      console.log("   Opening database settings in browser...\n");
      
      const settingsUrl = `https://app.supabase.com/project/${project.id}/settings/database`;
      try {
        // Open browser to settings page
        const openCmd = process.platform === 'win32' ? 'start' : 
                        process.platform === 'darwin' ? 'open' : 'xdg-open';
        execSync(`${openCmd} "${settingsUrl}"`, { stdio: 'ignore' });
      } catch {
        console.log(`   Visit: ${settingsUrl}`);
      }
      
      console.log("   1. Click 'Connection string'");
      console.log("   2. Select 'Session pooler' (recommended)");
      console.log("   3. Copy the full connection string\n");
      
      connectionString = await question("Paste connection string: ");
      
      if (!connectionString.trim()) {
        console.error("\nNo connection string provided. Exiting.");
        rl.close();
        process.exit(1);
      }
      connectionString = connectionString.trim();
    }

    // Step 7: Update .env.local
    await updateEnvLocal(connectionString);

    // Step 8: Test connection
    const testSuccess = await testConnection();

    console.log("\n" + "=".repeat(60));
    if (testSuccess) {
      console.log("\n   Database setup complete!\n");
      console.log("   Next steps:");
      console.log("   - Run 'npm run setup:auth' to apply migrations");
      console.log("   - Run 'npm run e2e:all' to test everything\n");
    } else {
      console.log("\n   Setup complete but connection test failed.\n");
      console.log("   Troubleshooting:");
      console.log("   - Verify password is correct");
      console.log("   - Try 'Session pooler' connection type");
      console.log("   - Check firewall/network settings\n");
    }

  } catch (error) {
    console.error("\nError:", error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

main();
