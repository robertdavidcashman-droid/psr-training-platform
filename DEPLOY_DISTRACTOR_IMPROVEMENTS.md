# 🚀 Deploy Distractor Improvements

## Quick Deploy (2 minutes)

### Step 1: Open Supabase SQL Editor
Go to: **https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new**

### Step 2: Copy the SQL Script
1. Open file: `COPY_AND_RUN_THIS.sql` (in your project root)
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)

### Step 3: Paste and Run
1. Paste into Supabase SQL Editor (Ctrl+V)
2. Click **"Run"** button (or press Ctrl+Enter)
3. Wait for completion ✅

### Step 4: Verify (Optional)
Run this quick check:
```sql
SELECT 
  COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '1 minute') as just_updated,
  COUNT(*) as total_approved
FROM public.questions
WHERE status = 'approved';
```

If `just_updated` > 0, deployment was successful! ✅

## What Gets Deployed

✅ Creates `improve_distractor_auto()` function  
✅ Updates all approved questions automatically  
✅ Improves distractors:
   - "Nothing" → "This is not required"
   - "Always" → "Generally"
   - "Never" → "Rarely"
   - "Cannot" → "May not be able to"
   - "Only" → "Primarily"
   - "Illegal" → "Not permitted in these circumstances"
   - And more...

## Safety

- ✅ Only modifies approved questions
- ✅ Only improves distractors (correct answers unchanged)
- ✅ Skips questions with invalid formats
- ✅ All changes logged with `updated_at` timestamp

## After Deployment

1. Check `/admin/questions` to see improved quality scores
2. Review a few questions to verify improvements
3. Questions should be more challenging now!

---

**Ready to deploy?** Copy `COPY_AND_RUN_THIS.sql` into Supabase SQL Editor and run it!
