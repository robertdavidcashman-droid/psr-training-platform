#!/usr/bin/env node

/**
 * Fix Supabase URL in Vercel Environment Variables
 * 
 * This script helps fix the typo in NEXT_PUBLIC_SUPABASE_URL
 * Current (WRONG): cvsawjrtgmsmadtfwfa.supabase.co (missing 'r')
 * Correct:         cvsawjrtgmsmadtrfwfa.supabase.co
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load from .env.local if available
const envPath = join(__dirname, '..', '.env.local');
let correctUrl = null;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  if (match) {
    correctUrl = match[1].trim().replace(/^["']|["']$/g, '');
  }
} catch (error) {
  console.log('⚠️  Could not read .env.local');
}

if (!correctUrl) {
  // Use the correct URL based on documentation
  correctUrl = 'https://cvsawjrtgmsmadtrfwfa.supabase.co';
}

console.log('\n🔧 Supabase URL Fix Script\n');
console.log('='.repeat(60));
console.log(`Correct URL: ${correctUrl}`);
console.log('='.repeat(60));
console.log('\n📋 Steps to Fix:\n');

console.log('Option 1: Update via Vercel Dashboard (Recommended)');
console.log('  1. Go to: https://vercel.com/dashboard');
console.log('  2. Select your project: pstrain-rebuild');
console.log('  3. Go to: Settings → Environment Variables');
console.log('  4. Find: NEXT_PUBLIC_SUPABASE_URL (Production)');
console.log('  5. Click Edit');
console.log(`  6. Set value to: ${correctUrl}`);
console.log('  7. Save');
console.log('  8. Redeploy: npx vercel --prod\n');

console.log('Option 2: Update via CLI');
console.log('  1. Remove old value:');
console.log('     npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production');
console.log('  2. Add correct value:');
console.log(`     npx vercel env add NEXT_PUBLIC_SUPABASE_URL production`);
console.log('     (When prompted, paste the URL above)');
console.log('  3. Redeploy:');
console.log('     npx vercel --prod\n');

console.log('⚠️  IMPORTANT: After updating, you MUST redeploy for changes to take effect!\n');

// Ask if user wants to proceed with CLI method
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to update via CLI now? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🔄 Updating environment variable...\n');
    try {
      console.log('Step 1: Removing old value...');
      execSync('npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes', { stdio: 'inherit' });
      
      console.log('\nStep 2: Adding correct value...');
      console.log(`Please paste this URL when prompted: ${correctUrl}`);
      execSync(`echo ${correctUrl} | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production`, { stdio: 'inherit' });
      
      console.log('\n✅ Environment variable updated!');
      console.log('📦 Next step: Redeploy with: npx vercel --prod');
    } catch (error) {
      console.error('\n❌ Error updating environment variable:', error.message);
      console.log('\n💡 Please update manually via Vercel Dashboard (see Option 1 above)');
    }
  } else {
    console.log('\n✅ Please follow the manual steps above to fix the URL.');
  }
  
  rl.close();
});
