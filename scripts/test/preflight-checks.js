/**
 * Pre-flight checks: Build system, environment, dependencies, configuration
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  // Check .env.local
  const envPath = path.join(projectRoot, '.env.local');
  if (fs.existsSync(envPath)) {
    results.passed++;
    
    // Check if it has required variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ];
    
    let missingVars = [];
    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        missingVars.push(varName);
      }
    }
    
    if (missingVars.length > 0) {
      results.failed++;
      results.issues.push({
        type: 'P0',
        issue: `Missing environment variables: ${missingVars.join(', ')}`,
        file: '.env.local',
      });
    } else {
      results.passed++;
    }
  } else {
    results.failed++;
    results.issues.push({
      type: 'P0',
      issue: 'Missing .env.local file',
      file: '.env.local',
    });
  }

  // Check TypeScript compilation
  try {
    execSync('npx tsc --noEmit', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 60000,
    });
    results.passed++;
  } catch (error) {
    results.failed++;
    results.issues.push({
      type: 'P0',
      issue: 'TypeScript compilation errors',
      details: error.message,
    });
  }

  // Check Next.js build (dry run)
  try {
    execSync('npm run build', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 120000,
      env: { ...process.env, CI: 'true' },
    });
    results.passed++;
  } catch (error) {
    results.failed++;
    results.issues.push({
      type: 'P0',
      issue: 'Next.js build failed',
      details: error.message,
    });
  }

  // Check linter
  try {
    execSync('npm run lint', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 60000,
    });
    results.passed++;
  } catch (error) {
    results.failed++;
    results.issues.push({
      type: 'P1',
      issue: 'Linter errors found',
      details: error.message,
    });
  }

  // Check configuration files
  const configFiles = [
    { file: 'next.config.mjs', type: 'P0' },
    { file: 'tsconfig.json', type: 'P0' },
    { file: 'tailwind.config.ts', type: 'P0' },
    { file: 'middleware.ts', type: 'P0' },
    { file: 'package.json', type: 'P0' },
  ];

  for (const { file, type } of configFiles) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
      
      // Validate JSON files
      if (file.endsWith('.json')) {
        try {
          JSON.parse(fs.readFileSync(filePath, 'utf8'));
          results.passed++;
        } catch (e) {
          results.failed++;
          results.issues.push({
            type,
            issue: `Invalid JSON in ${file}`,
            file,
          });
        }
      }
    } else {
      results.failed++;
      results.issues.push({
        type,
        issue: `Missing ${file}`,
        file,
      });
    }
  }

  // Check dependencies are installed
  const nodeModulesPath = path.join(projectRoot, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    results.passed++;
  } else {
    results.failed++;
    results.issues.push({
      type: 'P0',
      issue: 'node_modules not found - run npm install',
    });
  }

  return results;
}

module.exports = { run };
