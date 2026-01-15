/**
 * Direct fix script - uses Supabase REST API
 * This script fixes answer format mismatches without needing .env.local file access
 * 
 * Usage: 
 *   node scripts/fix-answers-direct.js
 *   OR
 *   node scripts/fix-answers-direct.js <anon-key>
 */

const { createClient } = require('@supabase/supabase-js');

// Use node-fetch if available, otherwise use global fetch
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  fetch = globalThis.fetch || require('node-fetch');
}

// Known Supabase URL from SETUP_STATUS.md
const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';

// Get anon key from command line or try to read from .env.local
let anonKey = process.argv[2];

if (!anonKey) {
  // Try to read from .env.local
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+?)(\r?\n|$)/);
      if (match) {
        anonKey = match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // Ignore - will prompt
  }
}

if (!anonKey) {
  console.error('\n❌ Supabase Anon Key required');
  console.error('\n📝 Usage options:');
  console.error('   1. node scripts/fix-answers-direct.js <your-anon-key>');
  console.error('   2. Or ensure NEXT_PUBLIC_SUPABASE_ANON_KEY is in .env.local');
  console.error('\n💡 Get your anon key from:');
  console.error('   https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api');
  console.error('   (Look for "anon public" key)\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, anonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  global: {
    fetch: (...args) => fetch(...args).catch(err => {
      console.error('Network error:', err.message);
      throw err;
    })
  }
});

// Letter to number mapping
const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };

async function fixAnswerFormats() {
  console.log('\n🔧 Fixing Answer Format Mismatches\n');
  console.log('='.repeat(60));
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('='.repeat(60));
  
  try {
    // Step 1: Get all approved questions
    console.log('\n📋 Step 1: Fetching approved questions...');
    
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer')
      .eq('status', 'approved');
    
    if (fetchError) {
      if (fetchError.message.includes('JWT') || fetchError.message.includes('auth')) {
        console.error('\n❌ Authentication error. Please check your anon key.');
        console.error('   Error:', fetchError.message);
        process.exit(1);
      }
      throw fetchError;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`   ✅ Found ${questions.length} approved questions\n`);
    
    // Step 2: Identify questions that need fixing
    console.log('📋 Step 2: Analyzing format mismatches...\n');
    
    const fixes = [];
    
    for (const q of questions) {
      const optionKeys = Object.keys(q.options || {});
      if (optionKeys.length === 0) continue;
      
      const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
      const usesLetterKeys = optionKeys.some(key => /^[a-dA-D]$/i.test(key));
      
      // Check if answers need normalization
      const needsFix = q.correct_answer.some(answer => {
        const answerStr = String(answer).trim();
        if (usesNumericKeys && /^[a-dA-D]$/i.test(answerStr)) {
          return true; // Letter answer but numeric options
        }
        if (usesLetterKeys && /^[0-9]+$/.test(answerStr)) {
          return true; // Numeric answer but letter options
        }
        return false;
      });
      
      if (needsFix) {
        // Normalize answers
        const normalizedAnswers = q.correct_answer.map(answer => {
          const answerStr = String(answer).trim();
          if (usesNumericKeys && letterToNum[answerStr]) {
            return letterToNum[answerStr];
          }
          if (usesLetterKeys && numToLetter[answerStr]) {
            return numToLetter[answerStr];
          }
          return answerStr;
        });
        
        fixes.push({
          id: q.id,
          question: q.question_text.substring(0, 60) + '...',
          category: q.category,
          oldAnswer: q.correct_answer,
          newAnswer: normalizedAnswers
        });
      }
    }
    
    console.log(`   Found ${fixes.length} question(s) to fix\n`);
    
    if (fixes.length === 0) {
      console.log('✅ No format mismatches found! All questions are already correct.\n');
      return;
    }
    
    // Show what will be fixed
    console.log('📋 Questions to fix:');
    fixes.forEach((fix, i) => {
      console.log(`   ${i + 1}. [${fix.category}] ${fix.question}`);
      console.log(`      ${fix.oldAnswer.join(',')} → ${fix.newAnswer.join(',')}`);
    });
    console.log();
    
    // Step 3: Apply fixes
    console.log('📋 Step 3: Applying fixes...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < fixes.length; i++) {
      const fix = fixes[i];
      try {
        const { error } = await supabase
          .from('questions')
          .update({ 
            correct_answer: fix.newAnswer,
            updated_at: new Date().toISOString()
          })
          .eq('id', fix.id);
        
        if (error) {
          console.log(`   [${i + 1}/${fixes.length}] ❌ Failed: ${fix.question}`);
          console.log(`      Error: ${error.message}`);
          errorCount++;
        } else {
          console.log(`   [${i + 1}/${fixes.length}] ✅ Fixed: ${fix.question}`);
          successCount++;
        }
      } catch (err) {
        console.log(`   [${i + 1}/${fixes.length}] ❌ Error: ${err.message}`);
        errorCount++;
      }
    }
    
    // Step 4: Fix specific disclosure question
    console.log('\n📋 Step 4: Fixing disclosure question...\n');
    
    const { data: disclosureQuestions } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%What happens if the prosecution fails to disclose material that should have been disclosed under CPIA 1996%')
      .eq('category', 'Disclosure')
      .limit(1);
    
    if (disclosureQuestions && disclosureQuestions.length > 0) {
      const disclosureUpdate = {
        correct_answer: ['1'],
        options: {
          "0": "Nothing - disclosure is optional under CPIA 1996",
          "1": "The court may stay proceedings as an abuse of process, exclude evidence, or order disclosure. In serious cases, the prosecution may be stayed permanently",
          "2": "The court must automatically acquit the defendant without considering the evidence",
          "3": "The court can only order disclosure but cannot stay proceedings or exclude evidence"
        },
        explanation: 'Under CPIA 1996, the prosecution has a duty to disclose material that might reasonably be considered capable of undermining the prosecution case or assisting the defence. Failure to comply with disclosure obligations is a serious matter that can affect the fairness of the trial. The court has several remedies available under s.8 CPIA 1996 and its common law powers: it may stay proceedings as an abuse of process (R v H [2004] UKHL 3), exclude evidence, order disclosure, or in serious cases, permanently stay the prosecution. The court will consider the seriousness of the breach, whether it was deliberate or negligent, and the impact on the fairness of the trial.',
        source_refs: ['Criminal Procedure and Investigations Act 1996 s.3, s.8', 'R v H [2004] UKHL 3', 'R v Keane [1994] 1 WLR 746'],
        updated_at: new Date().toISOString()
      };
      
      const { error: updateError } = await supabase
        .from('questions')
        .update(disclosureUpdate)
        .eq('id', disclosureQuestions[0].id);
      
      if (updateError) {
        console.log(`   ❌ Failed: ${updateError.message}`);
        errorCount++;
      } else {
        console.log(`   ✅ Fixed disclosure question`);
        successCount++;
      }
    } else {
      console.log(`   ⚠️  Disclosure question not found (may already be fixed)`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully fixed: ${successCount} question(s)`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} question(s)`);
    }
    console.log('='.repeat(60));
    console.log('\n📝 Next steps:');
    console.log('1. Test the disclosure question in practice mode');
    console.log('2. Run validation: node scripts/validate-answer-formats.js');
    console.log('3. Verify all questions work correctly\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('permission') || error.message.includes('policy')) {
      console.error('\n💡 Tip: You may need to use the service role key instead of anon key');
      console.error('   Get it from: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api');
      console.error('   Then run: SUPABASE_SERVICE_ROLE_KEY=... node scripts/fix-answers-direct.js\n');
    }
    process.exit(1);
  }
}

fixAnswerFormats();

