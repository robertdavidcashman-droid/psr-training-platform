# TEST REPORT

Generated: 2026-01-22T20:56:04.756Z

## Test Summary

- **Total Test Suites**: 5
- **Passed**: 4 ✅
- **Failed**: 1 ❌

## Test Results

### Lint: ✅ PASS

**Output:**
```

> psr-training-academy@2.0.0 test:lint
> next lint

✔ No ESLint warnings or errors

```

### Unit Tests: ✅ PASS

**Last 20 lines of output:**
```
 ✓ tests/schemas.test.ts (10 tests) 19ms
 ✓ tests/utils.test.ts (12 tests) 70ms
 ✓ tests/content.test.ts (11 tests) 310ms
stdout | tests/coverage.test.ts > Coverage Requirements > Overall Coverage Statistics > should report coverage statistics

Coverage Statistics:
  Total criteria: 49
  Criteria with 0 questions: 0
  Criteria with <30 questions: 0
  Questions with <2 citations: 0

 ✓ tests/coverage.test.ts (1524 tests) 478ms
 ✓ tests/integration/performance.test.ts (5 tests) 9ms

 Test Files  5 passed | 5 skipped (10)
      Tests  1562 passed | 33 skipped (1595)
   Start at  20:50:37
   Duration  2.87s (transform 2.50s, setup 0ms, collect 4.68s, tests 886ms, environment 8ms, prepare 9.09s)


```

### Integration Tests: ✅ PASS

**Output:**
```

> psr-training-academy@2.0.0 test:integration
> vitest run --config vitest.integration.config.ts


 RUN  v2.1.9 C:/Users/rober/OneDrive/Desktop/pstrain rebuild

 ↓ tests/integration/api-endpoints.test.ts (14 tests | 14 skipped)
 ↓ tests/integration/db-indexes.test.ts (5 tests | 5 skipped)
 ↓ tests/integration/admin-access.test.ts (4 tests | 4 skipped)
 ↓ tests/integration/rls.test.ts (5 tests | 5 skipped)
 ↓ tests/integration/auth-sessions.test.ts (5 tests | 5 skipped)
 ✓ tests/integration/performance.test.ts (5 tests) 24ms

 Test Files  1 passed | 5 skipped (6)
      Tests  5 passed | 33 skipped (38)
   Start at  20:50:43
   Duration  3.01s (transform 1.57s, setup 0ms, collect 2.93s, tests 24ms, environment 7ms, prepare 5.63s)


```

### E2E Tests: ❌ FAIL

**Error:**
```
[1A[2K[WebServer] (node:3196) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
[WebServer] (Use `node --trace-deprecation ...` to show where the warning was created)
[1A[2K(node:17836) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:18648) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:6048) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:18256) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22572) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:10480) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22572) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:17836) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:18256) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:18648) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:6048) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:10480) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] (node:16808) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized and prone to errors that have security implications. Use the WHATWG URL API instead. CVEs are not issued for `url.parse()` vulnerabilities.
[WebServer] (Use `node --trace-deprecation ...` to show where the warning was created)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Session end error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-end\route.js:1:2768)
[1A[2K(node:10704) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8076) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8872) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:10704) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8076) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8872) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:19160) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:18388) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K[WebServer] Logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\logout\route.js:1:2045)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:19160) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:18388) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:25320) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:5364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:25320) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:5364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22888) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22888) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:25228) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25300) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25228) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25300) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:17044) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:17044) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:20304) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22036) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22036) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20304) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:24844) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:24844) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21136) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21136) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22404) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22404) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22396) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22396) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:3596) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:3596) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25232) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:2392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K(node:19268) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:2392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25456) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session end error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-end\route.js:1:2768)
[1A[2K(node:19268) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:14264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25456) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:6248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:14264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:6248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:9124) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K[WebServer] Logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\logout\route.js:1:2045)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:9124) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:12000) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:13620) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:12000) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:13620) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:25580) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25580) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:11076) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:3628) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:13072) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:11076) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:13072) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:3628) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:3120) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:3120) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22516) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21464) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22516) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21464) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21724) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21724) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:23804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23228) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:23228) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22152) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:15700) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22152) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:15700) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21432) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21432) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K(node:21172) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:23808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:3632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21172) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25004) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:3632) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:25156) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25004) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session end error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-end\route.js:1:2768)
[1A[2K(node:20588) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25156) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25384) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20588) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K[WebServer] Logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\logout\route.js:1:2045)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:25384) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:17780) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20128) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:17780) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:20128) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22808) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:4256) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:4256) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:15024) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:19804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:15024) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:19804) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22392) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22364) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21584) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:4440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21584) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:4440) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:15132) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:15132) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:17208) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:17208) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:23740) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23740) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21340) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20136) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21340) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20136) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:24592) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:24592) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:8248) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K(node:20816) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Session end error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-end\route.js:1:2768)
[1A[2K(node:21524) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20816) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:7996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:21524) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:24900) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:7996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:24900) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K(node:11704) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:7100) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:11704) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:7264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:7100) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:7264) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Session start error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\session-start\route.js:1:1944)
[1A[2K[WebServer] Force logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\force-logout\route.js:1:2768)
[1A[2K[WebServer] Logout error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\logout\route.js:1:2045)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:24996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:24996) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:23720) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:20956) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:20956) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:10712) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:10712) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21372) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:11880) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:21372) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:11880) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:22016) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:14208) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:22016) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:14208) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:25132) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20600) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:25132) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20600) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:20672) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:20672) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:1360) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:1360) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:6156) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K(node:6156) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:5768) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K(node:5768) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)
[1A[2K[WebServer] Ping error: Error: Your project's URL and Key are required to create a Supabase client!
[WebServer] 
[WebServer] Check your Supabase project's API settings to find these values
[WebServer] 
[WebServer] https://supabase.com/dashboard/project/_/settings/api
[WebServer]     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
[WebServer]     at cz (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\chunks\441.js:37:50575)
[WebServer]     at f (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\admin\coverage\regenerate\route.js:1:1970)
[WebServer]     at async w (C:\Users\rober\OneDrive\Desktop\pstrain rebuild\.next\server\app\api\auth\ping\route.js:1:2781)

```

**Last 20 lines of output:**
```
    [desktop] › tests\e2e\coverage-matrix.test.ts:4:7 › Coverage Matrix E2E Tests › should load coverage matrix page without errors 
    [desktop] › tests\e2e\coverage-matrix.test.ts:20:7 › Coverage Matrix E2E Tests › should display coverage statistics 
    [desktop] › tests\e2e\coverage-matrix.test.ts:86:7 › Coverage Matrix E2E Tests › should show coverage status badges correctly 
    [desktop] › tests\e2e\mock-exam.test.ts:4:7 › Mock Exam › should complete a short mock exam ────
    [desktop] › tests\e2e\navigation.test.ts:9:7 › Navigation › should navigate to all main pages ──
    [desktop] › tests\e2e\navigation.test.ts:73:7 › Navigation › should display header stats ───────
    [desktop] › tests\e2e\navigation.test.ts:81:7 › Navigation › should toggle mobile sidebar ──────
    [desktop] › tests\e2e\practice.test.ts:4:7 › Practice Mode › should complete a quick practice session 
    [desktop] › tests\e2e\practice.test.ts:47:7 › Practice Mode › should show feedback after answering 
    [desktop] › tests\e2e\public-first.test.ts:10:7 › Public-First Site (No Sign-In Required) › home page does not show sign-in button 
    [desktop] › tests\e2e\public-first.test.ts:45:7 › Public-First Site (No Sign-In Required) › legal pages are accessible 
    [desktop] › tests\e2e\public-first.test.ts:59:7 › Public-First Site (No Sign-In Required) › 404 page shows helpful message 
    [desktop] › tests\e2e\responsive.test.ts:22:7 › Viewport responsiveness + overflow guard › dashboard has PageHeader and navigation works 
    [desktop] › tests\e2e\responsive.test.ts:37:7 › Viewport responsiveness + overflow guard › portfolio CTA is visible and snapshot is stable 
    [desktop] › tests\e2e\responsive.test.ts:46:7 › Viewport responsiveness + overflow guard › practice 10Q run: answer 2 questions and authorities panel renders 
    [desktop] › tests\e2e\responsive.test.ts:70:7 › Viewport responsiveness + overflow guard › practice setup snapshot is stable 
    [desktop] › tests\e2e\responsive.test.ts:84:7 › Viewport responsiveness + overflow guard › authorities panel renders with link-outs 
  72 skipped
  140 passed (5.1m)

```

### Coverage Audit: ✅ PASS

**Last 20 lines of output:**
```
"u10-o1-b","Exclusion for unfairness (s.78)",30,"OK",30,0
"u11-o1-a","Confidentiality and privilege",33,"OK",33,0
"u11-o1-b","Duty not to mislead",30,"OK",30,0
"u11-o1-c","Client instructions and autonomy",30,"OK",30,0
"u12-o1-a","Attendance notes and contemporaneous records",39,"OK",39,0
"u12-o1-b","Portfolio building for accreditation",62,"OK",62,0
"u12-o1-c","Reflective practice",30,"OK",30,0
"u13-o1-a","Probationary period structure",30,"OK",30,0
"u13-o1-b","Assessment components and deadlines",42,"OK",42,0
"u13-o1-c","Register entry requirements",30,"OK",30,0
"u14-o1-a","Initial call and triage",58,"OK",58,0
"u14-o1-b","Arriving at custody and initial steps",31,"OK",31,0
"u14-o1-c","Private consultation conduct",60,"OK",60,0
"u14-o1-d","Interview attendance decisions",61,"OK",61,0
"u14-o1-e","Post-interview and outcome",30,"OK",30,0

📄 Test report written to: C:\Users\rober\OneDrive\Desktop\pstrain rebuild\TEST_REPORT.md

✅ AUDIT PASSED: All coverage requirements met.

```

## ❌ TEST FAILURES DETECTED

**1 test suite(s) failed.**

### Next Steps
1. Review failed test output above
2. Fix identified issues
3. Re-run `npm run test:all`
4. Ensure all tests pass before deploying