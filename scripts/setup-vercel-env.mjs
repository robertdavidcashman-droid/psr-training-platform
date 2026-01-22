#!/usr/bin/env node

/**
 * Vercel Environment Variables Setup Script
 * 
 * This script helps you set environment variables in Vercel.
 * It will prompt you for the values and set them automatically.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log('🚀 Vercel Environment Variables Setup\n');

// Check if .env.local exists
let envLocal = {};
try {
  const envContent = readFileSync(join(projectRoot, '.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      envLocal[key] = value;
    }
  });
  console.log('📄 Found .env.local file\n');
} catch (error) {
  console.log('⚠️  No .env.local file found. You will need to enter values manually.\n');
}

const envVars = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase Project URL',
    example: 'https://xxxxx.supabase.co'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase Anonymous Key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
];

console.log('This script will set environment variables in Vercel for all environments (production, preview, development).\n');
console.log('You can find these values in your Supabase Dashboard:\n');
console.log('  - Go to: https://supabase.com/dashboard/project/_/settings/api');
console.log('  - Copy the "Project URL" and "anon public" key\n');

for (const envVar of envVars) {
  const existingValue = envLocal[envVar.key];
  
  if (existingValue) {
    console.log(`\n✅ Found ${envVar.key} in .env.local`);
    console.log(`   Value: ${existingValue.substring(0, 30)}...`);
    
    const useExisting = process.argv.includes('--use-local') || process.argv.includes('-y');
    
    if (useExisting) {
      console.log(`\n📤 Setting ${envVar.key} in Vercel...`);
      try {
        // Set for all environments
        ['production', 'preview', 'development'].forEach(env => {
          try {
            execSync(`npx vercel env add ${envVar.key} ${env} <<< "${existingValue}"`, {
              stdio: 'inherit',
              shell: true
            });
            console.log(`   ✅ Set for ${env}`);
          } catch (error) {
            // Variable might already exist, try to update it
            console.log(`   ⚠️  ${envVar.key} might already exist for ${env}. Skipping...`);
          }
        });
      } catch (error) {
        console.log(`   ❌ Failed to set ${envVar.key}. You may need to set it manually.`);
        console.log(`   Run: npx vercel env add ${envVar.key}`);
      }
    } else {
      console.log(`\n💡 To automatically set this in Vercel, run:`);
      console.log(`   node scripts/setup-vercel-env.mjs --use-local`);
    }
  } else {
    console.log(`\n❌ ${envVar.key} not found in .env.local`);
    console.log(`   Description: ${envVar.description}`);
    console.log(`   Example: ${envVar.example}`);
    console.log(`\n   To set manually, run:`);
    console.log(`   npx vercel env add ${envVar.key}`);
  }
}

console.log('\n📋 Summary:');
console.log('   After setting environment variables, redeploy your application:');
console.log('   npx vercel --prod\n');
