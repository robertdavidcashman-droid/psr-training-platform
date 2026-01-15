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

async function deployFlashcardUpdates() {
  console.log('\n🎴 DEPLOYING FLASHCARD UPDATES\n');
  console.log('='.repeat(70));
  
  try {
    // Fetch all flashcards to update
    console.log('📋 Fetching flashcards...');
    const flashcards = await makeRequest('GET', '/rest/v1/flashcards?select=*');
    console.log(`   ✅ Found ${flashcards.length} flashcards\n`);
    
    let updated = 0;
    let skipped = 0;
    
    console.log('🔧 Updating flashcards with statute information...');
    
    // Define statute mappings
    const statuteMappings = [
      { pattern: /pace.*a|stop.*search/i, statute: 'PACE Code A', section: 'Stop and Search' },
      { pattern: /pace.*b|search.*premises/i, statute: 'PACE Code B', section: 'Search of Premises' },
      { pattern: /pace.*c|detention|interview/i, statute: 'PACE Code C', section: 'Detention and Questioning' },
      { pattern: /pace.*d|identification/i, statute: 'PACE Code D', section: 'Identification' },
      { pattern: /pace.*e|audio.*record/i, statute: 'PACE Code E', section: 'Audio Recording' },
      { pattern: /pace.*f|video.*record/i, statute: 'PACE Code F', section: 'Video Recording' },
      { pattern: /pace.*g|arrest/i, statute: 'PACE Code G', section: 'Arrest' },
      { pattern: /pace.*h|terrorism/i, statute: 'PACE Code H', section: 'Terrorism Detention' },
      { pattern: /cpia|disclosure/i, statute: 'CPIA 1996', section: 'Disclosure' },
      { pattern: /legal.*aid|laspo/i, statute: 'Legal Aid, Sentencing and Punishment of Offenders Act 2012', section: 'Legal Aid' },
      { pattern: /youth|juvenile/i, statute: 'Crime and Disorder Act 1998', section: 'Youth Justice' },
      { pattern: /bail/i, statute: 'Bail Act 1976', section: 'Bail' },
      { pattern: /cja|criminal justice/i, statute: 'Criminal Justice Act 2003', section: 'Various' },
      { pattern: /conduct|ethics|professional/i, statute: 'SRA Standards and Regulations', section: 'Professional Conduct' },
      { pattern: /pace/i, statute: 'PACE 1984', section: 'Main Act' },
    ];
    
    for (let i = 0; i < flashcards.length; i++) {
      const card = flashcards[i];
      
      // Skip if already has statute
      if (card.statute && card.section) {
        skipped++;
        continue;
      }
      
      // Find matching statute
      let matched = false;
      for (const mapping of statuteMappings) {
        if (card.category && mapping.pattern.test(card.category)) {
          try {
            await makeRequest('PATCH', `/rest/v1/flashcards?id=eq.${card.id}`, {
              statute: mapping.statute,
              section: mapping.section
            });
            updated++;
            matched = true;
            if (updated % 5 === 0) {
              process.stdout.write(`\r   Updated: ${updated}/${flashcards.length - skipped}`);
            }
            break;
          } catch (err) {
            console.error(`\n   ❌ Error updating flashcard ${card.id}: ${err.message}`);
          }
        }
      }
      
      // Default fallback for unmatched
      if (!matched && !card.statute) {
        try {
          await makeRequest('PATCH', `/rest/v1/flashcards?id=eq.${card.id}`, {
            statute: 'Various Statutes',
            section: 'Criminal Law'
          });
          updated++;
          if (updated % 5 === 0) {
            process.stdout.write(`\r   Updated: ${updated}/${flashcards.length - skipped}`);
          }
        } catch (err) {
          console.error(`\n   ❌ Error updating flashcard ${card.id}: ${err.message}`);
        }
      }
    }
    
    console.log(`\n   ✅ Updated ${updated} flashcards\n`);
    console.log(`   ⏭️  Skipped ${skipped} (already had statute)\n`);
    
    console.log('='.repeat(70));
    console.log('✅ FLASHCARD DEPLOYMENT COMPLETE!');
    console.log('='.repeat(70));
    console.log(`\n📊 Results:`);
    console.log(`   Total flashcards: ${flashcards.length}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`\n🎉 Flashcards now show statute and section information!`);
    console.log('\n🧪 Test at: http://localhost:3000/flashcards\n');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.code) console.error(`   Code: ${error.code}`);
    process.exit(1);
  }
}

deployFlashcardUpdates();
















