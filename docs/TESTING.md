# Testing Guide

This document describes the comprehensive test and audit system for psrtrain.com.

## Quick Start

Run all tests with a single command:

```bash
npm run test:all
```

This will:
1. Run linting checks
2. Run unit tests
3. Run integration tests
4. Run E2E tests (Playwright)
5. Run coverage audit
6. Generate `TEST_REPORT.md` with comprehensive results

## Test Suites

### 1. Linting (`test:lint`)

Validates code quality and style:

```bash
npm run test:lint
```

### 2. Unit Tests (`test:unit`)

Fast unit tests using Vitest:

```bash
npm run test:unit
```

Tests are located in `tests/*.test.ts` (excluding `tests/e2e/` and `tests/integration/`).

### 3. Integration Tests (`test:integration`)

Server-side integration tests for:
- Authentication & session handling
- Supabase RLS (Row Level Security)
- Admin access control
- API endpoint behavior
- Database indexes
- Performance checks

```bash
npm run test:integration
```

**Requirements:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

Tests are located in `tests/integration/*.test.ts`.

### 4. E2E Tests (`test:e2e`)

End-to-end tests using Playwright:

```bash
npm run test:e2e
```

Tests cover:
- Public pages (no auth required)
- Authentication flows
- Coverage matrix integrity
- Admin dashboard access
- User journeys

Tests are located in `tests/e2e/*.test.ts`.

**Requirements:**
- Next.js dev server running (or set `TEST_BASE_URL`)
- Optional: `TEST_EMAIL`, `TEST_PASSWORD` for auth tests
- Optional: `ADMIN_EMAIL`, `ADMIN_PASSWORD` for admin tests

### 5. Coverage Audit (`audit:coverage`)

Validates coverage matrix compliance:

```bash
npm run audit:coverage
```

**Checks:**
- Every criterion has >= 30 questions
- Every question has >= 2 citations
- Citations have proper structure (instrument + cite)
- Expected authorities match question citations

Exits with non-zero code if requirements are not met.

## Test Report

After running `npm run test:all`, a comprehensive `TEST_REPORT.md` is generated with:

- Test summary (pass/fail counts)
- Detailed results for each test suite
- Coverage statistics
- Failure details with actionable fix suggestions
- Worst offenders (criteria needing attention)

## Coverage Matrix Requirements

### Minimum Requirements

1. **Questions per Criterion**: >= 30
2. **Citations per Question**: >= 2
3. **Citation Format**: Must include:
   - `instrument` (e.g., "PACE 1984", "Code C")
   - `cite` (e.g., "s.58", "para 6.1")

### Expected Authorities

Criteria may specify `expectedAuthorities`. At least 2 citations per question should match expected authorities where specified.

## Database Requirements

### Required Tables

- `user_sessions` - Tracks user login sessions
- `admin_users` - Stores admin user IDs

### Required Indexes

- `user_sessions.user_id` - For efficient session lookups
- `user_sessions.active` - For filtering active sessions
- `user_sessions.last_seen_at` - For session ordering

Indexes are validated in `tests/integration/db-indexes.test.ts`.

## Authentication Testing

### Test Users

Integration tests create temporary test users. These are cleaned up after tests complete.

For E2E tests, you can configure:
- `TEST_EMAIL` / `TEST_PASSWORD` - Regular user
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` - Admin user

### Session Testing

Tests verify:
- Session creation on login (with IP and user agent)
- `last_seen_at` updates on ping
- `logout_at` and `active=false` on logout
- Session expiry handling

## RLS Testing

Row Level Security tests ensure:
- Users can only read their own sessions
- Users cannot modify other users' sessions
- Admin users can view all sessions
- Non-admin users cannot view `admin_users` table

## Admin Access Testing

Tests verify:
- Non-admin users cannot access `/admin/*` routes
- Non-admin users cannot call `/api/admin/*` endpoints
- Admin users can access admin features
- Service role keys are never exposed to browser

## API Endpoint Testing

All API routes are tested for:
- Correct HTTP method behavior
- Correct status codes (401/403/200)
- Request validation (Zod schemas)
- Error handling

## Performance Testing

Performance checks ensure:
- Coverage matrix query < 1 second
- No N+1 query patterns
- Efficient question lookup by tag
- Fast question loading

## CI/CD Integration

The test suite is CI-ready. Set these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TEST_EMAIL=...
TEST_PASSWORD=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

## Troubleshooting

### Integration Tests Skip

If integration tests are skipped, check:
- Supabase environment variables are set
- Supabase service is accessible
- Database tables exist (run `docs/auth_setup_combined.sql`)

### E2E Tests Fail

- Ensure Next.js dev server is running (`npm run dev`)
- Check `TEST_BASE_URL` if using custom URL
- Verify test credentials are correct

### Coverage Audit Fails

- Review `TEST_REPORT.md` for specific failures
- Use `npm run seed:coverage` to generate questions
- Use `npm run fix:citations` to fix citation issues

## Adding New Tests

### Unit Test

Create `tests/your-test.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("Your Feature", () => {
  it("should work correctly", () => {
    expect(true).toBe(true);
  });
});
```

### Integration Test

Create `tests/integration/your-test.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

describe("Your Integration Test", () => {
  it("should test Supabase integration", async () => {
    // Your test
  });
});
```

### E2E Test

Create `tests/e2e/your-test.test.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("should test user journey", async ({ page }) => {
  await page.goto("/");
  // Your test
});
```

## Best Practices

1. **Run tests before committing**: `npm run test:all`
2. **Fix failures immediately**: Don't commit failing tests
3. **Keep tests fast**: Unit tests < 1s, integration < 30s, E2E < 5min
4. **Test edge cases**: Invalid inputs, error conditions
5. **Keep tests isolated**: Each test should be independent
6. **Use descriptive test names**: Clear what is being tested
