#!/usr/bin/env node

/**
 * Fix Production Supabase URL
 * Removes the old URL and adds the correct one
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const CORRECT_URL = 'https://cvsawjrtgmsmadtrfwfa.supabase.co';
const WRONG_URL_PATTERN = /cvsawjrtgmsmadtfwfa/;

console.log('\n🔧 Fixing Production Supabase URL...\n');

try {
  // Step 1: Remove old URL
  console.log('Step 1: Removing old NEXT_PUBLIC_SUPABASE_URL from Production...');
  try {
    execSync('npx vercel env rm NEXT_PUBLIC_SUPABASE_URL production --yes', { 
      encoding: 'utf-8',
      stdio: 'inherit'
    });
    console.log('✅ Removed old URL\n');
  } catch (error) {
    console.log('⚠️  Error removing (may not exist):', error.message);
  }

  // Step 2: Add correct URL
  console.log(`Step 2: Adding correct URL: ${CORRECT_URL}`);
  console.log('   (This will prompt you to paste the URL - paste the URL above)\n');
  
  // Note: We can't fully automate this because vercel env add requires interactive input
  // But we can provide clear instructions
  console.log('📋 Manual Step Required:');
  console.log('   1. Run: npx vercel env add NEXT_PUBLIC_SUPABASE_URL production');
  console.log(`   2. When prompted for "Value", paste: ${CORRECT_URL}`);
  console.log('   3. Press Enter');
  console.log('\n   Or use the Vercel Dashboard:');
  console.log('   https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
  console.log(`   Add: NEXT_PUBLIC_SUPABASE_URL = ${CORRECT_URL} (Production)`);
  
  console.log('\n✅ After updating, run: npx vercel --prod');
  console.log('   Then test: https://psrtrain.com/api/debug/env-check\n');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
