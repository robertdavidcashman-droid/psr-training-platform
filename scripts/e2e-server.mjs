#!/usr/bin/env node
/**
 * Cross-platform Playwright webServer command:
 * - Builds once
 * - Starts Next.js in production mode on port 3000
 */

import { spawn } from "child_process";

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

