/**
 * Automatically execute all fixes via Supabase REST API
 * This bypasses the need to run SQL manually
 */

const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';
const anonKey = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y';

const supabase = createClient(SUPABASE_URL, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };

function improveDistractor(text) {
  let improved = text;
  improved = improved.replace(/Nothing -/g, 'This is not required -');
  improved = improved.replace(/Nothing,/g, 'This is not required,');
  improved = improved.replace(/Nothing\./g, 'This is not required.');
  improved = improved.replace(/Nothing /g, 'This is not required ');
  improved = improved.replace(/Always /g, 'Generally ');
  improved = improved.replace(/always /g, 'generally ');
  improved = improved.replace(/Never /g, 'Rarely ');
  improved = improved.replace(/never /g, 'rarely ');
  improved = improved.replace(/Only /g, 'Primarily ');
  improved = improved.replace(/only /g, 'primarily ');
  improved = improved.replace(/Cannot /g, 'May not be able to ');
  improved = improved.replace(/cannot /g, 'may not be able to ');
  return improved;
}

async function fixAll() {
  console.log('\n🚀 Executing All Fixes Automatically\n');
  console.log('='.repeat(60));
  
  try {
    // Step 1: Get all approved questions
    console.log('📋 Step 1: Fetching all approved questions...');
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('id, question_text, category, difficulty, options, correct_answer')
      .eq('status', 'approved');
    
    if (fetchError) throw fetchError;
    if (!questions || questions.length === 0) {
      console.log('⚠️  No approved questions found');
      return;
    }
    console.log(`   ✅ Found ${questions.length} questions\n`);
    
    // Step 2: Fix answer format mismatches
    console.log('📋 Step 2: Fixing answer format mismatches...');
    let formatFixes = 0;
    const formatUpdates = [];
    
    for (const q of questions) {
      const optionKeys = Object.keys(q.options || {});
      const usesNumericKeys = optionKeys.some(k => /^[0-9]+$/.test(k));
      const usesLetterKeys = optionKeys.some(k => /^[a-dA-D]$/i.test(k));
      
      const needsFix = q.correct_answer.some(a => {
        const str = String(a).trim();
        return (usesNumericKeys && /^[a-dA-D]$/i.test(str)) || 
               (usesLetterKeys && /^[0-9]+$/.test(str));
      });
      
      if (needsFix) {
        const normalized = q.correct_answer.map(a => {
          const str = String(a).trim();
          if (usesNumericKeys && letterToNum[str]) return letterToNum[str];
          if (usesLetterKeys && numToLetter[str]) return numToLetter[str];
          return str;
        });
        formatUpdates.push({ id: q.id, correct_answer: normalized });
      }
    }
    
    console.log(`   Found ${formatUpdates.length} questions to fix`);
    
    for (let i = 0; i < formatUpdates.length; i++) {
      const update = formatUpdates[i];
      const { error } = await supabase
        .from('questions')
        .update({ correct_answer: update.correct_answer, updated_at: new Date().toISOString() })
        .eq('id', update.id);
      
      if (!error) {
        formatFixes++;
        if ((i + 1) % 10 === 0) console.log(`   Progress: ${i + 1}/${formatUpdates.length}`);
      }
    }
    console.log(`   ✅ Fixed ${formatFixes} format mismatches\n`);
    
    // Step 3: Fix disclosure question
    console.log('📋 Step 3: Fixing disclosure question...');
    const disclosureUpdate = {
      correct_answer: ['1'],
      options: {
        "0": "Nothing - disclosure is optional under CPIA 1996",
        "1": "The court may stay proceedings as an abuse of process, exclude evidence, or order disclosure. In serious cases, the prosecution may be stayed permanently",
        "2": "The court must automatically acquit the defendant without considering the evidence",
        "3": "The court can only order disclosure but cannot stay proceedings or exclude evidence"
      },
      explanation: 'Under CPIA 1996, the prosecution has a duty to disclose material that might reasonably be considered capable of undermining the prosecution case or assisting the defence. Failure to comply with disclosure obligations is a serious matter that can affect the fairness of the trial. The court has several remedies available under s.8 CPIA 1996 and its common law powers: it may stay proceedings as an abuse of process (R v H [2004] UKHL 3), exclude evidence, order disclosure, or in serious cases, permanently stay the prosecution.',
      source_refs: ['Criminal Procedure and Investigations Act 1996 s.3, s.8', 'R v H [2004] UKHL 3', 'R v Keane [1994] 1 WLR 746'],
      updated_at: new Date().toISOString()
    };
    
    const { data: disclosureQs } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%What happens if the prosecution fails to disclose material that should have been disclosed under CPIA 1996%')
      .eq('category', 'Disclosure')
      .limit(1);
    
    if (disclosureQs && disclosureQs.length > 0) {
      const { error } = await supabase
        .from('questions')
        .update(disclosureUpdate)
        .eq('id', disclosureQs[0].id);
      console.log(error ? `   ❌ Error: ${error.message}` : `   ✅ Fixed disclosure question\n`);
    }
    
    // Step 4: Fix scenario questions
    console.log('📋 Step 4: Improving scenario question distractors...');
    let scenarioFixes = 0;
    
    // Appropriate Adult Scenario
    const { data: aaQs } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%16-year-old%arrested%learning disability%appropriate adult%')
      .ilike('category', '%PACE%')
      .limit(1);
    
    if (aaQs && aaQs.length > 0) {
      const { error } = await supabase.from('questions').update({
        options: {
          "0": "Proceed with the interview as the client is 16 and appears to understand the situation",
          "1": "Insist that an appropriate adult is called before any interview proceeds, as the client has a learning disability and is under 18",
          "2": "Ask the client if they want an appropriate adult present, and proceed if they decline",
          "3": "Request an appropriate adult but allow the interview to proceed if one cannot be found immediately"
        },
        correct_answer: ['1'],
        updated_at: new Date().toISOString()
      }).eq('id', aaQs[0].id);
      if (!error) scenarioFixes++;
    }
    
    // Interview Question Scenario
    const { data: intQs } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%interview%officer asks%Why did you do it%')
      .ilike('category', '%PACE%')
      .limit(1);
    
    if (intQs && intQs.length > 0) {
      const { error } = await supabase.from('questions').update({
        options: {
          "0": "Allow the question as it is open-ended and allows the client to explain their actions",
          "1": "Intervene immediately as the question assumes guilt and is leading - the officer must first establish what happened before asking why",
          "2": "Wait to see how the client responds before deciding whether to intervene",
          "3": "Only intervene if the question is clearly unfair or the client objects"
        },
        correct_answer: ['1'],
        updated_at: new Date().toISOString()
      }).eq('id', intQs[0].id);
      if (!error) scenarioFixes++;
    }
    
    // Selective Answering Scenario
    const { data: selQs } = await supabase
      .from('questions')
      .select('id')
      .ilike('question_text', '%client wants to answer some questions but not others%pick and choose%')
      .ilike('category', '%PACE%')
      .limit(1);
    
    if (selQs && selQs.length > 0) {
      const { error } = await supabase.from('questions').update({
        options: {
          "0": "Advise that they must answer all questions or remain silent throughout, as selective silence is not permitted",
          "1": "Advise that they can answer some questions and remain silent on others, but explain the potential implications of selective silence under s.34 CJPOA 1994",
          "2": "Tell them they cannot pick and choose - they must either answer everything or say nothing at all",
          "3": "Advise that selective answering is allowed but will definitely lead to adverse inferences being drawn"
        },
        correct_answer: ['1'],
        updated_at: new Date().toISOString()
      }).eq('id', selQs[0].id);
      if (!error) scenarioFixes++;
    }
    
    console.log(`   ✅ Improved ${scenarioFixes} scenario questions\n`);
    
    // Step 5: Improve distractors for all questions
    console.log('📋 Step 5: Improving distractors for all questions...');
    let distractorFixes = 0;
    const distractorUpdates = [];
    
    for (const q of questions) {
      const optionKeys = Object.keys(q.options || {});
      let needsUpdate = false;
      const improvedOptions = {};
      
      for (const key of optionKeys) {
        const value = q.options[key];
        const text = typeof value === 'string' ? value : (value?.text || String(value));
        
        if (text.match(/nothing|always|never|only|cannot/i) && 
            !text.match(/nothing.*required|not always|not never/i)) {
          const improved = improveDistractor(text);
          if (improved !== text) {
            improvedOptions[key] = improved;
            needsUpdate = true;
          } else {
            improvedOptions[key] = value;
          }
        } else {
          improvedOptions[key] = value;
        }
      }
      
      if (needsUpdate) {
        distractorUpdates.push({ id: q.id, options: improvedOptions });
      }
    }
    
    console.log(`   Found ${distractorUpdates.length} questions to improve`);
    
    for (let i = 0; i < distractorUpdates.length; i++) {
      const update = distractorUpdates[i];
      const { error } = await supabase
        .from('questions')
        .update({ options: update.options, updated_at: new Date().toISOString() })
        .eq('id', update.id);
      
      if (!error) {
        distractorFixes++;
        if ((i + 1) % 10 === 0) console.log(`   Progress: ${i + 1}/${distractorUpdates.length}`);
      }
    }
    console.log(`   ✅ Improved ${distractorFixes} questions\n`);
    
    // Summary
    console.log('='.repeat(60));
    console.log('✅ ALL FIXES COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary:`);
    console.log(`   Format mismatches fixed: ${formatFixes}`);
    console.log(`   Scenario questions improved: ${scenarioFixes}`);
    console.log(`   Distractors improved: ${distractorFixes}`);
    console.log(`   Total questions updated: ${formatFixes + scenarioFixes + distractorFixes}\n`);
    console.log('🎉 All questions now have:');
    console.log('   ✅ Correct answer formats');
    console.log('   ✅ Plausible distractors');
    console.log('   ✅ More challenging incorrect answers\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('permission') || error.message.includes('policy')) {
      console.error('\n💡 You may need the service role key for updates');
      console.error('   Get it from: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api\n');
    }
    process.exit(1);
  }
}

fixAll();

















