/**
 * Error boundary fixes: Create missing error.tsx and loading.tsx files
 */

const fs = require('fs');
const path = require('path');

const errorTemplate = `'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
`;

const loadingTemplate = `export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
`;

async function apply(projectRoot) {
  let fixesApplied = 0;
  const errors = [];

  // Create error.tsx files
  const errorPaths = [
    { dir: path.join(projectRoot, 'app', '(main)'), file: 'error.tsx' },
    { dir: path.join(projectRoot, 'app', 'admin'), file: 'error.tsx' },
  ];

  for (const { dir, file } of errorPaths) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, errorTemplate, 'utf8');
        fixesApplied++;
      } catch (e) {
        errors.push({
          issue: `Failed to create ${filePath}`,
          error: e.message,
        });
      }
    }
  }

  // Create loading.tsx files (optional)
  const loadingPaths = [
    { dir: path.join(projectRoot, 'app', '(main)'), file: 'loading.tsx' },
  ];

  for (const { dir, file } of loadingPaths) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, loadingTemplate, 'utf8');
        fixesApplied++;
      } catch (e) {
        // Loading files are optional, don't treat as error
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
