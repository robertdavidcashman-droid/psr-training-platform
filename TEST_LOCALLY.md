# Testing the App Locally

## Quick Start - Test Everything

### Step 1: Start the Development Server

Open a terminal and run:

```bash
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
npm run dev
```

Wait until you see:
```
✓ Ready on http://localhost:3000
```

### Step 2: Open in Browser

Go to: **http://localhost:3000**

### Step 3: Test These Features

**1. Landing Page**
- Visit http://localhost:3000
- Check the design and layout
- Click "Get Started" or "Learn More"

**2. Sign Up**
- Go to http://localhost:3000/signup
- Create a test account
- Fill in: Full Name, Email, Password (min 6 chars)

**3. Login**
- Go to http://localhost:3000/login
- Login with your test account
- You'll be redirected to dashboard

**4. Dashboard**
- Check your progress stats
- View the charts
- Try the quick action links

**5. Practice Mode**
- Click "Practice" in navigation
- Try answering questions
- See instant feedback

**6. Other Features to Test:**
- Questions page - Browse question bank
- Bookmarks - Bookmark questions
- Flashcards - Review flashcards
- Mock Exam - Take a timed exam
- Study Plan - Create a study plan
- PACE Code - Browse PACE sections
- Modules - View learning modules

**7. Admin Features** (if you're admin)
- Go to http://localhost:3000/admin
- Manage questions
- View users
- Check analytics
- Manage content

**8. Dark Mode**
- Click the theme toggle (☀️/🌙) in header
- Switch between light/dark mode

**9. Search**
- Press `Ctrl+K` (or `Cmd+K` on Mac)
- Search for content

---

## What to Check

✅ Pages load without errors
✅ Navigation works
✅ Login/Signup works
✅ All features are accessible
✅ Design looks good
✅ Buttons and links work
✅ No console errors (F12 to check)

---

## Keep the Terminal Open!

**Important:** Keep the terminal window where `npm run dev` is running open. Closing it will stop the server.

---

## If Something Doesn't Work

1. Check the terminal output for errors
2. Check browser console (F12) for errors
3. Make sure Supabase project is active (not paused)
4. Verify `.env.local` file has correct values

Once everything works locally, you can deploy to production later!

























