# Quick Fix Instructions

Since the automated script had network issues, here's the easiest way to fix everything:

## ✅ Option 1: Run SQL in Supabase Dashboard (RECOMMENDED - 2 minutes)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new

2. **Copy and paste the SQL:**
   - Open file: `scripts/FIX_ANSWERS_NOW.sql`
   - Copy **ALL** the SQL code
   - Paste into Supabase SQL Editor

3. **Click "Run"** (or press Ctrl+Enter)

4. **Done!** ✅
   - All answer format mismatches will be fixed
   - Disclosure question will be updated with better distractors
   - You'll see a summary of what was fixed

## ✅ Option 2: Use the Script (if network works)

Once your network/DNS is working:

```bash
node scripts/fix-answers-direct.js eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2F3anJ0Z21zbWFkdHJmd2ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1ODMwOTAsImV4cCI6MjA4MjE1OTA5MH0.21YaDem0vOg__ooPP1dX-Bntk6vDpHrneHFvxoiWn1Y
```

## What Gets Fixed

1. ✅ All questions with format mismatches (letter answers → numeric when options use numbers)
2. ✅ Disclosure question with correct answer and better distractors
3. ✅ All answers normalized to match their option key format

## After Running

1. Test the disclosure question in practice mode
2. Verify it marks correctly when you select option "1"
3. All other questions should also work correctly now

---

**Quick Link:** https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new

















