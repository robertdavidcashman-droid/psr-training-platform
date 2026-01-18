/**
 * Metadata auto-fixes: Add missing metadata to layout and pages
 */

const fs = require('fs');
const path = require('path');

const metadataTemplate = `export const metadata = {
  title: {
    default: 'PSR Train - Police Station Representative Training',
    template: '%s | PSR Train'
  },
  description: 'Professional training platform for Police Station Representatives. Practice questions, mock exams, PACE codes, and comprehensive study materials.',
  keywords: ['PSR', 'Police Station Representative', 'PACE', 'Training', 'Legal Training'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://psrtrain.com'),
  alternates: {
    canonical: '/',
  },
};`;

function generatePageMetadata(route) {
  const routeNames = {
    '/dashboard': { title: 'Dashboard', desc: 'Your learning dashboard with progress, stats, and quick actions.' },
    '/practice': { title: 'Practice Questions', desc: 'Practice PSR exam questions with instant feedback and explanations.' },
    '/questions': { title: 'Question Bank', desc: 'Browse and search through the complete PSR question bank.' },
    '/flashcards': { title: 'Flashcards', desc: 'Review flashcards with spaced repetition for effective memorization.' },
    '/mock-exam': { title: 'Mock Exam', desc: 'Take a timed mock exam to test your knowledge under exam conditions.' },
    '/study-plan': { title: 'Study Plan', desc: 'Create and manage your personalized study plan with exam countdown.' },
    '/bookmarks': { title: 'Bookmarks', desc: 'Access your bookmarked questions and modules.' },
    '/pace': { title: 'PACE Code', desc: 'Browse and search PACE code sections and references.' },
    '/modules': { title: 'Learning Modules', desc: 'Explore structured learning modules on PSR topics.' },
    '/scenarios': { title: 'Scenarios', desc: 'Practice with real-world PSR scenarios and case studies.' },
  };

  const info = routeNames[route] || { 
    title: route.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    desc: `PSR training content for ${route}` 
  };

  return `export const metadata = {
  title: '${info.title}',
  description: '${info.desc}',
};`;
}

async function apply(projectRoot) {
  let fixesApplied = 0;
  const errors = [];

  // Fix root layout metadata
  const layoutPath = path.join(projectRoot, 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    if (!content.includes('export const metadata')) {
      // Find a good place to insert metadata (after imports, before component)
      const importEnd = content.lastIndexOf('import');
      if (importEnd !== -1) {
        const importLineEnd = content.indexOf('\n', importEnd);
        if (importLineEnd !== -1) {
          const beforeComponent = content.indexOf('export default');
          if (beforeComponent !== -1) {
            content = 
              content.substring(0, importLineEnd + 1) +
              '\n' + metadataTemplate + '\n' +
              content.substring(importLineEnd + 1);
            
            fs.writeFileSync(layoutPath, content, 'utf8');
            fixesApplied++;
          }
        }
      }
    } else {
      // Check if canonical/metadataBase is missing
      if (!content.includes('metadataBase') && !content.includes('canonical')) {
        // Try to update existing metadata
        const metadataMatch = content.match(/export const metadata\s*=\s*\{[^}]*\}/s);
        if (metadataMatch) {
          let metadataBlock = metadataMatch[0];
          if (!metadataBlock.includes('metadataBase')) {
            metadataBlock = metadataBlock.replace(
              /(\s*\};)/,
              `,\n  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://psrtrain.com'),\n  alternates: {\n    canonical: '/',\n  }$1`
            );
            content = content.replace(metadataMatch[0], metadataBlock);
            fs.writeFileSync(layoutPath, content, 'utf8');
            fixesApplied++;
          }
        }
      }
    }
  }

  // Fix page-specific metadata (sample - can be expanded)
  const pagesToCheck = [
    'app/(main)/dashboard/page.tsx',
    'app/(main)/practice/page.tsx',
  ];

  for (const pagePath of pagesToCheck) {
    const fullPath = path.join(projectRoot, pagePath);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (!content.includes('export const metadata')) {
        // Extract route from path
        const route = '/' + pagePath.replace('app/(main)/', '').replace('/page.tsx', '');
        const pageMetadata = generatePageMetadata(route);
        
        // Insert before component export
        const exportDefault = content.indexOf('export default');
        if (exportDefault !== -1) {
          content = pageMetadata + '\n\n' + content;
          fs.writeFileSync(fullPath, content, 'utf8');
          fixesApplied++;
        }
      }
    }
  }

  return {
    success: fixesApplied > 0,
    fixesApplied,
    errors,
  };
}

module.exports = { apply };
