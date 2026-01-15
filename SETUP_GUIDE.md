# PSR Training Platform - Setup Guide

This guide will walk you through setting up and running the PSR Training Platform from scratch.

## Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed ([Download](https://nodejs.org/))
- npm or yarn package manager
- A Supabase account ([Sign up](https://supabase.com/))
- An OpenAI API key (optional, for AI features) ([Get API key](https://platform.openai.com/api-keys))

## Step-by-Step Setup

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase client, and other dependencies.

---

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in/sign up
2. Click "New Project"
3. Fill in project details:
   - **Name**: PSR Training Platform (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes ~2 minutes)

---

### Step 3: Get Supabase Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon) in the left sidebar
2. Click "API" in the settings menu
3. Find and copy these values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys" → "anon public")
   - Optionally, save the `service_role` key for admin operations (keep this secret!)

---

### Step 4: Create Environment Variables File

1. In the project root directory, create a file named `.env.local`
2. Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual keys from Step 3.

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### Step 5: Set Up Database Schema

1. In your Supabase project dashboard, click "SQL Editor" in the left sidebar
2. Click "New query"
3. Open the file `supabase/migrations/001_initial_schema.sql` from your project
4. Copy the entire contents of that file
5. Paste it into the SQL Editor in Supabase
6. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
7. Verify success - you should see a success message

**Repeat for the second migration:**
1. Open `supabase/migrations/002_new_features.sql`
2. Copy its contents
3. Paste into a new query in SQL Editor
4. Run it

---

### Step 6: Configure Supabase Authentication

1. In Supabase dashboard, go to "Authentication" → "Settings"
2. Under "Site URL", add: `http://localhost:3000`
3. Under "Redirect URLs", add: `http://localhost:3000/**`
4. Scroll down and ensure "Enable email confirmations" is OFF (for development) or ON (for production)
5. Click "Save"

---

### Step 7: Build and Run the Application

1. In your terminal, run:

```bash
npm run dev
```

2. Wait for the build to complete (you'll see "Ready" message)
3. Open your browser and go to: `http://localhost:3000`
4. You should see the landing page!

---

### Step 8: Create Your First User (Admin)

1. Click "Sign Up" or go to `http://localhost:3000/signup`
2. Fill in the signup form:
   - Full Name: Your name
   - Email: Your email address
   - Password: A secure password (minimum 6 characters)
3. Click "Sign Up"
4. You should be automatically logged in and redirected to the dashboard

---

### Step 9: Make Your User an Admin

1. In Supabase dashboard, go to "Table Editor"
2. Find and click on the `users` table
3. Find your user record (by email)
4. Click on the `role` field
5. Change it from `user` to `admin`
6. Click "Save" (or press Enter)
7. Refresh your browser page - you should now have admin access

**Alternative method (using SQL):**
1. Go to SQL Editor in Supabase
2. Run this query (replace `your-email@example.com` with your actual email):

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

### Step 10: Verify Setup

Test the following to ensure everything is working:

1. **Authentication**: 
   - Log out and log back in
   - Verify you can access protected pages

2. **Admin Access**:
   - Check if you see "Admin Dashboard" link in navigation
   - Visit `/admin` - you should see the admin dashboard

3. **Database Connection**:
   - Try creating a question in Admin → Questions
   - Check if it appears in the questions list

4. **Dark Mode**:
   - Click the theme toggle (☀️/🌙) in the header
   - Verify theme changes

5. **Search**:
   - Press Ctrl+K (or Cmd+K on Mac)
   - Verify search dialog opens

---

### Step 11: Optional - Add Initial Content

To make the app more useful, you can add:

1. **Sample Questions** (via Admin Dashboard):
   - Go to Admin → Questions
   - Click "Add New Question"
   - Fill in question details
   - Set status to "approved"

2. **Learning Modules** (via Admin Dashboard):
   - Go to Admin → Content → Modules
   - Click "Add New Module"
   - Add title, category, and content

3. **PACE Code Sections** (via SQL Editor):
   - You can add PACE code sections using SQL INSERT statements
   - Or wait for admin UI to support this feature

---

## Common Issues and Solutions

### Issue: "Invalid API key" or connection errors

**Solution:**
- Double-check your `.env.local` file has correct values
- Ensure there are no extra spaces or quotes around the values
- Restart the dev server after changing `.env.local`
- Verify your Supabase project is active (not paused)

### Issue: "Table does not exist" errors

**Solution:**
- Make sure you ran both migration files (001 and 002)
- Check in Supabase Table Editor that tables exist
- Verify the migration ran without errors

### Issue: Can't log in after signup

**Solution:**
- Check Supabase Authentication → Users to see if user was created
- If email confirmation is enabled, check your email for confirmation link
- Check browser console for error messages
- Verify redirect URLs are configured correctly in Supabase

### Issue: "Row Level Security policy violation"

**Solution:**
- This usually means RLS policies are blocking access
- Verify you're logged in with a valid user
- Check that the user exists in the `users` table
- For admin features, ensure your user has `role = 'admin'`

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find what's using port 3000 (Windows PowerShell)
netstat -ano | findstr :3000

# Kill the process (replace PID with the number from above)
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

---

## Production Deployment

When ready to deploy to production:

1. **Set up production Supabase project** (or use same one)
2. **Configure production environment variables**:
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain
   - Use production Supabase credentials
3. **Deploy to Vercel** (recommended for Next.js):
   ```bash
   npm install -g vercel
   vercel
   ```
4. **Update Supabase redirect URLs** to include your production domain
5. **Set environment variables in Vercel** dashboard
6. **Test thoroughly** before going live

---

## Next Steps After Setup

1. **Import Legal Sources**: Add PACE Code content via Admin → Content → Imported Sources
2. **Generate Questions**: Use AI question generation from imported sources
3. **Add Learning Modules**: Create comprehensive training content
4. **Invite Users**: Have users sign up through the platform
5. **Monitor Analytics**: Use Admin → Analytics to track usage

---

## Getting Help

If you encounter issues:
1. Check the browser console for errors (F12)
2. Check the terminal where `npm run dev` is running for server errors
3. Verify all environment variables are set correctly
4. Ensure database migrations completed successfully
5. Check Supabase logs in the dashboard

---

## Quick Start Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Environment variables configured (`.env.local`)
- [ ] Database migrations run (001 and 002)
- [ ] Supabase authentication configured
- [ ] App running (`npm run dev`)
- [ ] First user created (signup)
- [ ] User role set to admin
- [ ] Basic features tested (login, dashboard, dark mode)

Once all items are checked, your app should be fully functional! 🎉


























