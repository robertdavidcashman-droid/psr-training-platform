/**
 * AUTO-IMPROVE DISTRACTORS - Direct Version
 * Uses known Supabase URL and prompts for key if needed
 */

const { createClient } = require('@supabase/supabase-js');

// Known Supabase URL from the codebase
const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';

// Try to get key from environment or use known key from FIX_ENV_ERROR.md
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_ANON_KEY;

// If still no key, try reading from .env.local
if (!supabaseKey) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+?)(\r?\n|$)/);
      if (match) {
        supabaseKey = match[1].trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch (e) {
    // Ignore
  }
}

// Known anon key from FIX_ENV_ERROR.md (fallback)
if (!supabaseKey) {
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y';
}

const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Improve distractor text by replacing weak patterns with better alternatives
 */
function improveDistractorText(text, questionContext = '') {
  let improved = text.trim();
  const original = improved;
  
  // Pattern 1: Replace "Nothing" with more specific language
  if (improved.match(/^nothing[\s\-.,:;]/i) || improved.match(/[\s\-.,:;]nothing[\s\-.,:;]/i)) {
    improved = improved.replace(/\bNothing[\s\-.,:;]/gi, 'This is not required ');
    improved = improved.replace(/\bnothing[\s\-.,:;]/gi, 'this is not required ');
  }
  
  // Pattern 2: Replace absolute "Always" with "Generally"
  if (improved.match(/\balways\b/i) && !improved.match(/\bnot\s+always\b/i) && !improved.match(/\balmost\s+always\b/i)) {
    improved = improved.replace(/\bAlways\b/g, 'Generally');
    improved = improved.replace(/\balways\b/g, 'generally');
  }
  
  // Pattern 3: Replace absolute "Never" with "Rarely" or "Not typically"
  if (improved.match(/\bnever\b/i) && !improved.match(/\bnot\s+never\b/i) && !improved.match(/\balmost\s+never\b/i)) {
    improved = improved.replace(/\bNever\b/g, 'Rarely');
    improved = improved.replace(/\bnever\b/g, 'rarely');
  }
  
  // Pattern 4: Replace "Cannot" with "May not be able to" or "Is not able to"
  if (improved.match(/\bcannot\b/i) && !improved.match(/\bmay\s+not\b/i) && !improved.match(/\bmight\s+not\b/i)) {
    improved = improved.replace(/\bCannot\b/g, 'May not be able to');
    improved = improved.replace(/\bcannot\b/g, 'may not be able to');
    improved = improved.replace(/\bcan\s+not\b/gi, 'may not be able to');
  }
  
  // Pattern 5: Replace restrictive "Only" with "Primarily" or "Mainly"
  if (improved.match(/\sonly\s/i) && !improved.match(/\bnot\s+only\b/i) && !improved.match(/\bprimarily\b/i)) {
    improved = improved.replace(/\sOnly\s/g, ' Primarily ');
    improved = improved.replace(/\sonly\s/g, ' primarily ');
    improved = improved.replace(/^Only\s/i, 'Primarily ');
  }
  
  // Pattern 6: Replace "Illegal" with more nuanced language
  if (improved.match(/\billegal\b/i) && !improved.match(/\bnot\s+illegal\b/i) && !improved.match(/\bnot\s+necessarily\s+illegal\b/i)) {
    improved = improved.replace(/\bIllegal\b/g, 'Not permitted in these circumstances');
    improved = improved.replace(/\billegal\b/g, 'not permitted in these circumstances');
  }
  
  // Pattern 7: Replace "Must not" with "Should not" or "Is not permitted to"
  if (improved.match(/\bmust\s+not\b/i) && !improved.match(/\bshould\s+not\b/i)) {
    improved = improved.replace(/\bMust\s+not\b/g, 'Should not');
    improved = improved.replace(/\bmust\s+not\b/g, 'should not');
  }
  
  // Pattern 8: Replace "Forbidden" with "Not permitted"
  if (improved.match(/\bforbidden\b/i)) {
    improved = improved.replace(/\bForbidden\b/g, 'Not permitted');
    improved = improved.replace(/\bforbidden\b/g, 'not permitted');
  }
  
  // Clean up multiple spaces
  improved = improved.replace(/\s+/g, ' ').trim();
  
  // Capitalize first letter if needed
  if (improved.length > 0 && improved[0] === improved[0].toLowerCase()) {
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
  }
  
  return improved;
}

/**
 * Calculate quality score for a question's distractors
 */
function calculateQualityScore(options, correctAnswer) {
  let score = 10;
  const correctKeys = correctAnswer.map(a => String(a).trim());
  
  Object.entries(options).forEach(([key, value]) => {
    if (correctKeys.includes(key)) return; // Skip correct answers
    
    const text = typeof value === 'string' ? value : (value?.text || String(value));
    const lowerText = text.toLowerCase();
    
    // Check for weak patterns
    if (lowerText.includes('nothing') && !lowerText.includes('nothing required') && !lowerText.includes('nothing wrong')) {
      score -= 2;
    }
    if ((lowerText.includes('always') || lowerText.includes('never')) &&
        !lowerText.includes('not always') && !lowerText.includes('not never') &&
        !lowerText.includes('almost always') && !lowerText.includes('almost never')) {
      score -= 1;
    }
    if (lowerText.includes('illegal') && !lowerText.includes('not illegal') && !lowerText.includes('not necessarily illegal')) {
      score -= 2;
    }
    if (lowerText.includes('cannot') && !lowerText.includes('may not') && !lowerText.includes('might not')) {
      score -= 1;
    }
    if (lowerText.includes(' only ') && !lowerText.includes('not only') && !lowerText.includes('primarily')) {
      score -= 1;
    }
    if (text.length < 30) {
      score -= 1;
    }
  });
  
  return Math.max(0, score);
}

/**
 * Improve all options for a question
 */
function improveQuestionOptions(question) {
  const improvedOptions = {};
  let hasChanges = false;
  
  Object.entries(question.options).forEach(([key, value]) => {
    const originalText = typeof value === 'string' ? value : (value?.text || String(value));
    const improvedText = improveDistractorText(originalText, question.question_text);
    
    if (improvedText !== originalText) {
      hasChanges = true;
    }
    
    improvedOptions[key] = improvedText;
  });
  
  return { improvedOptions, hasChanges };
}

async function autoImproveDistractors() {
  console.log('\n🚀 AUTO-IMPROVING QUESTION DISTRACTORS\n');
  console.log('='.repeat(60));
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log('='.repeat(60));
  
  try {
    // Step 1: Fetch all approved questions
    console.log('\n📋 Step 1: Fetching all approved questions...');
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer, status')
      .eq('status', 'approved');
    
    if (fetchError) {
      console.error('❌ Error fetching questions:', fetchError.message);
      throw fetchError;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`   ✅ Found ${questions.length} questions\n`);
    
    // Step 2: Identify questions with weak distractors and improve them
    console.log('📋 Step 2: Analyzing and improving distractors...');
    let improvedCount = 0;
    let totalImproved = 0;
    const updates = [];
    
    for (const question of questions) {
      const qualityScore = calculateQualityScore(question.options, question.correct_answer);
      
      // Only improve questions with quality score < 8
      if (qualityScore < 8) {
        const { improvedOptions, hasChanges } = improveQuestionOptions(question);
        
        if (hasChanges) {
          updates.push({
            id: question.id,
            options: improvedOptions,
            originalScore: qualityScore,
            newScore: calculateQualityScore(improvedOptions, question.correct_answer)
          });
        }
      }
    }
    
    console.log(`   ✅ Identified ${updates.length} questions needing improvement\n`);
    
    // Step 3: Apply improvements
    if (updates.length > 0) {
      console.log('📋 Step 3: Applying improvements to database...');
      
      for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        
        try {
          const { error } = await supabase
            .from('questions')
            .update({
              options: update.options,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.id);
          
          if (error) {
            console.error(`   ❌ Error updating question ${update.id}:`, error.message);
          } else {
            improvedCount++;
            totalImproved++;
            
            if ((i + 1) % 10 === 0) {
              console.log(`   Progress: ${i + 1}/${updates.length} questions updated`);
            }
          }
        } catch (err) {
          console.error(`   ❌ Error updating question ${update.id}:`, err.message);
        }
      }
      
      console.log(`\n   ✅ Successfully improved ${improvedCount} questions\n`);
    } else {
      console.log('   ℹ️  No questions needed automatic improvement\n');
    }
    
    // Step 4: Summary statistics
    console.log('📊 Step 4: Calculating final statistics...');
    const { data: finalQuestions } = await supabase
      .from('questions')
      .select('options, correct_answer')
      .eq('status', 'approved');
    
    const stats = {
      total: finalQuestions?.length || 0,
      excellent: 0,
      good: 0,
      needsReview: 0,
      averageScore: 0
    };
    
    let totalScore = 0;
    finalQuestions?.forEach(q => {
      const score = calculateQualityScore(q.options, q.correct_answer);
      totalScore += score;
      if (score === 10) stats.excellent++;
      else if (score >= 8) stats.good++;
      else stats.needsReview++;
    });
    
    stats.averageScore = stats.total > 0 ? (totalScore / stats.total).toFixed(2) : 0;
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ AUTO-IMPROVEMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log('\n📊 Final Statistics:');
    console.log(`   Total questions: ${stats.total}`);
    console.log(`   Excellent quality (10/10): ${stats.excellent}`);
    console.log(`   Good quality (8-9/10): ${stats.good}`);
    console.log(`   Needs review (<8/10): ${stats.needsReview}`);
    console.log(`   Average quality score: ${stats.averageScore}/10`);
    console.log(`   Questions improved: ${totalImproved}`);
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Tip: If you see authentication errors, the script needs valid Supabase credentials.');
    console.error('   You can also run the SQL script directly in Supabase SQL Editor instead.');
    process.exit(1);
  }
}

// Run the script
autoImproveDistractors();
