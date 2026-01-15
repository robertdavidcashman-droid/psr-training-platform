/**
 * Automatically fix Code F para 3.2 question explanation
 * 
 * Usage: node scripts/fix-code-f-explanation-auto.js
 */

const { createClient } = require('@supabase/supabase-js');

// Try to load .env.local
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // Ignore if file doesn't exist
}

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cvsawjrtgmsmadtfwfa.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjU4MzA5MCwiZXhwIjoyMDgyMTU5MDkwfQ.VQwFOyhb-ybYOO3oF7iimzttdZi3F5HAMsgvKYx5fpw';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('\n📝 Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CORRECT_EXPLANATION = 'Under Code F para 3.2, if visual recording equipment fails, the interview may continue but should be audio recorded under Code E if practicable. If audio recording is not possible, a written record should be made under Code C. The suspect should be informed of the failure and the reason for the alternative recording method. This ensures continuity of the interview process while maintaining a proper record of proceedings.';

async function fixCodeFQuestion() {
  console.log('\n🔧 FIXING CODE F PARA 3.2 QUESTION EXPLANATION\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Find the question
    console.log('\n📋 Step 1: Finding Code F recording equipment failure question...\n');
    
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer, explanation, source_refs, status')
      .or('question_text.ilike.%recording equipment fails%,question_text.ilike.%equipment fails%,question_text.ilike.%recording equipment failure%')
      .or('question_text.ilike.%Code F%,question_text.ilike.%para 3.2%,category.ilike.%PACE Code F%,category.ilike.%Code F%');
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!questions || questions.length === 0) {
      console.log('⚠️  No matching questions found');
      return;
    }
    
    console.log(`   Found ${questions.length} matching question(s)\n`);
    
    // Filter for the Code F question with corrupted explanation
    const codeFQuestions = questions.filter(q => {
      const hasCodeF = (q.question_text && (q.question_text.includes('Code F') || q.question_text.includes('para 3.2'))) ||
                       (q.category && (q.category.includes('Code F') || q.category.includes('PACE Code F')));
      const hasRecording = q.question_text && (
        q.question_text.includes('recording equipment fails') ||
        q.question_text.includes('equipment fails') ||
        q.question_text.includes('recording equipment failure')
      );
      const hasCorruptedExplanation = !q.explanation || 
                                      q.explanation.includes('not working correctly') ||
                                      q.explanation.includes('not working');
      
      return hasCodeF && hasRecording && hasCorruptedExplanation;
    });
    
    if (codeFQuestions.length === 0) {
      console.log('⚠️  No questions found with corrupted explanation');
      console.log('\n📋 Showing all matching questions:\n');
      questions.forEach((q, i) => {
        console.log(`   [${i + 1}] ${q.question_text.substring(0, 80)}...`);
        console.log(`       Category: ${q.category}`);
        console.log(`       Explanation: ${q.explanation ? q.explanation.substring(0, 100) + '...' : '(null)'}`);
        console.log('');
      });
      return;
    }
    
    // Step 2: Show current question
    console.log('📋 Step 2: Current question data:\n');
    const question = codeFQuestions[0];
    console.log(`   ID: ${question.id}`);
    console.log(`   Question: ${question.question_text}`);
    console.log(`   Category: ${question.category}`);
    console.log(`   Difficulty: ${question.difficulty}`);
    console.log(`   Options: ${JSON.stringify(question.options)}`);
    console.log(`   Correct Answer: ${JSON.stringify(question.correct_answer)}`);
    console.log(`   Current Explanation: ${question.explanation ? question.explanation.substring(0, 150) + '...' : '(null)'}`);
    console.log(`   Source Refs: ${question.source_refs ? JSON.stringify(question.source_refs) : '(null)'}`);
    console.log(`   Status: ${question.status}`);
    console.log('');
    
    // Step 3: Fix the explanation
    console.log('📋 Step 3: Fixing explanation...\n');
    
    const { data: updatedQuestion, error: updateError } = await supabase
      .from('questions')
      .update({ 
        explanation: CORRECT_EXPLANATION,
        updated_at: new Date().toISOString()
      })
      .eq('id', question.id)
      .select()
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    console.log('   ✅ Explanation updated successfully!\n');
    
    // Step 4: Show fixed question
    console.log('📋 Step 4: Fixed question data:\n');
    console.log(`   ID: ${updatedQuestion.id}`);
    console.log(`   Question: ${updatedQuestion.question_text}`);
    console.log(`   Category: ${updatedQuestion.category}`);
    console.log(`   Difficulty: ${updatedQuestion.difficulty}`);
    console.log(`   Options: ${JSON.stringify(updatedQuestion.options)}`);
    console.log(`   Correct Answer: ${JSON.stringify(updatedQuestion.correct_answer)}`);
    console.log(`   New Explanation: ${updatedQuestion.explanation.substring(0, 150)}...`);
    console.log(`   Updated At: ${updatedQuestion.updated_at}`);
    console.log('');
    
    // Summary
    console.log('='.repeat(70));
    console.log('✅ SUCCESS: Code F question explanation fixed!');
    console.log('='.repeat(70));
    console.log('\n📝 Next steps:');
    console.log('1. Test the question in practice mode');
    console.log('2. Verify the explanation displays correctly');
    console.log('3. Check that users can see the full explanation\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.details) {
      console.error('   Details:', error.details);
    }
    if (error.hint) {
      console.error('   Hint:', error.hint);
    }
    process.exit(1);
  }
}

fixCodeFQuestion();
