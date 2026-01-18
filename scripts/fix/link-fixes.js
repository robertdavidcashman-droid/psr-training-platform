/**
 * Link fixes: Fix footer typos, add missing navigation links
 */

const fs = require('fs');
const path = require('path');

async function apply(projectRoot) {
  let fixesApplied = 0;
  const errors = [];

  // Fix footer link typos
  const footerPath = path.join(projectRoot, 'components', 'layout', 'Footer.tsx');
  if (fs.existsSync(footerPath)) {
    let content = fs.readFileSync(footerPath, 'utf8');
    let modified = false;

    // Fix typo: pleastationagent.com -> policestationagent.com
    if (content.includes('pleastationagent.com')) {
      content = content.replace(/pleastationagent\.com/g, 'policestationagent.com');
      modified = true;
    }

    // Fix typo: pleastationrepuk.com -> policestationrepuk.com
    if (content.includes('pleastationrepuk.com')) {
      content = content.replace(/pleastationrepuk\.com/g, 'policestationrepuk.com');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(footerPath, content, 'utf8');
      fixesApplied++;
    }
  }

  // Add missing navigation links to header (if needed)
  const headerPath = path.join(projectRoot, 'components', 'layout', 'Header.tsx');
  if (fs.existsSync(headerPath)) {
    let content = fs.readFileSync(headerPath, 'utf8');
    
    // Check for bookmarks link
    if (!content.includes('href="/bookmarks"') && !content.includes("href='/bookmarks'")) {
      // Try to add to navigation (this is more complex, would need to parse structure)
      // For now, just note it
      errors.push({
        issue: 'Bookmarks not in navigation - requires manual addition',
        file: 'components/layout/Header.tsx',
      });
    }

    // Check for certificates link
    if (!content.includes('href="/certificates"') && !content.includes("href='/certificates'")) {
      errors.push({
        issue: 'Certificates not in navigation - requires manual addition',
        file: 'components/layout/Header.tsx',
      });
    }
  }

  return {
    success: fixesApplied > 0,
    fixesApplied,
    errors,
  };
}

module.exports = { apply };
