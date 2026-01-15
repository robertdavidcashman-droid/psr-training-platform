const https = require('https');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjU4MzA5MCwiZXhwIjoyMDgyMTU5MDkwfQ.VQwFOyhb-ybYOO3oF7iimzttdZi3F5HAMsgvKYx5fpw';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'cvsawjrtgmsmadtrfwfa.supabase.co',
      port: 443,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    };
    if (bodyStr) options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch(e) { resolve(data); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function deploy() {
  console.log('\n🚀 DEPLOYING FIX TO PRODUCTION\n');
  console.log('='.repeat(70));
  
  try {
    console.log('📋 Fetching all approved questions...');
    const questions = await makeRequest('GET', '/rest/v1/questions?status=eq.approved&select=*');
    console.log(`   ✅ Found ${questions.length} approved questions\n`);
    
    const letterToNum = {'a':'0','b':'1','c':'2','d':'3','A':'0','B':'1','C':'2','D':'3'};
    const numToLetter = {'0':'a','1':'b','2':'c','3':'d'};
    
    let formatFixed = 0;
    let errors = 0;
    
    console.log('🔧 Fixing answer format mismatches...');
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
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
        
        try {
          await makeRequest('PATCH', `/rest/v1/questions?id=eq.${q.id}`, {
            correct_answer: normalized,
            updated_at: new Date().toISOString()
          });
          formatFixed++;
          if (formatFixed % 10 === 0) {
            process.stdout.write(`\r   Fixed: ${formatFixed}/${questions.length}`);
          }
        } catch (err) {
          errors++;
          console.error(`\n   ❌ Error fixing question ${q.id}: ${err.message}`);
        }
      }
    }
    
    console.log(`\n   ✅ Fixed ${formatFixed} format mismatches\n`);
    
    // Fix specific questions
    console.log('🎯 Fixing specific questions with improved distractors...');
    
    // Disclosure question
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
        updated_at: new Date().toISOString()
      });
      console.log('   ✅ Fixed disclosure question');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n📊 Results:`);
    console.log(`   Format fixes: ${formatFixed}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n🎉 Questions now have correct answer formats!`);
    console.log('\n🧪 Test at: http://localhost:3000/practice\n');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.code) console.error(`   Code: ${error.code}`);
    process.exit(1);
  }
}

deploy();
















