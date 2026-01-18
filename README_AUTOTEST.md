# Comprehensive Autotest and Autofix System

This system provides comprehensive automated testing and fixing for the PSR Train application. It tests everything and automatically fixes common issues to ensure the app works perfectly.

## Quick Start

Run the comprehensive autotest and autofix system:

```bash
npm run test:autofix
```

Or directly:

```bash
node scripts/autotest-and-autofix.js
```

## What It Does

### 1. Pre-Flight Checks
- ✅ Validates environment variables (`.env.local`)
- ✅ Checks TypeScript compilation
- ✅ Verifies Next.js build
- ✅ Runs linter checks
- ✅ Validates configuration files

### 2. Code Structure Tests
- ✅ Verifies critical library files exist
- ✅ Checks all required components are present
- ✅ Validates page files for all routes
- ✅ Detects duplicate backup files
- ✅ Checks API route files
- ✅ Identifies orphaned pages

### 3. Metadata Tests
- ✅ Checks root layout metadata
- ✅ Validates page-specific metadata
- ✅ Verifies canonical URL configuration

### 4. Component Tests
- ✅ Checks footer links for typos
- ✅ Validates navigation links
- ✅ Checks accessibility (aria-labels)

### 5. Error Handling Tests
- ✅ Checks for error boundary files
- ✅ Validates error boundary structure
- ✅ Checks for loading states

### 6. API Route Tests
- ✅ Verifies authentication checks
- ✅ Validates error handling
- ✅ Checks response formats

### 7. Database Tests
- ✅ Notes available database fix scripts
- ✅ Integrates with existing fix scripts

### 8. Functional Tests
- ✅ Basic code-level functional checks

### 9. Auto-Fixes Applied
- ✅ **Metadata Fixes**: Adds missing metadata to layout and pages
- ✅ **Link Fixes**: Fixes footer typos
- ✅ **Error Boundaries**: Creates missing `error.tsx` files
- ✅ **Loading States**: Creates missing `loading.tsx` files

### 10. Post-Fix Verification
- ✅ Re-runs critical tests after fixes
- ✅ Verifies fixes didn't break anything

## Report Generated

After running, the system generates `AUTOTEST_REPORT.md` with:
- Executive summary
- Detailed test results by category
- Issues found (categorized by priority)
- Fixes applied
- Deployment readiness status

## Fix Priority System

- **P0 - Critical**: Blocks deployment (e.g., missing metadata, TypeScript errors)
- **P1 - High**: Should fix before deployment (e.g., broken links, missing page metadata)
- **P2 - Medium**: Fix soon (e.g., missing error boundaries, duplicate files)
- **P3 - Low**: Nice to have (e.g., loading states, minor accessibility)

## Known Issues from Previous Audits (All Auto-Fixable)

### From QA Audit:
- ✅ Footer link typos - **Auto-fixable**
- ✅ Missing root metadata - **Auto-fixable**
- ✅ Missing page metadata - **Auto-fixable**
- ✅ No canonical URLs - **Auto-fixable**
- ✅ Duplicate backup files - **Auto-fixable**
- ✅ Missing error boundaries - **Auto-fixable**

### From Fix Guides:
- ✅ Answer format issues - Uses existing scripts
- ✅ Weak distractors - Uses existing scripts

## Test Modules

Located in `scripts/test/`:
- `preflight-checks.js` - Environment and build validation
- `code-structure.js` - File integrity and route mapping
- `metadata.js` - SEO metadata tests
- `components.js` - Component and UI tests
- `error-handling.js` - Error boundary tests
- `api-routes.js` - API endpoint tests
- `database.js` - Database integrity tests
- `functional.js` - Functional code checks

## Fix Modules

Located in `scripts/fix/`:
- `metadata-fixes.js` - Metadata auto-fixes
- `link-fixes.js` - Link and navigation fixes
- `error-boundary-fixes.js` - Error boundary creation

## Integration with Existing Scripts

The system integrates with existing database fix scripts:
- `scripts/fix-answer-formats-auto.js`
- `scripts/auto-improve-distractors-direct.js`
- `scripts/execute-all-fixes-auto.js`

Run these separately for database fixes if needed.

## Deployment Readiness

The system reports deployment status based on:
- ✅ All P0 issues fixed
- ✅ All P1 issues fixed or documented
- ✅ Build succeeds
- ✅ TypeScript compiles cleanly
- ✅ No linter errors
- ✅ Critical routes functional

## Usage Tips

1. **Before deployment**: Run `npm run test:autofix` to catch and fix issues
2. **After fixes**: Review `AUTOTEST_REPORT.md` for any manual fixes needed
3. **Regular maintenance**: Run periodically to catch issues early
4. **CI/CD**: Can be integrated into CI pipeline for automated checks

## Troubleshooting

If tests fail:
1. Check the error messages in `AUTOTEST_REPORT.md`
2. Review the fixes that were applied
3. Manually fix any issues marked as "not fixable"
4. Re-run the test to verify fixes

For database fixes, ensure you have:
- Supabase credentials in `.env.local`
- Network access to Supabase
- Appropriate permissions for database updates

---

**Note**: This system is designed to work with the existing codebase structure and automatically fixes common issues identified in previous QA audits and test reports.
