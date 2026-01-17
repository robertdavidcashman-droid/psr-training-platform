## PSR Training Academy

Duolingo-style practice + portfolio support for trainee Police Station Representatives.

### Tech stack

- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui
- Supabase (Auth + Postgres + RLS)
- Zod validation
- Tests: Vitest + React Testing Library, Playwright
- CI: GitHub Actions

## Quick Start (One Command)

**The easiest way to get started:**

```bash
npm install
npm run doctor
```

The `doctor` command will:
1. ✅ Check your environment and configuration
2. 🔧 Automatically fix common issues
3. 🗄️ Set up local Supabase (if needed)
4. 🧪 Run all tests
5. 📊 Report PASS/FAIL with actionable diagnostics

**If `doctor` passes, you're ready to go!** Start the app with `npm run dev`.

## Local Setup (Detailed)

### Option 1: Local Supabase (Recommended for Development)

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**:
   ```bash
   npm run supabase:start
   ```
   This will automatically configure `.env.local` with local Supabase URLs.

3. **Apply migrations**:
   ```bash
   npm run db:reset
   ```
   This applies all migrations and seeds the database.

4. **Run doctor to verify**:
   ```bash
   npm run doctor
   ```

### Option 2: Hosted Supabase

1. **Create `.env.local`**:
   ```bash
   cp env.example .env.local
   ```

2. **Fill in your Supabase credentials**:
   - Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from:
     https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

3. **Apply migrations** in Supabase SQL Editor (see `db/README.md`)

4. **Run doctor**:
   ```bash
   npm run doctor
   ```

## Health Checks & Diagnostics

### Health Endpoint

Check app health at runtime:
```bash
curl http://localhost:3000/api/health
```

Returns JSON with:
- Environment variable status
- Database connectivity
- Auth session status
- Actionable error messages

### Diagnostics Endpoint

Deep Supabase diagnostics:
```bash
curl http://localhost:3000/api/diagnostics/supabase
```

Detects:
- DNS/network issues
- CORS problems
- Invalid URL/key formats
- Service role key misuse
- Provides ranked fixes

### Preflight Script

Run health checks from command line:
```bash
npm run preflight
```

Automatically:
- Checks environment variables
- Detects local Supabase and configures it
- Tests database connectivity
- Validates auth setup

### AutoFix Script

Automatically fixes common issues:
```bash
npm run autofix
```

Fixes include:
- ✅ Client/server Supabase client configuration
- ✅ Middleware auth route protection
- ✅ Auth callback session handling
- ✅ Local Supabase bootstrap
- ✅ RLS policy setup

## Commands Reference

### Development
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run start` - Start production server

### Health & Diagnostics
- `npm run doctor` - **Complete health check + auto-fix + tests** (recommended)
- `npm run preflight` - Quick health check
- `npm run autofix` - Auto-fix common issues
- `npm run smoke` - Quick integration tests

### Database (Local Supabase)
- `npm run supabase:start` - Start local Supabase
- `npm run supabase:stop` - Stop local Supabase
- `npm run supabase:status` - Check Supabase status
- `npm run db:push` - Push migrations to local Supabase
- `npm run db:reset` - Reset local database (applies migrations + seeds)
- `npm run db:seed` - Seed local database

### Testing
- `npm run test` - Run unit tests (Vitest)
- `npm run test:watch` - Watch mode
- `npm run test:coverage` - Coverage report
- `npm run e2e` - Playwright E2E tests

### Code Quality
- `npm run lint` - ESLint (warnings = errors)
- `npm run typecheck` - TypeScript checks
- `npm run format` - Format code
- `npm run format:check` - Check formatting

## Troubleshooting

### "Failed to fetch" Error

This usually means Supabase connection issues. Run:

```bash
npm run doctor
```

This will:
1. Check environment variables
2. Test Supabase connectivity
3. Auto-fix common issues
4. Provide specific diagnostics

**Common fixes:**
- Missing environment variables → Add to `.env.local` or Vercel
- Supabase project paused → Resume in Supabase dashboard
- Wrong URL/key → Get correct values from Supabase dashboard
- CORS issues → Check Supabase auth redirect URLs

### Database Connection Issues

1. **Check health endpoint**:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Check if RLS is blocking**:
   - Health endpoint will report `rlsBlocked: true`
   - Run migrations to ensure RLS policies exist

3. **For local Supabase**:
   ```bash
   npm run supabase:status
   npm run db:reset
   ```

### Auth Session Issues

1. **Check SessionBanner** (development only):
   - Shows at bottom of page in dev mode
   - Displays client/server session match
   - Shows session expiry

2. **Check auth callback**:
   - Visit `/auth/callback?code=test` (will show error, but tests route)
   - Check browser console for errors

3. **Verify middleware**:
   - Should allow `/login`, `/signup`, `/auth/callback`
   - Should protect `/dashboard` and app routes

## Create Your First Admin

1. **Sign up** in the app with your email
2. **Update role** in Supabase SQL Editor:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'YOUR_EMAIL_HERE';
   ```
3. **Refresh** the app - admin features will appear

## CI/CD

GitHub Actions runs on every push:

- ✅ Format check
- ✅ Lint
- ✅ TypeScript checks
- ✅ Unit tests (with coverage)
- ✅ Playwright E2E tests
- ✅ Production build

## Architecture

### Supabase Clients

- **Client-side**: `lib/supabase/client.ts` - Uses `createBrowserClient` with anon key
- **Server-side**: `lib/supabase/server.ts` - Uses `createServerClient` with cookies
- **Middleware**: `lib/supabase/middleware.ts` - Session refresh for protected routes

### Authentication Flow

1. User signs up/logs in → Supabase Auth
2. Auth callback (`/auth/callback`) → Exchanges code for session
3. Session stored in cookies → Accessible server-side
4. Middleware → Refreshes session, protects routes
5. Profile created → Database trigger on user creation

### Health Check System

- **`/api/health`** - Runtime health status
- **`/api/diagnostics/supabase`** - Deep Supabase diagnostics
- **`scripts/preflight.mjs`** - CLI health checks
- **`scripts/autofix.mjs`** - Automated fixes
- **`scripts/doctor.mjs`** - Complete validation suite

## Contributing

1. Run `npm run doctor` before committing
2. Ensure all tests pass
3. Check that health endpoints return OK
4. Verify no "Failed to fetch" errors in console
