# Step-by-Step Setup Instructions

Follow these steps in order to get your PSR Training Platform up and running.

## ✅ Step 1: Install Node.js
- Download from: https://nodejs.org/
- Install version 18 or higher
- Verify installation: `node --version` in terminal

## ✅ Step 2: Install Project Dependencies
```bash
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
npm install
```

## ✅ Step 3: Create Supabase Account & Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Enter project name: "PSR Training Platform"
5. Create a database password (save it!)
6. Select region closest to you
7. Click "Create new project"
8. Wait 2-3 minutes for setup to complete

## ✅ Step 4: Get Supabase Credentials
1. In Supabase dashboard, click "Settings" (gear icon)
2. Click "API" in left menu
3. Copy these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with eyJ...)

## ✅ Step 5: Create Environment File
1. In project root, create file: `.env.local`
2. Copy this template and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=sk-proj-your-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Replace the placeholder values with your actual keys from Step 4.

## ✅ Step 6: Run Database Migrations
1. In Supabase dashboard, click "SQL Editor"
2. Click "New query" button
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy ALL the SQL code from that file
5. Paste into Supabase SQL Editor
6. Click "Run" button (or press Ctrl+Enter)
7. Wait for "Success" message

**Repeat for second migration:**
1. Click "New query" again
2. Open file: `supabase/migrations/002_new_features.sql`
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click "Run"
6. Verify success

## ✅ Step 7: Configure Authentication
1. In Supabase, go to "Authentication" → "Settings"
2. Under "Site URL", enter: `http://localhost:3000`
3. Under "Redirect URLs", click "Add URL" and add: `http://localhost:3000/**`
4. Scroll down to "Email Auth"
5. For development, you can turn OFF "Enable email confirmations"
6. Click "Save"

## ✅ Step 8: Start the Development Server
```bash
npm run dev
```

Wait for message: "Ready - started server on 0.0.0.0:3000"

## ✅ Step 9: Open the Application
1. Open browser
2. Go to: http://localhost:3000
3. You should see the landing page

## ✅ Step 10: Create Your First User
1. Click "Sign Up" button (or go to http://localhost:3000/signup)
2. Fill in:
   - Full Name: Your name
   - Email: your.email@example.com
   - Password: (at least 6 characters)
3. Click "Sign Up"
4. You'll be logged in automatically

## ✅ Step 11: Make Yourself an Admin
1. In Supabase dashboard, go to "Table Editor"
2. Click on "users" table
3. Find your user (search by email)
4. Click on the "role" field
5. Change from "user" to "admin"
6. Press Enter or click Save

**OR use SQL:**
1. Go to "SQL Editor"
2. Run this (replace email):
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## ✅ Step 12: Verify Everything Works
1. Refresh your browser (you should see admin features)
2. Test dark mode toggle (☀️/🌙 button in header)
3. Press Ctrl+K to test search
4. Go to Dashboard - should show your stats
5. Try Practice mode - should load questions
6. Check Admin dashboard - should be accessible

## ✅ Step 13: Add Some Content (Optional)
1. Go to Admin → Questions → "Add New Question"
2. Create a test question and approve it
3. Go to Admin → Content → Modules → "Add New Module"
4. Create a test learning module

## 🎉 Success!
Your app is now fully set up and running!

## Troubleshooting

**"Invalid API key" error:**
- Check `.env.local` file exists and has correct values
- Restart the dev server after changing `.env.local`
- No quotes around values in `.env.local`

**"Table does not exist" error:**
- Make sure you ran BOTH migration files
- Check in Supabase Table Editor that tables exist

**Can't log in:**
- Check Supabase Authentication → Users
- Verify your user exists
- Try signing up again

**Port 3000 in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
$env:PORT=3001; npm run dev
```

## Next Steps
- Add real questions and content
- Invite other users
- Configure for production deployment
- Add PACE Code content

For detailed information, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)


























