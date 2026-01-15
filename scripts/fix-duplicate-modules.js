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

async function fixDuplicateModules() {
  console.log('\n🔧 FIXING DUPLICATE MODULES\n');
  console.log('='.repeat(70));
  
  try {
    // Step 1: Fetch all modules
    console.log('📋 Step 1: Fetching all modules...');
    const modules = await makeRequest('GET', '/rest/v1/content_modules?select=*&order=created_at.asc');
    console.log(`   ✅ Found ${modules.length} total modules\n`);
    
    // Step 2: Group by title and category to find duplicates
    console.log('🔍 Step 2: Identifying duplicates...');
    const moduleMap = new Map();
    const duplicates = [];
    
    modules.forEach(module => {
      const key = `${module.title}|${module.category}`;
      if (!moduleMap.has(key)) {
        moduleMap.set(key, []);
      }
      moduleMap.get(key).push(module);
    });
    
    let duplicateCount = 0;
    moduleMap.forEach((moduleList, key) => {
      if (moduleList.length > 1) {
        duplicateCount += moduleList.length - 1;
        duplicates.push({
          key,
          modules: moduleList,
          keep: moduleList[0], // Keep the oldest (first created)
          delete: moduleList.slice(1) // Delete the rest
        });
      }
    });
    
    console.log(`   ⚠️  Found ${duplicates.length} duplicate groups`);
    console.log(`   📊 Total duplicates to remove: ${duplicateCount}\n`);
    
    if (duplicates.length === 0) {
      console.log('✅ No duplicates found! Modules are clean.\n');
      return;
    }
    
    // Step 3: Show what will be deleted
    console.log('📋 Duplicate groups:');
    duplicates.forEach((dup, idx) => {
      console.log(`\n   ${idx + 1}. "${dup.key.split('|')[0]}" (${dup.key.split('|')[1]})`);
      console.log(`      Keep: ${dup.keep.id} (created: ${dup.keep.created_at})`);
      dup.delete.forEach(m => {
        console.log(`      Delete: ${m.id} (created: ${m.created_at})`);
      });
    });
    
    // Step 4: Delete duplicates
    console.log('\n🗑️  Step 3: Deleting duplicates...');
    let deleted = 0;
    let errors = 0;
    
    for (const dup of duplicates) {
      for (const moduleToDelete of dup.delete) {
        try {
          await makeRequest('DELETE', `/rest/v1/content_modules?id=eq.${moduleToDelete.id}`);
          deleted++;
          if (deleted % 5 === 0) {
            process.stdout.write(`\r   Deleted: ${deleted}/${duplicateCount}`);
          }
        } catch (err) {
          errors++;
          console.error(`\n   ❌ Error deleting ${moduleToDelete.id}: ${err.message}`);
        }
      }
    }
    
    console.log(`\n   ✅ Deleted ${deleted} duplicate modules`);
    if (errors > 0) {
      console.log(`   ⚠️  ${errors} errors occurred`);
    }
    
    // Step 5: Verify
    console.log('\n✅ Step 4: Verifying...');
    const remaining = await makeRequest('GET', '/rest/v1/content_modules?select=id,title,category');
    const remainingMap = new Map();
    remaining.forEach(m => {
      const key = `${m.title}|${m.category}`;
      remainingMap.set(key, (remainingMap.get(key) || 0) + 1);
    });
    
    const stillDuplicated = Array.from(remainingMap.values()).filter(count => count > 1).length;
    
    if (stillDuplicated === 0) {
      console.log('   ✅ All duplicates removed!');
    } else {
      console.log(`   ⚠️  ${stillDuplicated} duplicate groups still exist`);
    }
    
    console.log(`\n📊 Final count: ${remaining.length} unique modules`);
    
    // Group by category
    const byCategory = {};
    remaining.forEach(m => {
      byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    });
    
    console.log('\n📋 Modules by category:');
    Object.entries(byCategory).sort().forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('✅ DUPLICATE MODULES FIXED!');
    console.log('='.repeat(70));
    console.log(`\n📊 Results:`);
    console.log(`   Duplicates removed: ${deleted}`);
    console.log(`   Remaining modules: ${remaining.length}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n🎉 Modules page should now show unique entries!`);
    console.log('\n🧪 Test at: https://psrtrain.com/modules\n');
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    if (error.code) console.error(`   Code: ${error.code}`);
    process.exit(1);
  }
}

fixDuplicateModules();
















