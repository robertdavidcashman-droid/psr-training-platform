/**
 * Automated script to run all fixes via Supabase REST API
 * This attempts to apply fixes automatically without manual SQL execution
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Known Supabase URL
const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';

// Get anon key from command line or try to read
let anonKey = process.argv[2];

if (!anonKey) {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+?)(\r?\n|$)/);
      if (match) {
        anonKey = match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // Ignore
  }
}

if (!anonKey) {
  console.error('\n❌ Supabase Anon Key required');
  console.error('\n📝 Usage: node scripts/run-all-fixes-auto.js <your-anon-key>');
  console.error('   Or ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is in .env.local\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, anonKey);

async function runAllFixes() {
  console.log('\n🚀 Running All Fixes Automatically\n');
  console.log('='.repeat(60));
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('='.repeat(60));
  
  try {
    // Read the combined SQL file
    const sqlPath = path.join(__dirname, 'RUN_ALL_FIXES.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ RUN_ALL_FIXES.sql not found');
      console.error('   Please run the SQL manually in Supabase Dashboard');
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('\n✅ Read SQL file:', sqlPath);
    console.log('⚠️  Note: Complex SQL functions cannot be executed via REST API');
    console.log('📝 Please run RUN_ALL_FIXES.sql manually in Supabase SQL Editor\n');
    
    // Since we can't execute SQL directly, let's use REST API for what we can do
    console.log('📋 Attempting fixes via REST API...\n');
    
    // Part 1: Fix answer formats via REST API
    console.log('Step 1: Fixing answer format mismatches...');
    
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, options, correct_answer')
      .eq('status', 'approved');
    
    if (fetchError) {
      if (fetchError.message.includes('JWT') || fetchError.message.includes('auth')) {
        console.error('❌ Authentication error. Please check your anon key.');
        console.error('   Error:', fetchError.message);
        console.error('\n💡 Tip: You may need the service role key for updates');
        process.exit(1);
      }
      throw fetchError;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`   Found ${questions.length} approved questions`);
    
    // Find and fix format mismatches
    const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
    const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
    
    let fixedCount = 0;
    const fixes = [];
    
    for (const q of questions) {
      const optionKeys = Object.keys(q.options || {});
      const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
      const usesLetterKeys = optionKeys.some(key => /^[a-dA-D]$/i.test(key));
      
      const needsFix = q.correct_answer.some(answer => {
        const answerStr = String(answer).trim();
        if (usesNumericKeys && /^[a-dA-D]$/i.test(answerStr)) return true;
        if (usesLetterKeys && /^[0-9]+$/.test(answerStr)) return true;
        return false;
      });
      
      if (needsFix) {
        const normalizedAnswers = q.correct_answer.map(answer => {
          const answerStr = String(answer).trim();
          if (usesNumericKeys && letterToNum[answerStr]) return letterToNum[answerStr];
          if (usesLetterKeys && numToLetter[answerStr]) return numToLetter[answerStr];
          return answerStr;
        });
        
        fixes.push({ id: q.id, correct_answer: normalizedAnswers });
      }
    }
    
    console.log(`   Found ${fixes.length} questions to fix`);
    
    // Apply fixes
    for (let i = 0; i < fixes.length; i++) {
      const fix = fixes[i];
      try {
        const { error } = await supabase
          .from('questions')
          .update({ 
            correct_answer: fix.correct_answer,
            updated_at: new Date().toISOString()
          })
          .eq('id', fix.id);
        
        if (error) {
          console.log(`   [${i + 1}/${fixes.length}] ❌ Failed: ${error.message}`);
        } else {
          console.log(`   [${i + 1}/${fixes.length}] ✅ Fixed`);
          fixedCount++;
        }
      } catch (err) {
        console.log(`   [${i + 1}/${fixes.length}] ❌ Error: ${err.message}`);
      }
    }
    
    console.log(`\n✅ Fixed ${fixedCount} question(s)`);
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ Automated fixes completed!');
    console.log('='.repeat(60));
    console.log('\n📝 Important:');
    console.log('   Some fixes require SQL functions that cannot run via REST API');
    console.log('   Please also run: scripts/RUN_ALL_FIXES.sql in Supabase SQL Editor');
    console.log('   This will apply all improvements including:');
    console.log('   - Complex format normalization');
    console.log('   - Scenario question improvements');
    console.log('   - Distractor improvements for all questions');
    console.log('\n🔗 SQL Editor: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Alternative: Run scripts/RUN_ALL_FIXES.sql manually in Supabase SQL Editor');
    process.exit(1);
  }
}

runAllFixes();

















