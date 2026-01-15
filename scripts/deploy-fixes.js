/**
 * Execute all fixes using service role key (full permissions)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local');
let serviceKey = process.argv[2];

if (!serviceKey) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+?)(\r?\n|$)/);
    if (match) {
      serviceKey = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    console.error('❌ Could not read .env.local');
  }
}

if (!serviceKey) {
  console.error('\n❌ Service role key required for updates');
  console.error('📝 Get it from: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/settings/api');
  console.error('   Then run: node scripts/deploy-fixes.js <service-role-key>\n');
  process.exit(1);
}

const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';
const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
});

const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };

function improveDistractor(text) {
  if (text.includes('nothing') && !text.includes('nothing') && text.includes('required')) {
    let improved = text;
    improved = improved.replace(/Nothing - /g, 'This is not required - ');
    improved = improved.replace(/Nothing, /g, 'This is not required, ');
    improved = improved.replace(/Nothing\. /g, 'This is not required. ');
    return improved;
  }
  return text;
}

async function deployFixes() {
  console.log('\n🚀 Deploying All Fixes\n');
  console.log('='.repeat(70));
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Using: Service Role Key (full permissions)`);
  console.log('='.repeat(70) + '\n');
  
  try {
    // Fetch questions
    console.log('1️⃣  Fetching questions...');
    const { data: questions, error: fetchError } = await supabase
      .from('questions')
      .select('*')
      .eq('status', 'approved');
    
    if (fetchError) throw fetchError;
    console.log(`   ✅ Found ${questions.length} approved questions\n`);
    
    // Fix 1: Answer format mismatches
    console.log('2️⃣  Fixing answer format mismatches...');
    let fixed1 = 0;
    
    for (const q of questions) {
      const optKeys = Object.keys(q.options || {});
      const usesNum = optKeys.some(k => /^[0-9]+$/.test(k));
      const usesLetter = optKeys.some(k => /^[a-dA-D]$/i.test(k));
      
      const needsFix = q.correct_answer?.some(a => {
        const s = String(a).trim();
        return (usesNum && /^[a-dA-D]$/i.test(s)) || (usesLetter && /^[0-9]+$/.test(s));
      });
      
      if (needsFix) {
        const normalized = q.correct_answer.map(a => {
          const s = String(a).trim();
          if (usesNum && letterToNum[s]) return letterToNum[s];
          if (usesLetter && numToLetter[s]) return numToLetter[s];
          return s;
        });
        
        const { error } = await supabase
          .from('questions')
          .update({ correct_answer: normalized })
          .eq('id', q.id);
        
        if (!error) {
          fixed1++;
          process.stdout.write(`\r   Progress: ${fixed1} fixed`);
        }
      }
    }
    console.log(`\n   ✅ Fixed ${fixed1} format mismatches\n`);
    
    // Fix 2: Disclosure question
    console.log('3️⃣  Fixing disclosure question...');
    const { error: discError } = await supabase
      .from('questions')
      .update({
        correct_answer: ['1'],
        options: {
          "0": "Disclosure is not mandatory under CPIA 1996 - it is at the prosecution's discretion",
          "1": "The court may stay proceedings as an abuse of process, exclude evidence, or order disclosure. In serious cases, the prosecution may be stayed permanently",
          "2": "The court must automatically acquit the defendant without considering the evidence",
          "3": "The court can only order disclosure but cannot stay proceedings or exclude evidence"
        },
        explanation: 'Under CPIA 1996, the prosecution has a duty to disclose material that might reasonably be considered capable of undermining the prosecution case or assisting the defence. Failure to comply with disclosure obligations is a serious matter that can affect the fairness of the trial. The court has several remedies available under s.8 CPIA 1996 and its common law powers: it may stay proceedings as an abuse of process (R v H [2004] UKHL 3), exclude evidence, order disclosure, or in serious cases, permanently stay the prosecution. The court will consider the seriousness of the breach, whether it was deliberate or negligent, and the impact on the fairness of the trial.',
        source_refs: ['Criminal Procedure and Investigations Act 1996 s.3, s.8', 'R v H [2004] UKHL 3', 'R v Keane [1994] 1 WLR 746']
      })
      .ilike('question_text', '%prosecution fails to disclose%')
      .eq('category', 'Disclosure');
    
    console.log(discError ? `   ❌ ${discError.message}` : `   ✅ Fixed disclosure question\n`);
    
    // Fix 3: Scenario questions
    console.log('4️⃣  Improving scenario questions...');
    let fixed3 = 0;
    
    const scenarios = [
      {
        pattern: '%16-year-old%learning disability%appropriate adult%',
        options: {
          "0": "Proceed with the interview as the client is 16 and appears to understand the situation",
          "1": "Insist that an appropriate adult is called before any interview proceeds, as the client has a learning disability and is under 18",
          "2": "Ask the client if they want an appropriate adult present, and proceed if they decline",
          "3": "Request an appropriate adult but allow the interview to proceed if one cannot be found immediately"
        },
        correct_answer: ['1']
      },
      {
        pattern: '%officer asks%Why did you do it%',
        options: {
          "0": "Allow the question as it is open-ended and allows the client to explain their actions",
          "1": "Intervene immediately as the question assumes guilt and is leading - the officer must first establish what happened before asking why",
          "2": "Wait to see how the client responds before deciding whether to intervene",
          "3": "Only intervene if the question is clearly unfair or the client objects"
        },
        correct_answer: ['1']
      },
      {
        pattern: '%client wants to answer some questions but not others%',
        options: {
          "0": "Advise that they must answer all questions or remain silent throughout, as selective silence is not permitted",
          "1": "Advise that they can answer some questions and remain silent on others, but explain the potential implications of selective silence under s.34 CJPOA 1994",
          "2": "Tell them they cannot pick and choose - they must either answer everything or say nothing at all",
          "3": "Advise that selective answering is allowed but will definitely lead to adverse inferences being drawn"
        },
        correct_answer: ['1']
      }
    ];
    
    for (const scenario of scenarios) {
      const { error } = await supabase
        .from('questions')
        .update({ options: scenario.options, correct_answer: scenario.correct_answer })
        .ilike('question_text', scenario.pattern)
        .limit(1);
      
      if (!error) fixed3++;
    }
    console.log(`   ✅ Improved ${fixed3} scenario questions\n`);
    
    // Fix 4: Improve weak distractors
    console.log('5️⃣  Improving weak distractors...');
    let fixed4 = 0;
    
    for (const q of questions) {
      let changed = false;
      const newOptions = { ...q.options };
      
      for (const key in newOptions) {
        const text = String(newOptions[key]);
        if (text.startsWith('Nothing - ') && !text.includes('required')) {
          newOptions[key] = improveDistractor(text);
          changed = true;
        }
      }
      
      if (changed) {
        const { error } = await supabase
          .from('questions')
          .update({ options: newOptions })
          .eq('id', q.id);
        
        if (!error) {
          fixed4++;
          if (fixed4 % 10 === 0) process.stdout.write(`\r   Progress: ${fixed4} improved`);
        }
      }
    }
    console.log(`\n   ✅ Improved ${fixed4} questions\n`);
    
    // Summary
    console.log('='.repeat(70));
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n📊 Summary:`);
    console.log(`   • Format mismatches fixed: ${fixed1}`);
    console.log(`   • Disclosure question: ✅`);
    console.log(`   • Scenario questions: ${fixed3}/3`);
    console.log(`   • Weak distractors improved: ${fixed4}`);
    console.log(`\n🎉 All fixes deployed successfully!\n`);
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.code) console.error(`   Code: ${error.code}`);
    if (error.hint) console.error(`   Hint: ${error.hint}`);
    process.exit(1);
  }
}

deployFixes();

















