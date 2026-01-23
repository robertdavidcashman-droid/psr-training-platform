#!/usr/bin/env node

/**
 * Automated CORS Fix Guide
 * 
 * Provides direct links and step-by-step instructions to fix CORS
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env.local');
let envVars = {};

try {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envVars[key] = value;
    }
  });
} catch (error) {
  envVars = process.env;
}

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const PROJECT_REF = SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'cvsawjrtgmsmadtrfwfa';

console.log('\n🚀 Automated CORS Fix Guide\n');
console.log('='.repeat(60));

// Generate direct links
const dashboardUrl = `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/url-configuration`;
const authSettingsUrl = `https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers`;

console.log('\n📋 Step 1: Open Supabase Dashboard');
console.log(`   Direct link: ${dashboardUrl}`);
console.log('\n   Or manually:');
console.log('   1. Go to: https://supabase.com/dashboard');
console.log(`   2. Select project: ${PROJECT_REF}`);
console.log('   3. Navigate to: Authentication → URL Configuration');

console.log('\n📋 Step 2: Configure URLs');
console.log('\n   Site URL:');
console.log('   ┌─────────────────────────────────────┐');
console.log('   │ https://psrtrain.com                 │');
console.log('   └─────────────────────────────────────┘');
console.log('\n   Redirect URLs (add each on a new line):');
console.log('   ┌─────────────────────────────────────┐');
console.log('   │ https://psrtrain.com/dashboard       │');
console.log('   │ https://psrtrain.com/**              │');
console.log('   │ https://*.vercel.app/**              │');
console.log('   └─────────────────────────────────────┘');

console.log('\n📋 Step 3: Save and Wait');
console.log('   1. Click "Save"');
console.log('   2. Wait 1-2 minutes for changes to propagate');

console.log('\n📋 Step 4: Verify Configuration');
console.log('   Run: npm run diagnose:auth');
console.log('   Or test manually at: https://psrtrain.com/login');

// Try to open browser (optional)
console.log('\n🌐 Attempting to open Supabase Dashboard...');
try {
  const platform = process.platform;
  let command;
  
  if (platform === 'win32') {
    command = `start "" "${dashboardUrl}"`;
  } else if (platform === 'darwin') {
    command = `open "${dashboardUrl}"`;
  } else {
    command = `xdg-open "${dashboardUrl}"`;
  }
  
  await execAsync(command);
  console.log('✅ Opened Supabase Dashboard in your browser');
} catch (error) {
  console.log('⚠️  Could not open browser automatically');
  console.log(`   Please manually visit: ${dashboardUrl}`);
}

console.log('\n' + '='.repeat(60));
console.log('📝 Quick Copy-Paste Configuration');
console.log('='.repeat(60));
console.log('\nSite URL:');
console.log('https://psrtrain.com');
console.log('\nRedirect URLs (copy all):');
console.log('https://psrtrain.com/dashboard');
console.log('https://psrtrain.com/**');
console.log('https://*.vercel.app/**');
console.log('\n' + '='.repeat(60));
console.log('\n✅ After configuring, wait 1-2 minutes, then test at:');
console.log('   https://psrtrain.com/login\n');
