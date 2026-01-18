/**
 * Metadata tests: SEO metadata, page titles, canonical URLs
 */

const fs = require('fs');
const path = require('path');

// Try to load glob, but handle if not available
let globSync;
try {
  const glob = require('glob');
  globSync = glob.globSync || glob.sync;
} catch (e) {
  // glob not available, will skip those checks
}

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  // Check root layout metadata
  const layoutPath = path.join(projectRoot, 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const content = fs.readFileSync(layoutPath, 'utf8');
    
    if (content.includes('export const metadata')) {
      results.passed++;
      
      // Check if it has required fields
      if (!content.includes('title') && !content.includes('Title')) {
        results.failed++;
        results.issues.push({
          type: 'P0',
          issue: 'Metadata missing title field',
          file: 'app/layout.tsx',
          fixable: true,
        });
      }
      
      if (!content.includes('description')) {
        results.failed++;
        results.issues.push({
          type: 'P1',
          issue: 'Metadata missing description',
          file: 'app/layout.tsx',
          fixable: true,
        });
      }
      
      if (!content.includes('metadataBase') && !content.includes('canonical')) {
        results.failed++;
        results.issues.push({
          type: 'P1',
          issue: 'Metadata missing canonical URL configuration',
          file: 'app/layout.tsx',
          fixable: true,
        });
      }
    } else {
      results.failed++;
      results.issues.push({
        type: 'P0',
        issue: 'Missing metadata export in app/layout.tsx',
        file: 'app/layout.tsx',
        fixable: true,
      });
    }
  }

  // Check page-specific metadata
  if (globSync) {
    try {
      const pageFiles = globSync('app/**/page.tsx', {
        cwd: projectRoot,
        ignore: ['node_modules/**', '.next/**'],
      });

    const pagesWithMetadata = [];
    const pagesWithoutMetadata = [];

    for (const pageFile of pageFiles) {
      const filePath = path.join(projectRoot, pageFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if it's a dynamic route or special page
      if (pageFile.includes('[id]') || pageFile.includes('(auth)') || pageFile === 'app/page.tsx') {
        continue;
      }

      if (content.includes('export const metadata')) {
        pagesWithMetadata.push(pageFile);
        results.passed++;
      } else {
        pagesWithoutMetadata.push(pageFile);
        results.failed++;
        results.issues.push({
          type: 'P1',
          issue: `Missing metadata in ${pageFile}`,
          file: pageFile,
          fixable: true,
        });
      }
      }
    } catch (e) {
      // Skip if glob fails
    }
  }

  return results;
}

module.exports = { run };
