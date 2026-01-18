/**
 * API route tests: Authentication checks, validation, response formats
 */

const fs = require('fs');
const path = require('path');

async function run(projectRoot) {
  const results = {
    passed: 0,
    failed: 0,
    issues: [],
  };

  // API routes that should check authentication
  const protectedRoutes = [
    'app/api/bookmarks/route.ts',
    'app/api/flashcards/route.ts',
    'app/api/study-plan/route.ts',
    'app/api/progress/chart/route.ts',
    'app/api/activity/log/route.ts',
  ];

  for (const routeFile of protectedRoutes) {
    const filePath = path.join(projectRoot, routeFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for authentication
      if (content.includes('getUser()') || content.includes('getUser(')) {
        results.passed++;
      } else {
        results.failed++;
        results.issues.push({
          type: 'P1',
          issue: `API route missing authentication check: ${routeFile}`,
          file: routeFile,
          fixable: true,
        });
      }
      
      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        results.passed++;
      } else {
        results.failed++;
        results.issues.push({
          type: 'P2',
          issue: `API route missing error handling: ${routeFile}`,
          file: routeFile,
          fixable: true,
        });
      }
      
      // Check for proper response format
      if (content.includes('NextResponse.json')) {
        results.passed++;
      } else {
        results.failed++;
        results.issues.push({
          type: 'P2',
          issue: `API route not using NextResponse.json: ${routeFile}`,
          file: routeFile,
          fixable: true,
        });
      }
    }
  }

  return results;
}

module.exports = { run };
