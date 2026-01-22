#!/usr/bin/env node
/**
 * Cross-platform Playwright webServer command:
 * - Builds once
 * - Starts Next.js in production mode on port 3000
 */

import { spawn } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Load environment variables from .env.local if it exists
try {
  const envFile = readFileSync(join(projectRoot, ".env.local"), "utf-8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
} catch {
  // .env.local doesn't exist, that's okay
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, {
      shell: true,
      stdio: "inherit",
      ...opts,
    });
    p.on("close", (code) => resolve(code ?? 1));
    p.on("error", () => resolve(1));
  });
}

if (!process.env.E2E_SKIP_BUILD) {
  const buildCode = await run("npm", ["run", "build"]);
  if (buildCode !== 0) process.exit(buildCode);
}

// Keep the process alive for Playwright to manage.
const startCode = await run("npm", ["run", "start", "--", "-p", "3000"]);
process.exit(startCode);

