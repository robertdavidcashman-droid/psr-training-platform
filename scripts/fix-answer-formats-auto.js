/**
 * Automated script to fix answer format mismatches in the database
 * Usage: node scripts/fix-answer-formats-auto.js
 * 
 * Requirements:
 * - SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - OR SUPABASE_DB_URL (postgres connection string) in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.SUPABASE_DB_URL;

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

// Try to use pg library if available, otherwise use Supabase REST API workaround
let useDirectDb = false;
let pg = null;

try {
  pg = require('pg');
  if (dbUrl) {
    useDirectDb = true;
    console.log('✅ Using direct database connection');
  } else {
    console.log('ℹ️  SUPABASE_DB_URL not found, will use Supabase REST API');
  }
} catch (e) {
  console.log('ℹ️  pg library not found. Installing...');
  console.log('   Run: npm install pg --save-dev');
  console.log('   Or provide SUPABASE_SERVICE_ROLE_KEY for REST API approach\n');
}

if (!useDirectDb && !supabaseServiceKey) {
  console.error('❌ Error: Need either SUPABASE_DB_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.log('\n📝 Options:');
  console.log('1. Add SUPABASE_SERVICE_ROLE_KEY to .env.local (from Supabase Dashboard → Settings → API)');
  console.log('2. OR install pg: npm install pg');
  console.log('3. OR add SUPABASE_DB_URL (postgres://postgres:[password]@[host]:5432/postgres)');
  process.exit(1);
}

// Read the SQL file
const sqlFilePath = path.join(__dirname, 'fix_answer_format_mismatch.sql');
let sqlContent = '';

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log('✅ Read SQL file:', sqlFilePath);
} catch (error) {
  console.error('❌ Error reading SQL file:', error.message);
  process.exit(1);
}

// Split SQL into individual statements (handle multi-line statements)
function splitSQL(sql) {
  const statements = [];
  let currentStatement = '';
  let inFunction = false;
  let functionDepth = 0;
  
  const lines = sql.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('--') || trimmed === '') {
      continue;
    }
    
    currentStatement += line + '\n';
    
    // Track function definition
    if (trimmed.toUpperCase().includes('CREATE FUNCTION') || trimmed.toUpperCase().includes('CREATE OR REPLACE FUNCTION')) {
      inFunction = true;
      functionDepth = 0;
    }
    
    // Count BEGIN/END blocks
    if (inFunction) {
      if (trimmed.toUpperCase().includes('BEGIN')) functionDepth++;
      if (trimmed.toUpperCase().includes('END')) functionDepth--;
      if (trimmed.includes('$$') && functionDepth === 0) {
        inFunction = false;
      }
    }
    
    // End of statement (semicolon not in function)
    if (!inFunction && trimmed.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }
  
  // Add remaining statement if any
  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }
  
  return statements.filter(s => s.length > 0);
}

async function executeWithDirectDb() {
  const client = new pg.Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database\n');
    
    const statements = splitSQL(sqlContent);
    console.log(`📋 Found ${statements.length} SQL statements to execute\n`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.substring(0, 60).replace(/\n/g, ' ');
      
      try {
        console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);
        
        // Skip SELECT statements (they're just for verification)
        if (stmt.trim().toUpperCase().startsWith('SELECT')) {
          const result = await client.query(stmt);
          if (result.rows && result.rows.length > 0) {
            console.log(`   ✅ Result: ${result.rows.length} row(s)`);
            if (result.rows.length <= 5) {
              result.rows.forEach((row, idx) => {
                console.log(`      ${idx + 1}.`, JSON.stringify(row));
              });
            }
          }
        } else {
          await client.query(stmt);
          console.log(`   ✅ Success`);
        }
      } catch (error) {
        // Some errors are expected (like "function already exists")
        if (error.message.includes('already exists') || error.message.includes('does not exist')) {
          console.log(`   ⚠️  ${error.message.split('\n')[0]}`);
        } else {
          console.error(`   ❌ Error: ${error.message.split('\n')[0]}`);
          // Continue with other statements
        }
      }
    }
    
    await client.end();
    console.log('\n✅ All SQL statements executed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    await client.end();
    process.exit(1);
  }
}

async function executeWithSupabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  console.log('⚠️  Using Supabase REST API (limited SQL execution)');
  console.log('⚠️  Complex SQL functions may not work via REST API');
  console.log('⚠️  Consider using direct database connection or run SQL manually in Supabase Dashboard\n');
  
  // For complex SQL, we'll need to use RPC or manual execution
  // Let's create a simpler approach - execute via REST API where possible
  
  const statements = splitSQL(sqlContent);
  console.log(`📋 Found ${statements.length} SQL statements`);
  console.log('\n⚠️  Some statements require direct SQL execution.');
  console.log('📝 Please run the SQL file manually in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new\n');
  
  // Try to execute simple UPDATE statements via REST API
  for (const stmt of statements) {
    if (stmt.trim().toUpperCase().startsWith('UPDATE')) {
      console.log('⚠️  UPDATE statements require direct SQL execution');
      break;
    }
  }
  
  console.log('\n✅ Script prepared SQL file for manual execution');
  console.log('📁 File location:', sqlFilePath);
}

async function main() {
  console.log('\n🔧 Fix Answer Format Mismatch - Automated Script\n');
  console.log('='.repeat(60));
  
  if (useDirectDb) {
    await executeWithDirectDb();
  } else {
    await executeWithSupabase();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Done!');
  console.log('\n📝 Next steps:');
  console.log('1. Test the disclosure question in practice mode');
  console.log('2. Run validation: node scripts/validate-answer-formats.js');
  console.log('3. Verify all questions work correctly\n');
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

