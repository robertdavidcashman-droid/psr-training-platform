#!/usr/bin/env node

/**
 * Automatically apply healthcheck migration to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load environment variables
import { readFileSync as fsReadFileSync, existsSync } from 'fs';

function loadEnv() {
  const envPath = join(projectRoot, '.env.local');
  
  const env = {};
  if (existsSync(envPath)) {
    const content = fsReadFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
          env[key.trim()] = value;
        }
      }
    });
  }
  
  return env;
}

async function main() {
  console.log('\n🔧 Applying healthcheck migration...\n');
  
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }
  
  // Use service role key if available (for admin operations), otherwise use anon key
  const key = serviceRoleKey || supabaseAnonKey;
  const supabase = createClient(supabaseUrl, key);
  
  // Read migration SQL
  const migrationPath = join(projectRoot, 'supabase', 'migrations', '20250118000000_healthcheck.sql');
  const migrationSQL = fsReadFileSync(migrationPath, 'utf-8');
  
  try {
    // Execute migration via RPC or direct SQL
    // Note: Supabase doesn't allow direct SQL execution via REST API
    // We'll need to use the SQL Editor or provide instructions
    
    // Try to check if table exists first
    const { data: existing, error: checkError } = await supabase
      .from('healthcheck')
      .select('id')
      .eq('id', 1)
      .single();
    
    if (existing) {
      console.log('✅ Healthcheck table already exists');
      return;
    }
    
    if (checkError && checkError.code === 'PGRST204') {
      console.log('📝 Healthcheck table does not exist');
      console.log('\n⚠️  Cannot apply migration automatically via REST API');
      console.log('📋 Please run this SQL in Supabase SQL Editor:\n');
      console.log('─'.repeat(60));
      console.log(migrationSQL);
      console.log('─'.repeat(60));
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new');
      console.log('   Then paste the SQL above and click "Run"\n');
    } else {
      console.error('❌ Error checking table:', checkError?.message);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('─'.repeat(60));
    console.log(migrationSQL);
    console.log('─'.repeat(60));
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new');
  }
}

main().catch(console.error);
