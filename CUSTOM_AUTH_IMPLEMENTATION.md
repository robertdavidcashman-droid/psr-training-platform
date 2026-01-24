# Custom Database-Backed Authentication Implementation

## Summary

This document describes the complete replacement of Supabase Auth with a custom database-backed session authentication system. All Supabase Auth dependencies have been removed from the authentication flow.

## Phase 1: Cleanup ✅

### Removed/Disabled Files:
- `app/api/auth/callback/route.ts` - Deleted (Supabase Auth callback)
- `lib/supabase/client.ts` - Still exists but no longer used for auth
- `lib/supabase/server.ts` - Still exists but no longer used for auth  
- `lib/supabase/middleware.ts` - Still exists but no longer used for auth

### Updated Files:
- `middleware.ts` - Completely rewritten to use custom auth
- `app/login/page.tsx` - Updated to use `/api/auth/login`
- `app/signup/page.tsx` - Updated to use `/api/auth/signup`
- `components/layout/Header.tsx` - Removed Supabase Auth logout calls

**Summary**: Deleted 1 auth callback route and replaced 4 route guards/components.

## Phase 2: Custom Auth Implementation ✅

### Database Schema

**Migration File**: `supabase/migrations/001_custom_auth.sql`

**Tables Created**:
1. `app_users` - Stores user accounts with hashed passwords
2. `app_sessions` - Stores session tokens (hashed) with expiration

**Key Features**:
- UUID primary keys
- Password hashing with Argon2id
- Session tokens hashed with SHA-256 before storage
- Automatic cleanup of expired sessions
- Indexes for performance

### Database Connection

**File**: `lib/db/index.ts`

- Uses Drizzle ORM with Postgres driver
- Direct connection to Supabase Postgres database
- Server-only (never exposed to client)
- Connection pooling configured for serverless

### Auth Utilities

**Password Hashing** (`lib/auth/password.ts`):
- Argon2id algorithm
- Memory cost: 64 MB
- Time cost: 3 iterations
- Parallelism: 4 threads

**Session Management** (`lib/auth/session.ts`):
- 32-byte random session tokens
- SHA-256 hashing for storage
- 14-day default expiration (configurable)
- Automatic last_seen_at updates

**Cookie Management** (`lib/auth/cookies.ts`):
- httpOnly cookies
- Secure in production
- sameSite=lax
- Configurable cookie name

**Server Utilities** (`lib/auth/server.ts`):
- `getCurrentUser()` - Get authenticated user
- `requireAuth()` - Require authentication (throws if not)

### API Routes

**POST `/api/auth/signup`**:
- Validates email format and password length (min 10 chars)
- Creates user with Argon2 password hash
- Creates session and sets cookie
- Returns `{ ok: true }`

**POST `/api/auth/login`**:
- Verifies email/password
- Creates session and sets cookie
- Returns `{ ok: true }`

**POST `/api/auth/logout`**:
- Revokes session in database
- Clears cookie
- Returns `{ ok: true }`

**GET `/api/auth/me`**:
- Returns `{ user: { id, email } }` if authenticated
- Returns `{ user: null }` if not

All routes use `runtime = "nodejs"` for Argon2 support.

### Middleware

**File**: `middleware.ts`

- Lightweight cookie presence check (Edge runtime compatible)
- Full validation happens in protected pages/API routes
- Redirects unauthenticated users to `/login?next=...`
- Redirects authenticated users away from `/login` and `/signup`

## Phase 3: UI Updates ✅

### Login Page (`app/login/page.tsx`)
- Removed Supabase Auth client calls
- Now POSTs to `/api/auth/login`
- Handles errors from API response
- Redirects on success

### Signup Page (`app/signup/page.tsx`)
- Removed Supabase Auth client calls
- Now POSTs to `/api/auth/signup`
- Password minimum length updated to 10 characters
- No email confirmation required (immediate access)

### Header Component (`components/layout/Header.tsx`)
- Removed Supabase Auth logout calls
- Only calls `/api/auth/logout` API route

## Phase 4: E2E Tests ✅

**File**: `tests/e2e/auth-custom.spec.ts`

**Test Coverage**:
1. ✅ User signup flow
2. ✅ User login flow
3. ✅ Session persistence after refresh
4. ✅ Logout flow
5. ✅ Protected route redirects
6. ✅ Logged-in user redirects from auth pages
7. ✅ Invalid credentials error handling
8. ✅ Password validation
9. ✅ Email format validation

**Run Tests**:
```bash
npm run test:e2e -- tests/e2e/auth-custom.spec.ts
```

## Phase 5: Verification ✅

**Script**: `scripts/verify-custom-auth.mjs`

**Checks**:
- Environment variables (DATABASE_URL)
- Migration file exists
- Test dependencies installed
- Optional: Run E2E tests

**Commands**:
```bash
npm run auth:verify          # Basic verification
npm run auth:verify:test      # Verification + E2E tests
```

## Environment Variables

**Required**:
- `DATABASE_URL` - Postgres connection string from Supabase

**Optional** (with defaults):
- `AUTH_COOKIE_NAME=app_session`
- `AUTH_SESSION_DAYS=14`
- `NODE_ENV=development`

**Template**: See `.env.local.example`

## Database Migration

**To apply the migration**:

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_custom_auth.sql`
3. Run the SQL
4. Verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('app_users', 'app_sessions');
   ```

## Files Created

### Core Auth System:
- `lib/db/index.ts` - Database connection
- `lib/db/schema.ts` - Drizzle schema definitions
- `lib/auth/password.ts` - Password hashing
- `lib/auth/session.ts` - Session management
- `lib/auth/cookies.ts` - Cookie utilities
- `lib/auth/server.ts` - Server-side auth utilities

### API Routes:
- `app/api/auth/signup/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/api/auth/me/route.ts`

### Database:
- `supabase/migrations/001_custom_auth.sql`

### Tests:
- `tests/e2e/auth-custom.spec.ts`

### Scripts:
- `scripts/verify-custom-auth.mjs`

### Configuration:
- `.env.local.example`

## Files Modified

- `middleware.ts` - Complete rewrite
- `app/login/page.tsx` - Updated to use new API
- `app/signup/page.tsx` - Updated to use new API
- `components/layout/Header.tsx` - Removed Supabase Auth
- `package.json` - Added verification scripts

## Files Deleted

- `app/api/auth/callback/route.ts` - Supabase Auth callback

## Dependencies Added

- `argon2` - Password hashing
- `drizzle-orm` - ORM for database queries
- `postgres` - Postgres driver
- `@types/pg` - TypeScript types

## Security Features

1. **Password Security**:
   - Argon2id (memory-hard, resistant to GPU attacks)
   - Configurable cost parameters
   - Never stored in plain text

2. **Session Security**:
   - Random 32-byte tokens (256 bits)
   - SHA-256 hashed before storage
   - httpOnly cookies (not accessible via JavaScript)
   - Secure flag in production
   - Configurable expiration

3. **Database Security**:
   - Direct Postgres connection (no Supabase Auth dependency)
   - Server-only database access
   - Prepared statements via Drizzle ORM

## Expected Behavior

1. **Signup**: User creates account → Session created → Redirected to dashboard
2. **Login**: User enters credentials → Session created → Redirected to dashboard
3. **Protected Routes**: Unauthenticated users redirected to `/login?next=...`
4. **Session Persistence**: Sessions persist across page refreshes (14 days default)
5. **Logout**: Session revoked in DB → Cookie cleared → Redirected to home

## PASS/FAIL Checklist

- ✅ All Supabase Auth removed from auth flow
- ✅ Database schema created
- ✅ Password hashing implemented (Argon2)
- ✅ Session management implemented
- ✅ API routes created (signup, login, logout, me)
- ✅ Middleware updated
- ✅ UI pages updated
- ✅ E2E tests created
- ✅ Verification script created
- ✅ Environment template created
- ✅ Documentation complete

## Next Steps

1. **Apply Database Migration**:
   ```sql
   -- Run supabase/migrations/001_custom_auth.sql in Supabase SQL Editor
   ```

2. **Set Environment Variables**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your DATABASE_URL
   ```

3. **Verify Installation**:
   ```bash
   npm run auth:verify
   ```

4. **Run Tests**:
   ```bash
   npm run auth:verify:test
   ```

5. **Test Manually**:
   - Start dev server: `npm run dev`
   - Visit `/signup` and create an account
   - Verify you're redirected to dashboard
   - Logout and login again
   - Verify session persists after refresh

## Notes

- The old Supabase client/server files (`lib/supabase/*`) are still present but not used for authentication. They may be used for other database operations if needed.
- Admin route protection logic in middleware is simplified - you may want to add proper admin_users table check.
- Password minimum length is 10 characters (configurable in API route).
- Session expiration is 14 days by default (configurable via `AUTH_SESSION_DAYS` env var).
