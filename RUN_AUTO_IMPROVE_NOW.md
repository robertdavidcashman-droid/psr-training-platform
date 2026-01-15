# 🚀 Run Auto-Improve Distractors Now

## Quick Instructions

Since the automated script needs to run in your Supabase database, follow these steps:

### Option 1: SQL Script (Recommended - 2 minutes)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new
   - (Or navigate: Dashboard → Your Project → SQL Editor → New Query)

2. **Copy the SQL Script:**
   - Open the file: `scripts/auto-improve-distractors.sql`
   - Copy ALL the SQL code

3. **Paste and Run:**
   - Paste into the SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait for completion message ✅

4. **Done!** All distractors are now automatically improved.

### Option 2: JavaScript Script (If you have .env.local set up)

If you have your `.env.local` file configured with Supabase credentials:

```bash
cd "C:\Users\rober\OneDrive\Desktop\pstrain rebuild"
node scripts/auto-improve-distractors.js
```

## What Will Happen

The script will automatically:
- ✅ Identify questions with weak distractors
- ✅ Replace "Nothing" → "This is not required"
- ✅ Replace "Always" → "Generally"  
- ✅ Replace "Never" → "Rarely"
- ✅ Replace "Cannot" → "May not be able to"
- ✅ Replace "Only" → "Primarily"
- ✅ Replace "Illegal" → "Not permitted in these circumstances"
- ✅ And more improvements...

## Safety

- ✅ Only modifies approved questions
- ✅ Only improves distractors (correct answers unchanged)
- ✅ All changes are logged
- ✅ You can review changes in `/admin/questions` after running

## After Running

1. Check `/admin/questions` to see improved questions
2. Review quality scores (should be higher)
3. Spot-check a few questions to verify improvements

---

**Need help?** The SQL script is the easiest option - just copy, paste, and run in Supabase!
