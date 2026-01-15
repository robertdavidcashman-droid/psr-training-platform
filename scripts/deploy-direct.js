/**
 * Direct API deployment - bypasses Supabase client library
 */

const https = require('https');

const SERVICE_KEY = process.argv[2];
const SUPABASE_URL = 'https://cvsawjrtgmsmadtfwfa.supabase.co';

if (!SERVICE_KEY) {
  console.error('❌ Service key required');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'cvsawjrtgmsmadtfwfa.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    };

    if (body) {
      const bodyStr = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function deploy() {
  console.log('\n🚀 Deploying Fixes (Direct API)\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Get all questions
    console.log('1️⃣  Fetching questions...');
    const questions = await makeRequest('GET', '/rest/v1/questions?status=eq.approved&select=*');
    console.log(`   ✅ Found ${questions.length} questions\n`);
    
    const letterToNum = { 'a': '0', 'b': '1', 'c': '2', 'd': '3', 'A': '0', 'B': '1', 'C': '2', 'D': '3' };
    const numToLetter = { '0': 'a', '1': 'b', '2': 'c', '3': 'd' };
    
    // 2. Fix format mismatches
    console.log('2️⃣  Fixing format mismatches...');
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
        
        await makeRequest('PATCH', `/rest/v1/questions?id=eq.${q.id}`, { correct_answer: normalized });
        fixed1++;
        process.stdout.write(`\r   Fixed: ${fixed1}`);
      }
    }
    console.log(`\n   ✅ Fixed ${fixed1} format mismatches\n`);
    
    // 3. Fix disclosure question
    console.log('3️⃣  Fixing disclosure question...');
    const disclosureQ = questions.find(q => 
      q.question_text?.toLowerCase().includes('prosecution fails to disclose') && 
      q.category === 'Disclosure'
    );
    
    if (disclosureQ) {
      await makeRequest('PATCH', `/rest/v1/questions?id=eq.${disclosureQ.id}`, {
        correct_answer: ['1'],
        options: {
          "0": "Disclosure is not mandatory under CPIA 1996 - it is at the prosecution's discretion",
          "1": "The court may stay proceedings as an abuse of process, exclude evidence, or order disclosure. In serious cases, the prosecution may be stayed permanently",
          "2": "The court must automatically acquit the defendant without considering the evidence",
          "3": "The court can only order disclosure but cannot stay proceedings or exclude evidence"
        },
        explanation: 'Under CPIA 1996, the prosecution has a duty to disclose material that might reasonably be considered capable of undermining the prosecution case or assisting the defence. Failure to comply with disclosure obligations is a serious matter that can affect the fairness of the trial. The court has several remedies available under s.8 CPIA 1996 and its common law powers: it may stay proceedings as an abuse of process (R v H [2004] UKHL 3), exclude evidence, order disclosure, or in serious cases, permanently stay the prosecution.',
        source_refs: ['Criminal Procedure and Investigations Act 1996 s.3, s.8', 'R v H [2004] UKHL 3', 'R v Keane [1994] 1 WLR 746']
      });
      console.log('   ✅ Fixed disclosure question\n');
    }
    
    // 4. Fix scenarios
    console.log('4️⃣  Fixing scenario questions...');
    let fixed3 = 0;
    
    const scenarios = [
      {
        find: (q) => q.question_text?.includes('16-year-old') && q.question_text?.includes('learning disability'),
        options: {
          "0": "Proceed with the interview as the client is 16 and appears to understand the situation",
          "1": "Insist that an appropriate adult is called before any interview proceeds, as the client has a learning disability and is under 18",
          "2": "Ask the client if they want an appropriate adult present, and proceed if they decline",
          "3": "Request an appropriate adult but allow the interview to proceed if one cannot be found immediately"
        },
        correct_answer: ['1']
      },
      {
        find: (q) => q.question_text?.includes('Why did you do it'),
        options: {
          "0": "Allow the question as it is open-ended and allows the client to explain their actions",
          "1": "Intervene immediately as the question assumes guilt and is leading - the officer must first establish what happened before asking why",
          "2": "Wait to see how the client responds before deciding whether to intervene",
          "3": "Only intervene if the question is clearly unfair or the client objects"
        },
        correct_answer: ['1']
      },
      {
        find: (q) => q.question_text?.includes('pick and choose'),
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
      const q = questions.find(scenario.find);
      if (q) {
        await makeRequest('PATCH', `/rest/v1/questions?id=eq.${q.id}`, {
          options: scenario.options,
          correct_answer: scenario.correct_answer
        });
        fixed3++;
      }
    }
    console.log(`   ✅ Fixed ${fixed3} scenarios\n`);
    
    // 5. Fix weak distractors
    console.log('5️⃣  Fixing weak distractors...');
    let fixed4 = 0;
    
    for (const q of questions) {
      let changed = false;
      const newOpts = { ...q.options };
      
      for (const key in newOpts) {
        const text = String(newOpts[key]);
        if (text.startsWith('Nothing - ') && !text.includes('required')) {
          newOpts[key] = text.replace('Nothing - ', 'This is not mandatory - ');
          changed = true;
        }
      }
      
      if (changed) {
        await makeRequest('PATCH', `/rest/v1/questions?id=eq.${q.id}`, { options: newOpts });
        fixed4++;
        if (fixed4 % 5 === 0) process.stdout.write(`\r   Fixed: ${fixed4}`);
      }
    }
    console.log(`\n   ✅ Fixed ${fixed4} weak distractors\n`);
    
    // Summary
    console.log('='.repeat(60));
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Results:`);
    console.log(`   Format mismatches: ${fixed1}`);
    console.log(`   Disclosure question: ✅`);
    console.log(`   Scenario questions: ${fixed3}`);
    console.log(`   Weak distractors: ${fixed4}`);
    console.log(`\n🎉 All fixes deployed!\n`);
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

deploy();

















