# Authentication Test Setup

## Environment Variables

To run the authentication tests, you need to set up test credentials:

### Option 1: Environment Variables

Create a `.env.test` file or set these in your environment:

```bash
TEST_EMAIL=your-test-user@example.com
TEST_PASSWORD=your-test-password
ADMIN_EMAIL=robertdavidcashman@gmail.com
ADMIN_PASSWORD=your-admin-password
```

### Option 2: Playwright Config

You can also set these in `playwright.config.ts`:

```typescript
use: {
  // ... existing config
  extraHTTPHeaders: {
    // If needed
  },
},
env: {
  TEST_EMAIL: 'your-test-user@example.com',
  TEST_PASSWORD: 'your-test-password',
  ADMIN_EMAIL: 'robertdavidcashman@gmail.com',
  ADMIN_PASSWORD: 'your-admin-password',
}
```

## Test User Setup

Before running tests, ensure:

1. **Test User Exists**: Create a test user in Supabase Authentication
   - Go to Supabase Dashboard → Authentication → Users
   - Create a new user with email/password
   - Use this for `TEST_EMAIL` and `TEST_PASSWORD`

2. **Admin User**: Your admin user should already be set up
   - Email: `robertdavidcashman@gmail.com`
   - Should be in `admin_users` table

## Running Tests

```bash
# Run all auth tests
npm run e2e:auth

# Run specific test file
npx playwright test tests/e2e/auth.test.ts

# Run with UI
npx playwright test tests/e2e/auth.test.ts --ui
```

## Test Coverage

The auth tests cover:

- ✅ Public page access
- ✅ Route protection (redirects to login)
- ✅ Login flow (success and failure)
- ✅ Redirect parameter handling
- ✅ Session ping functionality
- ✅ Logout functionality
- ✅ Admin route protection
- ✅ Admin dashboard access
- ✅ API endpoint authentication
- ✅ Session management APIs

## Notes

- Tests that require credentials will be skipped if credentials are not configured
- Some tests require a running Supabase instance with the auth tables set up
- Session ping tests wait for actual ping intervals (may take up to 60 seconds)
