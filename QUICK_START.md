# Quick Start Guide - PSR Training Platform

## Fastest Path to Running the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get Project URL and anon key from Settings → API

### 3. Create `.env.local` File
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Database Migrations
1. In Supabase dashboard → SQL Editor
2. Copy/paste contents of `supabase/migrations/001_initial_schema.sql` → Run
3. Copy/paste contents of `supabase/migrations/002_new_features.sql` → Run

### 5. Start the App
```bash
npm run dev
```

### 6. Create Admin User
1. Go to `http://localhost:3000/signup`
2. Create account
3. In Supabase Table Editor → `users` table
4. Change your user's `role` to `admin`

### 7. You're Done! 🎉
Visit `http://localhost:3000` and start using the platform!

For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)


























