/**
 * Component tests: Footer links, navigation, accessibility
 */

const fs = require('fs');
const path = require('path');

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  // Check footer for typos
  const footerPath = path.join(projectRoot, 'components', 'layout', 'Footer.tsx');
  if (fs.existsSync(footerPath)) {
    const content = fs.readFileSync(footerPath, 'utf8');
    
    const typos = [
      { pattern: /pleastationagent\.com/g, correct: 'policestationagent.com', type: 'P1' },
      { pattern: /pleastationrepuk\.com/g, correct: 'policestationrepuk.com', type: 'P1' },
    ];

    for (const { pattern, correct, type } of typos) {
      if (pattern.test(content)) {
        results.failed++;
        results.issues.push({
          type,
          issue: `Footer contains typo: should be ${correct}`,
          file: 'components/layout/Footer.tsx',
          fixable: true,
        });
      } else {
        results.passed++;
      }
    }

    // Check for broken external links
    const externalLinkPattern = /href=["'](https?:\/\/[^"']+)["']/g;
    const links = [...content.matchAll(externalLinkPattern)];
    for (const match of links) {
      const url = match[1];
      if (url.includes('pleastation')) {
        results.failed++;
        results.issues.push({
          type: 'P1',
          issue: `Broken external link: ${url}`,
          file: 'components/layout/Footer.tsx',
          fixable: true,
        });
      }
    }
  }

  // Check header navigation (check for array definitions or href strings)
  const headerPath = path.join(projectRoot, 'components', 'layout', 'Header.tsx');
  if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8');
    
    // Check for main navigation links (can be in arrays or direct href)
    const expectedRoutes = [
      '/dashboard',
      '/practice',
      '/questions',
      '/flashcards',
      '/mock-exam',
    ];

    for (const route of expectedRoutes) {
      // Check if route exists in href strings OR in array definitions (e.g., href: '/practice')
      const hasDirectHref = content.includes(`href="${route}"`) || content.includes(`href='${route}'`);
      const hasInArray = content.includes(`href: '${route}'`) || content.includes(`href: "${route}"`);
      
      if (hasDirectHref || hasInArray) {
        results.passed++;
      } else {
        // Not critical if it's in secondary menu, just note it
        results.issues.push({
          type: 'P3',
          issue: `Route ${route} not found in navigation (may be in secondary menu)`,
          file: 'components/layout/Header.tsx',
        });
      }
    }
  }

  // Check accessibility - aria-labels on logo
  if (fs.existsSync(headerPath)) {
    const content = fs.readFileSync(headerPath, 'utf8');
    const logoPattern = /(role=["']img["']|aria-label)/;
    
    // Look for logo divs without aria-label
    const logoDivs = content.match(/<div[^>]*PSR[^>]*>/g);
    if (logoDivs) {
      for (const logoDiv of logoDivs) {
        if (!logoPattern.test(logoDiv)) {
          results.failed++;
          results.issues.push({
            type: 'P3',
            issue: 'Logo div missing aria-label or role',
            file: 'components/layout/Header.tsx',
            fixable: true,
          });
          break;
        }
      }
    }
  }

  return results;
}

module.exports = { run };
