# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
PSR Training Academy — a Next.js 15 (App Router) web app for Police Station Representative accreditation training. Content (questions, scenarios) lives in JSON files under `content/`; no database is required for core features.

### Environment variables
A `.env.local` file is required. The only mandatory variable is `TRAINING_ACCESS_CODE` (any non-empty string). Optional: `DATABASE_URL` (Supabase PostgreSQL, needed only for custom auth), `OPENAI_API_KEY` (AI question generation).

### Key commands
| Task | Command |
|---|---|
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Type-check | `npx tsc --noEmit` |
| Unit tests | `npm run test` (Vitest) |
| Integration tests | `npm run test:integration` |
| E2E tests | `npm run e2e` (Playwright, builds & serves on port 3100) |
| Build | `npm run build` |

### Gotchas
- The `supabase` devDependency runs a postinstall script that downloads the Supabase CLI binary from GitHub. In network-restricted environments, use `npm install --ignore-scripts` followed by `npm rebuild argon2` to skip that download while still building the native `argon2` module.
- All routes are gated behind a shared access code (set via `TRAINING_ACCESS_CODE`). To access the app, visit `/gateway` and enter the code. The API equivalent is `POST /api/gateway` with body `{"code":"<value>"}`.
- Playwright E2E tests require the app to build first; the webServer config in `playwright.config.ts` handles this automatically via `node scripts/e2e-server.mjs`.
- The 12 integration API endpoint tests (`tests/integration/api-endpoints.test.ts`) are skipped by default because they need a running server.
