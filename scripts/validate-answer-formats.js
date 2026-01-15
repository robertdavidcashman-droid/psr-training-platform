/**
 * Validation script to check answer format consistency
 * Usage: node scripts/validate-answer-formats.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function validateFormats() {
  console.log('\n🔍 Validating Answer Formats\n');
  console.log('='.repeat(60));
  
  try {
    // Get all approved questions
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer')
      .eq('status', 'approved');
    
    if (error) {
      throw error;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`\n📊 Analyzing ${questions.length} approved questions...\n`);
    
    let formatMismatches = 0;
    let invalidAnswers = 0;
    let validQuestions = 0;
    const issues = [];
    
    for (const q of questions) {
      const optionKeys = Object.keys(q.options || {});
      const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
      const usesLetterKeys = optionKeys.some(key => /^[a-dA-D]$/i.test(key));
      
      // Check format mismatch
      const answerUsesLetters = q.correct_answer.some(a => /^[a-dA-D]$/i.test(String(a)));
      const answerUsesNumbers = q.correct_answer.some(a => /^[0-9]+$/.test(String(a)));
      
      let hasMismatch = false;
      let hasInvalidAnswer = false;
      
      if (usesNumericKeys && answerUsesLetters) {
        hasMismatch = true;
        formatMismatches++;
      } else if (usesLetterKeys && answerUsesNumbers) {
        hasMismatch = true;
        formatMismatches++;
      }
      
      // Check if answers exist in options
      for (const answer of q.correct_answer) {
        const normalizedAnswer = String(answer).trim();
        if (!optionKeys.includes(normalizedAnswer)) {
          // Try normalization
          const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
          const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
          
          let normalized = normalizedAnswer;
          if (usesNumericKeys && letterToNum[normalizedAnswer]) {
            normalized = letterToNum[normalizedAnswer];
          } else if (usesLetterKeys && numToLetter[normalizedAnswer]) {
            normalized = numToLetter[normalizedAnswer];
          }
          
          if (!optionKeys.includes(normalized)) {
            hasInvalidAnswer = true;
            invalidAnswers++;
            break;
          }
        }
      }
      
      if (hasMismatch || hasInvalidAnswer) {
        issues.push({
          id: q.id,
          question: q.question_text.substring(0, 60) + '...',
          category: q.category,
          difficulty: q.difficulty,
          issue: hasMismatch ? 'Format mismatch' : 'Invalid answer key',
          optionKeys,
          correctAnswer: q.correct_answer
        });
      } else {
        validQuestions++;
      }
    }
    
    // Level 1: Summary
    console.log('📊 Level 1: Summary');
    console.log('─'.repeat(60));
    console.log(`Total questions:     ${questions.length}`);
    console.log(`✅ Valid:            ${validQuestions}`);
    console.log(`❌ Format mismatch:  ${formatMismatches}`);
    console.log(`❌ Invalid answers:   ${invalidAnswers}`);
    console.log(`✅ Success rate:     ${((validQuestions / questions.length) * 100).toFixed(1)}%\n`);
    
    // Level 2: Detailed issues (first 10)
    if (issues.length > 0) {
      console.log('📋 Level 2: Issues Found (showing first 10)');
      console.log('─'.repeat(60));
      issues.slice(0, 10).forEach((issue, idx) => {
        console.log(`\n${idx + 1}. ${issue.issue}`);
        console.log(`   Question: ${issue.question}`);
        console.log(`   Category: ${issue.category} | Difficulty: ${issue.difficulty}`);
        console.log(`   Option keys: [${issue.optionKeys.join(', ')}]`);
        console.log(`   Correct answer: [${issue.correctAnswer.join(', ')}]`);
      });
      
      if (issues.length > 10) {
        console.log(`\n... and ${issues.length - 10} more issues`);
      }
    }
    
    // Level 3: Category breakdown
    console.log('\n📊 Level 3: Category Breakdown');
    console.log('─'.repeat(60));
    const categoryStats = {};
    questions.forEach(q => {
      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, valid: 0, issues: 0 };
      }
      categoryStats[q.category].total++;
      
      const optionKeys = Object.keys(q.options || {});
      const usesNumericKeys = optionKeys.some(key => /^[0-9]+$/.test(key));
      const answerUsesLetters = q.correct_answer.some(a => /^[a-dA-D]$/i.test(String(a)));
      const answerUsesNumbers = q.correct_answer.some(a => /^[0-9]+$/.test(String(a)));
      
      if ((usesNumericKeys && answerUsesLetters) || (!usesNumericKeys && answerUsesNumbers)) {
        categoryStats[q.category].issues++;
      } else {
        categoryStats[q.category].valid++;
      }
    });
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const rate = ((stats.valid / stats.total) * 100).toFixed(1);
      const status = stats.issues === 0 ? '✅' : '❌';
      console.log(`${status} ${category.padEnd(30)} ${stats.valid}/${stats.total} valid (${rate}%)`);
    });
    
    // Final result
    console.log('\n' + '='.repeat(60));
    if (formatMismatches === 0 && invalidAnswers === 0) {
      console.log('✅ All questions have consistent formats!');
    } else {
      console.log(`⚠️  Found ${formatMismatches + invalidAnswers} issue(s) that need fixing`);
      console.log('💡 Run: node scripts/fix-answer-formats-auto.js');
    }
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

validateFormats();

















