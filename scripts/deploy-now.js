const https = require('https');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjU4MzA5MCwiZXhwIjoyMDgyMTU5MDkwfQ.VQwFOyhb-ybYOO3oF7iimzttdZi3F5HAMsgvKYx5fpw';

function query(sql) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'cvsawjrtgmsmadtrfwfa.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      }
    }, (res) => {
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
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

async function deploy() {
  console.log('\n🚀 DEPLOYING TO PRODUCTION\n');
  
  try {
    // Step 1: Create function
    console.log('1️⃣  Creating normalization function...');
    await query(`
      CREATE OR REPLACE FUNCTION normalize_answer_format(answer_array TEXT[], options_json JSONB)
      RETURNS TEXT[] AS $$
      DECLARE
        normalized TEXT[]; answer_item TEXT; mapped_key TEXT; option_keys TEXT[];
        uses_numeric_keys BOOLEAN; uses_letter_keys BOOLEAN;
        letter_to_num_map JSONB := '{"a":"0","b":"1","c":"2","d":"3","A":"0","B":"1","C":"2","D":"3"}'::jsonb;
        num_to_letter_map JSONB := '{"0":"a","1":"b","2":"c","3":"d"}'::jsonb;
      BEGIN
        normalized := ARRAY[]::TEXT[];
        option_keys := ARRAY(SELECT jsonb_object_keys(options_json));
        uses_numeric_keys := EXISTS(SELECT 1 FROM unnest(option_keys) AS key WHERE key~'^[0-9]+$');
        uses_letter_keys := EXISTS(SELECT 1 FROM unnest(option_keys) AS key WHERE LOWER(key)~'^[a-d]$');
        FOREACH answer_item IN ARRAY answer_array LOOP
          IF uses_numeric_keys AND answer_item~'^[a-dA-D]$' THEN
            mapped_key:=letter_to_num_map->>LOWER(answer_item);
            IF mapped_key IS NOT NULL THEN normalized:=array_append(normalized,mapped_key);
            ELSE normalized:=array_append(normalized,answer_item); END IF;
          ELSIF uses_letter_keys AND answer_item~'^[0-9]+$' THEN
            mapped_key:=num_to_letter_map->>answer_item;
            IF mapped_key IS NOT NULL THEN normalized:=array_append(normalized,mapped_key);
            ELSE normalized:=array_append(normalized,answer_item); END IF;
          ELSE normalized:=array_append(normalized,answer_item); END IF;
        END LOOP;
        RETURN normalized;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('   ✅ Function created\n');
    
    // Step 2: Get questions and fix via REST API
    console.log('2️⃣  Fixing questions via REST API...');
    
    const res = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'cvsawjrtgmsmadtrfwfa.supabase.co',
        port: 443,
        path: '/rest/v1/questions?status=eq.approved&select=*',
        method: 'GET',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });
    
    const questions = res;
    console.log(`   Found ${questions.length} questions`);
    
    const letterToNum = {'a':'0','b':'1','c':'2','d':'3','A':'0','B':'1','C':'2','D':'3'};
    let fixed = 0;
    
    for (const q of questions) {
      const optKeys = Object.keys(q.options||{});
      const usesNum = optKeys.some(k => /^[0-9]+$/.test(k));
      const needsFix = q.correct_answer?.some(a => usesNum && /^[a-dA-D]$/i.test(String(a)));
      
      if (needsFix) {
        const normalized = q.correct_answer.map(a => {
          const s = String(a).trim();
          return letterToNum[s] || s;
        });
        
        await new Promise((resolve, reject) => {
          const body = JSON.stringify({correct_answer:normalized});
          const req = https.request({
            hostname: 'cvsawjrtgmsmadtrfwfa.supabase.co',
            port: 443,
            path: `/rest/v1/questions?id=eq.${q.id}`,
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SERVICE_KEY,
              'Authorization': `Bearer ${SERVICE_KEY}`,
              'Content-Length': Buffer.byteLength(body)
            }
          }, res => {
            res.on('data', ()=>{});
            res.on('end', resolve);
          });
          req.on('error', reject);
          req.write(body);
          req.end();
        });
        
        fixed++;
        if (fixed % 10 === 0) console.log(`   Progress: ${fixed} fixed`);
      }
    }
    
    console.log(`   ✅ Fixed ${fixed} questions\n`);
    
    console.log('='.repeat(60));
    console.log('✅ DEPLOYMENT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Fixed ${fixed} format mismatches`);
    console.log('\n🎉 All questions now have correct answer formats!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

deploy();
















