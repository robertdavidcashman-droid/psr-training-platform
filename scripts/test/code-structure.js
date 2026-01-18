/**
 * Code structure tests: File integrity, route mapping, duplicate files, imports
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

  // Critical library files
  const criticalLibFiles = [
    'lib/auth.ts',
    'lib/supabase/client.ts',
    'lib/supabase/server.ts',
    'lib/supabase/config.ts',
    'lib/supabase/middleware.ts',
    'lib/utils.ts',
    'lib/utils/error-handler.ts',
    'lib/activity-logger.ts',
    'lib/metadata.ts',
  ];

  for (const file of criticalLibFiles) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
    } else {
      results.failed++;
      results.issues.push({
        type: 'P0',
        issue: `Missing critical library file: ${file}`,
        file,
      });
    }
  }

  // Critical components
  const criticalComponents = [
    'components/theme/ThemeProvider.tsx',
    'components/search/SearchDialog.tsx',
    'components/layout/Header.tsx',
    'components/layout/Footer.tsx',
    'components/auth/InactivityTimeout.tsx',
    'components/charts/ProgressChartClient.tsx',
  ];

  for (const file of criticalComponents) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
    } else {
      results.failed++;
      results.issues.push({
        type: 'P0',
        issue: `Missing critical component: ${file}`,
        file,
      });
    }
  }

  // Check page files for declared routes
  const expectedPages = [
    'app/page.tsx',
    'app/(auth)/login/page.tsx',
    'app/(auth)/signup/page.tsx',
    'app/(main)/dashboard/page.tsx',
    'app/(main)/practice/page.tsx',
    'app/(main)/questions/page.tsx',
    'app/(main)/flashcards/page.tsx',
    'app/(main)/mock-exam/page.tsx',
    'app/(main)/study-plan/page.tsx',
    'app/(main)/bookmarks/page.tsx',
    'app/(main)/pace/page.tsx',
    'app/(main)/modules/page.tsx',
    'app/(main)/scenarios/page.tsx',
    'app/admin/page.tsx',
    'app/admin/questions/page.tsx',
    'app/admin/users/page.tsx',
  ];

  for (const file of expectedPages) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
    } else {
      results.failed++;
      results.issues.push({
        type: 'P1',
        issue: `Missing page: ${file}`,
        file,
      });
    }
  }

  // Check for duplicate backup files (*-Main-PC.*)
  if (globSync) {
    try {
      const backupFiles = globSync('**/*-Main-PC.*', {
        cwd: projectRoot,
        ignore: ['node_modules/**', '.next/**', '.git/**'],
      });

      if (backupFiles.length > 0) {
        results.failed++;
        results.issues.push({
          type: 'P2',
          issue: `Found ${backupFiles.length} backup files (*-Main-PC.*)`,
          files: backupFiles,
          fixable: true,
        });
      } else {
        results.passed++;
      }
    } catch (e) {
      // Skip if glob fails
    }
  }

  // Check API routes exist
  const apiRoutes = [
    'app/api/bookmarks/route.ts',
    'app/api/flashcards/route.ts',
    'app/api/study-plan/route.ts',
    'app/api/pace/route.ts',
    'app/api/progress/chart/route.ts',
    'app/api/activity/log/route.ts',
    'app/api/ai/generate-scenario/route.ts',
    'app/auth/callback/route.ts',
  ];

  for (const file of apiRoutes) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      results.passed++;
    } else {
      results.failed++;
      results.issues.push({
        type: 'P1',
        issue: `Missing API route: ${file}`,
        file,
      });
    }
  }

  // Check for orphaned pages (pages not linked in navigation)
  // Note: These may be intentionally not in main nav (specialized pages)
  const orphanedPages = [
    { page: 'app/(main)/portfolio/page.tsx', route: '/portfolio', type: 'P3' },
    { page: 'app/(main)/critical-incidents/page.tsx', route: '/critical-incidents', type: 'P3' },
  ];

  for (const { page, route, type } of orphanedPages) {
    const filePath = path.join(projectRoot, page);
    if (fs.existsSync(filePath)) {
      // Check if linked in Header (check both href strings and array definitions)
      const headerPath = path.join(projectRoot, 'components/layout/Header.tsx');
      if (fs.existsSync(headerPath)) {
        const headerContent = fs.readFileSync(headerPath, 'utf8');
        const hasRoute = headerContent.includes(`"${route}"`) || 
                        headerContent.includes(`'${route}'`) ||
                        headerContent.includes(`href: '${route}'`) ||
                        headerContent.includes(`href: "${route}"`);
        if (!hasRoute) {
          results.issues.push({
            type,
            issue: `Page ${route} not in main navigation (may be intentional)`,
            file: page,
          });
        } else {
          results.passed++;
        }
      }
    }
  }

  return results;
}

module.exports = { run };
