/**
 * VERIFY DISTRACTOR IMPROVEMENTS
 * Checks if improvements were successfully applied
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
  || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || process.env.SUPABASE_ANON_KEY;

// Try reading from .env.local
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

// Fallback key
if (!supabaseKey) {
  supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y';
}

const supabase = createClient(SUPABASE_URL, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function checkForWeakPatterns(options) {
  const text = JSON.stringify(options).toLowerCase();
  const patterns = {
    nothing: text.includes('nothing') && !text.includes('nothing required') && !text.includes('nothing wrong'),
    always: text.includes('always') && !text.includes('not always') && !text.includes('almost always'),
    never: text.includes('never') && !text.includes('not never') && !text.includes('almost never'),
    cannot: text.includes('cannot') && !text.includes('may not') && !text.includes('might not'),
    illegal: text.includes('illegal') && !text.includes('not illegal'),
    only: text.includes(' only ') && !text.includes('not only') && !text.includes('primarily')
  };
  return patterns;
}

async function verifyImprovements() {
  console.log('\n🔍 VERIFYING DISTRACTOR IMPROVEMENTS\n');
  console.log('='.repeat(60));
  
  try {
    // Check 1: Get recent questions
    console.log('\n📋 Checking recent updates...');
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: recentQuestions, error: recentError } = await supabase
      .from('questions')
      .select('id, updated_at, options')
      .eq('status', 'approved')
      .gte('updated_at', oneHourAgo)
      .order('updated_at', { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.log('⚠️  Could not check recent updates:', recentError.message);
    } else {
      console.log(`   ✅ Found ${recentQuestions?.length || 0} questions updated in last hour`);
    }
    
    // Check 2: Get sample of questions and check for weak patterns
    console.log('\n📋 Analyzing question quality...');
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, options, correct_answer, updated_at')
      .eq('status', 'approved')
      .limit(50);
    
    if (fetchError) {
      console.error('❌ Error fetching questions:', fetchError.message);
      throw fetchError;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    
    console.log(`   ✅ Analyzed ${questions.length} sample questions\n`);
    
    // Analyze patterns
    let totalWeakPatterns = 0;
    const patternCounts = {
      nothing: 0,
      always: 0,
      never: 0,
      cannot: 0,
      illegal: 0,
      only: 0
    };
    
    questions.forEach(q => {
      if (q.options && typeof q.options === 'object') {
        const patterns = checkForWeakPatterns(q.options);
        if (patterns.nothing || patterns.always || patterns.never || patterns.cannot || patterns.illegal || patterns.only) {
          totalWeakPatterns++;
          if (patterns.nothing) patternCounts.nothing++;
          if (patterns.always) patternCounts.always++;
          if (patterns.never) patternCounts.never++;
          if (patterns.cannot) patternCounts.cannot++;
          if (patterns.illegal) patternCounts.illegal++;
          if (patterns.only) patternCounts.only++;
        }
      }
    });
    
    // Check 3: Get all questions count
    const { count: totalCount } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');
    
    // Results
    console.log('='.repeat(60));
    console.log('📊 VERIFICATION RESULTS');
    console.log('='.repeat(60));
    console.log(`\nTotal approved questions: ${totalCount || 'unknown'}`);
    console.log(`Sample analyzed: ${questions.length}`);
    console.log(`Questions with weak patterns: ${totalWeakPatterns} (${((totalWeakPatterns / questions.length) * 100).toFixed(1)}%)`);
    
    if (totalWeakPatterns > 0) {
      console.log('\n⚠️  Weak patterns found:');
      if (patternCounts.nothing > 0) console.log(`   - "Nothing": ${patternCounts.nothing} questions`);
      if (patternCounts.always > 0) console.log(`   - "Always": ${patternCounts.always} questions`);
      if (patternCounts.never > 0) console.log(`   - "Never": ${patternCounts.never} questions`);
      if (patternCounts.cannot > 0) console.log(`   - "Cannot": ${patternCounts.cannot} questions`);
      if (patternCounts.illegal > 0) console.log(`   - "Illegal": ${patternCounts.illegal} questions`);
      if (patternCounts.only > 0) console.log(`   - "Only": ${patternCounts.only} questions`);
      
      if (recentQuestions && recentQuestions.length > 0) {
        console.log('\n✅ Improvements were applied (recent updates found)');
        console.log('⚠️  But some questions still have weak patterns');
        console.log('💡 You may need to run the improvement script again, or review manually');
      } else {
        console.log('\n⚠️  No recent updates found');
        console.log('💡 The improvement script may not have run yet');
        console.log('   Run COPY_AND_RUN_THIS.sql in Supabase SQL Editor');
      }
    } else {
      console.log('\n✅ EXCELLENT! No weak patterns found in sample');
      console.log('✅ Improvements appear to be working correctly!');
    }
    
    if (recentQuestions && recentQuestions.length > 0) {
      console.log(`\n✅ ${recentQuestions.length} questions updated in the last hour`);
      console.log('✅ Improvement script appears to have run recently');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Tip: Check /admin/questions for detailed quality scores');
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Note: This script uses the REST API which has limitations.');
    console.error('   For full verification, run CHECK_IMPROVEMENTS.sql in Supabase SQL Editor');
  }
}

verifyImprovements();
