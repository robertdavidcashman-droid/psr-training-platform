# E2E Test Suite

## Quick Start

### Run All Tests
```bash
npm run e2e:all
```

### Run Authentication Tests Only
```bash
npm run e2e:auth
```

### Run Comprehensive Authentication Tests (Level 3)
```bash
npm run e2e:auth:comprehensive
```

### Run Tests with UI
```bash
npm run e2e:ui
```

## Test Files

### `auth.spec.ts`
Basic authentication tests covering:
- Signup flow
- Login flow
- Logout flow
- Session persistence
- Protected routes

**Run**: `npm run e2e:auth`

### `auth-comprehensive.spec.ts`
Level 3 comprehensive tests covering:
- All basic flows
- Error handling
- Edge cases
- Security features
- UI/UX validation
- Cross-page functionality

**Run**: `npm run e2e:auth:comprehensive`

**Coverage**: 44+ test cases across 8 categories

## Test Configuration

- **Port**: 3100 (configurable via `E2E_PORT`)
- **Base URL**: `http://localhost:3100`
- **Browsers**: Chrome (Desktop, Mobile, Tablet, Laptop)
- **Timeout**: 10s navigation, 5s assertions

## Prerequisites

1. Database migration applied:
   ```bash
   npm run setup:auth
   ```

2. Environment variables set in `.env.local`:
   - `DATABASE_URL`

3. Dev server running (automatically started by Playwright)

## Debugging

### View Test Report
```bash
npx playwright show-report
```

### Run Single Test
```bash
npx playwright test tests/e2e/auth-comprehensive.spec.ts -g "should successfully create account"
```

### Debug Mode
```bash
npx playwright test tests/e2e/auth-comprehensive.spec.ts --debug
```

### Run in Headed Browser
```bash
npx playwright test tests/e2e/auth-comprehensive.spec.ts --headed
```

## Test Structure

Tests are organized by feature area:
- Signup Flow
- Login Flow
- Session Management
- Protected Routes
- Error Handling & Edge Cases
- UI/UX Validation
- Security Features
- Cross-Page Functionality

## Best Practices

1. **Isolation**: Each test uses unique credentials
2. **Cleanup**: Tests clean up after themselves
3. **Assertions**: Clear, specific assertions
4. **Timeouts**: Appropriate timeouts for async operations
5. **Error Handling**: Tests verify error states

## CI/CD

Tests run automatically in CI with:
- Retries: 2
- Screenshots on failure
- Videos on failure
- Trace on retry
