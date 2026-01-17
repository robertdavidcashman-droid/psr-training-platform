## Database setup (Supabase)

### Apply migrations (SQL Editor)

Run these files **in order** in your Supabase project’s SQL editor:

1. `db/migrations/001_initial_schema.sql`
2. `db/migrations/002_rls_policies.sql`
3. `db/migrations/003_seed_data.sql`
4. `db/migrations/004_seed_scenarios.sql`

### Apply migrations (automatic via Supabase CLI)

If you have Supabase CLI installed, you can run migrations from your terminal:

- Recommended: use a **new Supabase project** for the rebuild (avoids schema drift), then run:

```powershell
cd psr-training-academy
.\scripts\apply-supabase-migrations.ps1
```

- Non-interactive (CI-style) requires:
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_DB_PASSWORD`

```powershell
cd psr-training-academy
$env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN"
$env:SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD"
.\scripts\apply-supabase-migrations.ps1 -NonInteractive
```

### Create your first admin user

1. Sign up in the app with the email you want to be admin.
2. In Supabase SQL editor, run:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL_HERE';
```

### Notes

- **Do not** grant users the ability to change their own role: the schema includes a trigger that blocks role self-promotion.
- The `/api/practice/generate` endpoint creates a per-user quiz session; this is supported by RLS via `quizzes.created_by = auth.uid()`.
