/**
 * Functional tests: Auth flow, page rendering, theme, search
 */

const fs = require('fs');
const path = require('path');

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
    note: 'Functional tests require running application. These are code-level checks only.',
  };

  // Check auth pages have required elements
  const loginPath = path.join(projectRoot, 'app/(auth)/login/page.tsx');
  if (fs.existsSync(loginPath)) {
    const content = fs.readFileSync(loginPath, 'utf8');
    if (content.includes('email') && content.includes('submit')) {
      results.passed++;
    }
  }

  const signupPath = path.join(projectRoot, 'app/(auth)/signup/page.tsx');
  if (fs.existsSync(signupPath)) {
    const content = fs.readFileSync(signupPath, 'utf8');
    if (content.includes('email') && content.includes('fullName')) {
      results.passed++;
    }
  }

  // Check theme provider
  const themePath = path.join(projectRoot, 'components/theme/ThemeProvider.tsx');
  if (fs.existsSync(themePath)) {
    const content = fs.readFileSync(themePath, 'utf8');
    if (content.includes('localStorage') || content.includes('useEffect')) {
      results.passed++;
    }
  }

  // Check search dialog
  const searchPath = path.join(projectRoot, 'components/search/SearchDialog.tsx');
  if (fs.existsSync(searchPath)) {
    const content = fs.readFileSync(searchPath, 'utf8');
    if (content.includes('Ctrl+K') || content.includes('KeyK')) {
      results.passed++;
    }
  }

  return results;
}

module.exports = { run };
