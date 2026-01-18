#!/usr/bin/env node

/**
 * Preflight checks - run basic validation
 * - Require Docker Desktop + Supabase CLI (for local Supabase)
 * - Start local Supabase and apply migrations
 * - Write .env.local with local anon URL/key (no service role key)
 * - Start Next dev server and require /api/health = ok
 * - Run npm run check (lint, typecheck, build)
 */

import { execSync, spawn, spawnSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import net from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: projectRoot, stdio: 'inherit', ...opts });
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

  // Docker Desktop default install path on Windows.
  const dockerExe = 'C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe';
  if (existsSync(dockerExe)) return `"${dockerExe}"`;

  return null;
}

function blocked(message, steps = []) {
  console.error(`\n❌ BLOCKED: ${message}\n`);
  if (steps.length) {
    console.error('Steps:');
    for (const s of steps) console.error(`- ${s}`);
    console.error('');
  }
  process.exit(1);
}

function parseEnv(content) {
  const map = new Map();
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) map.set(key, value);
  }
  return map;
}

function upsertEnvFile(filePath, updates) {
  const existing = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
  const map = parseEnv(existing);
  for (const [k, v] of Object.entries(updates)) map.set(k, v);
  const lines = [];
  for (const [k, v] of map.entries()) lines.push(`${k}=${v}`);
  lines.sort((a, b) => a.localeCompare(b));
  writeFileSync(filePath, lines.join('\n') + '\n');
}

function getSupabaseStatusJson() {
  const result = spawnSync('supabase status --output json', {
    cwd: projectRoot,
    shell: true,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  // Supabase CLI may print warnings to stderr even on success.
  // Only parse stdout for JSON.
  const stdout = String(result.stdout || '');
  const jsonStart = stdout.indexOf('{');
  const jsonEnd = stdout.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null;

  const jsonText = stdout.slice(jsonStart, jsonEnd + 1);
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

function startDevServer() {
  // Use shell so this works cross-platform (Windows uses npx.cmd).
  const child = spawn('npx next dev -p 3000', {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });
  return child;
}

async function waitForHealthOk(baseUrl, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/api/health`, { method: 'GET' });
      const json = await res.json();
      if (res.ok && json?.status === 'ok') return { ok: true, json };
    } catch {
      // ignore until server is up
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  // Return last health payload if possible
  try {
    const res = await fetch(`${baseUrl}/api/health`, { method: 'GET' });
    const json = await res.json();
    return { ok: false, json };
  } catch {
    return { ok: false, json: { error: 'Timed out waiting for /api/health' } };
  }
}

function stopDevServer(child) {
  if (!child) return;
  try {
    child.kill('SIGTERM');
  } catch {}
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

async function main() {
  console.log('🔍 Running preflight checks...\n');

  // Docker Desktop is required for Supabase local on Windows/macOS.
  const dockerCmd = getDockerCmd();
  if (!dockerCmd) {
    blocked('Docker Desktop CLI (docker.exe) not found on PATH.', [
      'Install Docker Desktop: https://docs.docker.com/desktop',
      'Restart your terminal after install (PATH updates)',
      'Or add this to PATH: C:\\Program Files\\Docker\\Docker\\resources\\bin',
      'Re-run: npm run doctor',
    ]);
  }

  if (!canRun(`${dockerCmd} version`)) {
    blocked('Docker Desktop is installed but the engine is not running or not accessible.', [
      'Start Docker Desktop and wait until “Engine running”',
      'If prompted, enable WSL2 backend',
      'Re-run: npm run doctor',
    ]);
  }

  if (!canRun('supabase --version')) {
    blocked('Supabase CLI is required for local Supabase.', [
      'Install Supabase CLI: https://supabase.com/docs/guides/cli',
      'Re-run: npm run doctor',
    ]);
  }

  // Ensure local supabase is running
  console.log('🚀 Starting Supabase (local)...');
  run('supabase start');

  const status = getSupabaseStatusJson();
  const apiUrl = status?.API_URL;
  const anonKey = status?.ANON_KEY;
  if (!apiUrl || !anonKey) {
    blocked('Could not read local Supabase credentials from `supabase status`.', [
      'Run: supabase status',
      'Ensure local Supabase started successfully',
    ]);
  }

  // Write env safely (anon only)
  const envPath = join(projectRoot, '.env.local');
  const port = await pickFreePort(3000);
  const baseUrl = `http://localhost:${port}`;

  upsertEnvFile(envPath, {
    NEXT_PUBLIC_SUPABASE_URL: apiUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_SITE_URL: baseUrl,
  });

  console.log('🔄 Resetting database (apply migrations)...');
  try {
    run('supabase db reset --yes');
  } catch {
    // Some CLI versions don't support --yes
    run('supabase db reset');
  }

  console.log(`▶ Starting Next dev server on ${baseUrl}...`);
  const server = spawn(`npx next dev -p ${port}`, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });

  try {
    const health = await waitForHealthOk(baseUrl, 120_000);
    if (!health.ok) {
      console.error('\n❌ Preflight failed: /api/health did not return status=ok');
      console.error(JSON.stringify(health.json, null, 2));
      process.exit(1);
    }

    console.log('\n✅ /api/health OK');
  } finally {
    stopDevServer(server);
  }

  console.log('\n🧹 Running npm run check...');
  run('npm run check');

  console.log('\n✅ Preflight PASS');
  process.exit(0);
}

main().catch(error => {
  console.error('Preflight error:', error);
  process.exit(1);
});
