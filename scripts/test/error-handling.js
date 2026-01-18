/**
 * Error handling tests: Error boundaries, loading states
 */

const fs = require('fs');
const path = require('path');

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  // Check for error.tsx files
  const errorPaths = [
    { dir: 'app/(main)', file: 'error.tsx', type: 'P2' },
    { dir: 'app/admin', file: 'error.tsx', type: 'P2' },
    { dir: 'app/(auth)', file: 'error.tsx', type: 'P3' },
  ];

  for (const { dir, file, type } of errorPaths) {
    const filePath = path.join(projectRoot, dir, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
      
      // Check if error.tsx has proper structure
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content.includes('use client') && !content.includes("'use client'")) {
        results.failed++;
        results.issues.push({
          type,
          issue: `${file} missing 'use client' directive`,
          file: `${dir}/${file}`,
          fixable: true,
        });
      }
      
      if (!content.includes('error') || !content.includes('reset')) {
        results.failed++;
        results.issues.push({
          type,
          issue: `${file} missing error/reset props`,
          file: `${dir}/${file}`,
          fixable: true,
        });
      }
    } else {
      results.failed++;
      results.issues.push({
        type,
        issue: `Missing error boundary: ${dir}/${file}`,
        file: `${dir}/${file}`,
        fixable: true,
      });
    }
  }

  // Check for loading.tsx files (optional but nice to have)
  const loadingPaths = [
    { dir: 'app/(main)', file: 'loading.tsx', type: 'P3' },
  ];

  for (const { dir, file, type } of loadingPaths) {
    const filePath = path.join(projectRoot, dir, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
    } else {
      // Not critical, just a warning
      results.issues.push({
        type,
        issue: `Missing loading state: ${dir}/${file} (optional)`,
        file: `${dir}/${file}`,
        fixable: true,
      });
    }
  }

  return results;
}

module.exports = { run };
