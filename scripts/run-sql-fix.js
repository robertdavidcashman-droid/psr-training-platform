/**
 * Simple script to execute SQL fixes using Supabase REST API
 * This script updates questions directly via REST API instead of raw SQL
 * 
 * Usage: node scripts/run-sql-fix.js
 */

const { createClient } = require('@supabase/supabase-js');

// Try to load .env.local (may fail if OneDrive is syncing)
let envLoaded = false;
try {
  require('dotenv').config({ path: '.env.local' });
  envLoaded = true;
} catch (e) {
  // Ignore - will use environment variables or prompt
}

// Get credentials from environment or use defaults from SETUP_STATUS.md
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cvsawjrtgmsmadtfwfa.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('\n📝 Please provide credentials:');
  console.error('   1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.error('   2. Or set them as environment variables');
  console.error('   3. Or run: NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node scripts/run-sql-fix.js\n');
  process.exit(1);
}

console.log('✅ Using Supabase URL:', supabaseUrl.replace(/\/\/.*@/, '//***@'));

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Letter to number mapping
const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };

async function fixAnswerFormats() {
  console.log('\n🔧 Fixing Answer Format Mismatches\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Get all questions with potential format mismatches
    console.log('\n📋 Step 1: Finding questions with format mismatches...');
    
    const { data: allQuestions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer')
      .eq('status', 'approved');
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!allQuestions || allQuestions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`   Found ${allQuestions.length} approved questions\n`);
    
    // Step 2: Identify and fix mismatches
    console.log('📋 Step 2: Fixing format mismatches...\n');
    
    let fixedCount = 0;
    let skippedCount = 0;
    const updates = [];
    
    for (const q of allQuestions) {
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
        
        updates.push({
          id: q.id,
          correct_answer: normalizedAnswers,
          question_preview: q.question_text.substring(0, 50) + '...'
        });
      } else {
        skippedCount++;
      }
    }
    
    console.log(`   Found ${updates.length} questions to fix`);
    console.log(`   Skipping ${skippedCount} questions (already correct)\n`);
    
    // Step 3: Apply fixes
    if (updates.length > 0) {
      console.log('📋 Step 3: Applying fixes...\n');
      
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        try {
          const { error } = await supabase
            .from('questions')
            .update({ 
              correct_answer: update.correct_answer,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.id);
          
          if (error) {
            console.log(`   [${i + 1}/${updates.length}] ❌ Failed: ${update.question_preview}`);
            console.log(`      Error: ${error.message}`);
          } else {
            console.log(`   [${i + 1}/${updates.length}] ✅ Fixed: ${update.question_preview}`);
            fixedCount++;
          }
        } catch (err) {
          console.log(`   [${i + 1}/${updates.length}] ❌ Error: ${err.message}`);
        }
      }
    }
    
    // Step 4: Fix specific disclosure question
    console.log('\n📋 Step 4: Fixing disclosure question...\n');
    
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
    
    const { data: disclosureQuestions, error: disclosureError } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%What happens if the prosecution fails to disclose material that should have been disclosed under CPIA 1996%')
      .eq('category', 'Disclosure')
      .limit(1);
    
    if (!disclosureError && disclosureQuestions && disclosureQuestions.length > 0) {
      const { error: updateError } = await supabase
        .from('questions')
        .update(disclosureUpdate)
        .eq('id', disclosureQuestions[0].id);
      
      if (updateError) {
        console.log(`   ❌ Failed to update disclosure question: ${updateError.message}`);
      } else {
        console.log(`   ✅ Fixed disclosure question`);
        fixedCount++;
      }
    } else {
      console.log(`   ⚠️  Disclosure question not found or already fixed`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Fixed ${fixedCount} question(s)`);
    console.log('='.repeat(60));
    console.log('\n📝 Next steps:');
    console.log('1. Run validation: node scripts/validate-answer-formats.js');
    console.log('2. Test the disclosure question in practice mode');
    console.log('3. Verify all questions work correctly\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAnswerFormats();

