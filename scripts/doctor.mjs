#!/usr/bin/env node

/**
 * PSR Training Academy - Doctor Script
 * 
 * One-command diagnostic tool that runs all checks and reports PASS/FAIL.
 * Usage: npm run doctor
 */

import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, status, message = "") {
  const icon = status === "pass" ? "✓" : status === "fail" ? "✗" : "○";
  const color = status === "pass" ? colors.green : status === "fail" ? colors.red : colors.yellow;
  const suffix = message ? ` ${colors.dim}(${message})${colors.reset}` : "";
  console.log(`  ${color}${icon}${colors.reset} ${step}${suffix}`);
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd: projectRoot,
      shell: true,
      stdio: options.silent ? "pipe" : "inherit",
      ...options,
    });

    let stdout = "";
    let stderr = "";

    if (options.silent) {
      proc.stdout?.on("data", (data) => {
        stdout += data.toString();
      });
      proc.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
    }

    proc.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });

    proc.on("error", (err) => {
      resolve({ code: 1, stdout, stderr: err.message });
    });
  });
}

async function checkNodeVersion() {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  return { pass: major >= 20, message: nodeVersion };
}

async function checkPackageJson() {
  const packagePath = join(projectRoot, "package.json");
  if (!existsSync(packagePath)) {
    return { pass: false, message: "package.json not found" };
  }
  try {
    const pkg = JSON.parse(readFileSync(packagePath, "utf-8"));
    return { pass: true, message: `v${pkg.version}` };
  } catch {
    return { pass: false, message: "Invalid package.json" };
  }
}

async function checkContentFiles() {
  const files = ["topics.json", "questions.json", "scenarios.json"];
  const contentDir = join(projectRoot, "content");
  
  for (const file of files) {
    const filePath = join(contentDir, file);
    if (!existsSync(filePath)) {
      return { pass: false, message: `Missing ${file}` };
    }
    try {
      JSON.parse(readFileSync(filePath, "utf-8"));
    } catch {
      return { pass: false, message: `Invalid ${file}` };
    }
  }
  return { pass: true, message: `${files.length} files valid` };
}

async function checkEnvVars() {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  return {
    pass: true, // Pass even without OpenAI (fallback exists)
    message: hasOpenAI ? "OpenAI configured" : "OpenAI not configured (using fallback)",
  };
}

async function runLint() {
  log("\n📋 Running ESLint...", colors.blue);
  const result = await runCommand("npm", ["run", "lint"], { silent: true });
  return { pass: result.code === 0, message: result.code === 0 ? "No errors" : "Errors found" };
}

async function runTypeCheck() {
  log("\n📝 Running TypeScript check...", colors.blue);
  const result = await runCommand("npm", ["run", "typecheck"], { silent: true });
  return { pass: result.code === 0, message: result.code === 0 ? "No errors" : "Type errors found" };
}

async function runBuild() {
  log("\n🔨 Running build...", colors.blue);
  const result = await runCommand("npm", ["run", "build"], { silent: true });
  return { pass: result.code === 0, message: result.code === 0 ? "Build successful" : "Build failed" };
}

async function runUnitTests() {
  log("\n🧪 Running unit tests...", colors.blue);
  const result = await runCommand("npm", ["run", "test"], { silent: true });
  return { pass: result.code === 0, message: result.code === 0 ? "All tests passed" : "Tests failed" };
}

async function main() {
  console.log("\n");
  log("╔═══════════════════════════════════════════════════════════╗", colors.blue);
  log("║         PSR Training Academy - Doctor Diagnostics         ║", colors.blue);
  log("╚═══════════════════════════════════════════════════════════╝", colors.blue);
  console.log("");

  const results = [];
  let hasFailure = false;

  // Pre-flight checks
  log("🔍 Pre-flight checks", colors.bold);
  
  const nodeCheck = await checkNodeVersion();
  logStep("Node.js version", nodeCheck.pass ? "pass" : "fail", nodeCheck.message);
  results.push({ name: "Node.js", ...nodeCheck });
  if (!nodeCheck.pass) hasFailure = true;

  const packageCheck = await checkPackageJson();
  logStep("package.json", packageCheck.pass ? "pass" : "fail", packageCheck.message);
  results.push({ name: "package.json", ...packageCheck });
  if (!packageCheck.pass) hasFailure = true;

  const contentCheck = await checkContentFiles();
  logStep("Content files", contentCheck.pass ? "pass" : "fail", contentCheck.message);
  results.push({ name: "Content files", ...contentCheck });
  if (!contentCheck.pass) hasFailure = true;

  const envCheck = await checkEnvVars();
  logStep("Environment", envCheck.pass ? "pass" : "warn", envCheck.message);
  results.push({ name: "Environment", ...envCheck });

  // Code quality checks
  log("\n⚡ Code quality", colors.bold);

  const lintResult = await runLint();
  logStep("ESLint", lintResult.pass ? "pass" : "fail", lintResult.message);
  results.push({ name: "ESLint", ...lintResult });
  if (!lintResult.pass) hasFailure = true;

  const typeResult = await runTypeCheck();
  logStep("TypeScript", typeResult.pass ? "pass" : "fail", typeResult.message);
  results.push({ name: "TypeScript", ...typeResult });
  if (!typeResult.pass) hasFailure = true;

  // Build
  log("\n🏗️  Build", colors.bold);

  const buildResult = await runBuild();
  logStep("Next.js build", buildResult.pass ? "pass" : "fail", buildResult.message);
  results.push({ name: "Build", ...buildResult });
  if (!buildResult.pass) hasFailure = true;

  // Unit tests
  log("\n🧪 Tests", colors.bold);

  const testResult = await runUnitTests();
  logStep("Unit tests", testResult.pass ? "pass" : "fail", testResult.message);
  results.push({ name: "Unit tests", ...testResult });
  if (!testResult.pass) hasFailure = true;

  // Summary
  console.log("\n");
  log("═══════════════════════════════════════════════════════════", colors.dim);
  
  const passCount = results.filter((r) => r.pass).length;
  const failCount = results.filter((r) => !r.pass).length;

  if (hasFailure) {
    log(`\n  ❌ FAIL - ${failCount} check(s) failed, ${passCount} passed\n`, colors.red);
    log("  Run the following to see details:", colors.dim);
    log("    npm run lint     - Check for lint errors", colors.dim);
    log("    npm run typecheck - Check for type errors", colors.dim);
    log("    npm run build    - Check build output", colors.dim);
    log("    npm run test     - Run unit tests\n", colors.dim);
    process.exit(1);
  } else {
    log(`\n  ✅ PASS - All ${passCount} checks passed!\n`, colors.green);
    log("  The app is ready for deployment.", colors.dim);
    log("  Run 'npm run e2e' for end-to-end tests.\n", colors.dim);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Doctor script failed:", err);
  process.exit(1);
});
