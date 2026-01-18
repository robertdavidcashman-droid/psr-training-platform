#!/usr/bin/env node

/**
 * Doctor script - comprehensive validation and repair
 * 1. Run autofix loop until PASS or BLOCKED
 * 2. Run unit tests
 * 3. Run E2E tests
 * 4. Print final status
 */

import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import net from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const MAX_AUTOFIX_ITERATIONS = 3;
let iteration = 0;

function runCommand(command, description) {
  try {
    console.log(`\n${description}...`);
    execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env },
    });
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

function canRun(cmd) {
  try {
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getDockerCmd() {
  if (canRun('docker version')) return 'docker';
  const dockerExe = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe';
  if (existsSync(dockerExe)) return `"${dockerExe}"`;
  return null;
}

async function pickFreePort(preferredPort = 3000) {
  for (let port = preferredPort; port < preferredPort + 20; port++) {
    const ok = await new Promise((resolve) => {
      const srv = net.createServer();
      srv.once('error', () => resolve(false));
      srv.listen(port, '127.0.0.1', () => {
        srv.close(() => resolve(true));
      });
    });
    if (ok) return port;
  }
  return preferredPort;
}

function startDevServer(port) {
  return spawn(`npx next dev -p ${port}`, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });
}

function stopDevServer(child) {
  if (!child) return;
  try {
    child.kill('SIGTERM');
  } catch {}
}

async function checkHealthEndpoint(baseUrl, timeoutMs = 60_000) {
  try {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try {
        const response = await fetch(`${baseUrl}/api/health`);
        const data = await response.json();
        if (response.ok && data.status === 'ok') return true;
      } catch {
        // ignore until server is ready
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
    return false;
  } catch {
    return false;
  }
}

async function runAutofixLoop() {
  console.log('🔧 Starting autofix loop...\n');

  for (let i = 0; i < MAX_AUTOFIX_ITERATIONS; i++) {
    iteration = i + 1;
    console.log(`\n--- Autofix iteration ${iteration}/${MAX_AUTOFIX_ITERATIONS} ---\n`);

    // Run autofix
    const autofixSuccess = runCommand('npm run autofix', 'Running autofix');
    
    // Run preflight to check if we're done
    const preflightSuccess = runCommand('npm run preflight', 'Running preflight');

    if (preflightSuccess) {
      console.log('\n✅ Autofix loop PASSED (preflight succeeded)');
      return true;
    }

    if (i === MAX_AUTOFIX_ITERATIONS - 1) {
      console.log(`\n⚠️  Reached max iterations (${MAX_AUTOFIX_ITERATIONS})`);
    }
  }

  return false;
}

async function main() {
  console.log('🏥 Doctor: Comprehensive validation and repair\n');
  console.log('=' .repeat(60));

  // Hard BLOCKED dependency for local Supabase
  const dockerCmd = getDockerCmd();
  if (!dockerCmd) {
    console.log('\n❌ BLOCKED: Docker CLI not found (docker.exe not on PATH).');
    console.log('   Add to PATH: C:\\Program Files\\Docker\\Docker\\resources\\bin');
    console.log('   Then restart your terminal and re-run: npm run doctor');
    process.exit(1);
  }

  if (!canRun(`${dockerCmd} version`)) {
    console.log('\n❌ BLOCKED: Docker Desktop installed but engine not running or not accessible.');
    console.log('   Start Docker Desktop and wait until “Engine running”.');
    process.exit(1);
  }

  if (!canRun('supabase --version')) {
    console.log('\n❌ BLOCKED: Supabase CLI is required for local Supabase.');
    console.log('   Install: https://supabase.com/docs/guides/cli');
    process.exit(1);
  }

  // Step 1: Autofix loop (will run preflight internally)
  const autofixPassed = await runAutofixLoop();

  // Step 2: Unit tests (required)
  console.log('\n' + '='.repeat(60));
  console.log('🧪 Running unit tests...\n');
  const unitPassed = runCommand('npm run test', 'Running unit tests');

  // Step 3: E2E tests (required)
  console.log('\n' + '='.repeat(60));
  console.log('🎭 Running E2E tests...\n');

  // Ensure Playwright browser is available (chromium only)
  runCommand('npx playwright install chromium', 'Ensuring Playwright browser installed');

  const port = await pickFreePort(3000);
  const baseUrl = `http://localhost:${port}`;

  // Ensure Playwright points to the correct dev server
  process.env.E2E_BASE_URL = baseUrl;

  const server = startDevServer(port);
  let e2ePassed = false;
  try {
    const healthOk = await checkHealthEndpoint(baseUrl, 120_000);
    if (!healthOk) {
      console.error('\n❌ BLOCKED: Dev server up but /api/health never became ok');
      e2ePassed = false;
    } else {
      e2ePassed = runCommand('npm run e2e', 'Running Playwright E2E');
    }
  } finally {
    stopDevServer(server);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Doctor Summary:\n');

  const allPassed = autofixPassed && unitPassed && e2ePassed;
  if (allPassed) {
    console.log('✅ PASS\n');
    console.log('Evidence:');
    console.log('  - npm run check: ✅');
    console.log('  - npm run test: ✅');
    console.log('  - npm run e2e: ✅');
    console.log('  - /api/health: ✅');
    process.exit(0);
  }

  console.log('❌ BLOCKED\n');
  if (!autofixPassed) console.log('  - Preflight/autofix did not reach PASS');
  if (!unitPassed) console.log('  - Unit tests failed');
  if (!e2ePassed) console.log('  - E2E tests failed');
  process.exit(1);
}

main().catch(error => {
  console.error('Doctor error:', error);
  process.exit(1);
});
