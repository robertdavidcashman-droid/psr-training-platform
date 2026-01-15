# 🔧 Fix: Code F para 3.2 Question Explanation

## Issue
The question about "Under Code F para 3.2, what must happen if the recording equipment fails during a visually recorded interview?" has a corrupted explanation ending with "- not working correctly!"

## Fix Applied

Created SQL script: `scripts/FIX_CODE_F_EXPLANATION.sql`

### Correct Explanation:
```
Under Code F para 3.2, if visual recording equipment fails, the interview may continue but should be audio recorded under Code E if practicable. If audio recording is not possible, a written record should be made under Code C. The suspect should be informed of the failure and the reason for the alternative recording method. This ensures continuity of the interview process while maintaining a proper record of proceedings.
```

## To Deploy This Fix

### Option 1: Via Supabase Dashboard (Recommended)
1. Open: https://supabase.com/dashboard/project/cvsawjrtgmsmadtrfwfa/sql/new
2. Open file: `scripts/FIX_CODE_F_EXPLANATION.sql`
3. Copy all content (Ctrl+A, Ctrl+C)
4. Paste into Supabase SQL Editor (Ctrl+V)
5. Click "Run" or press Ctrl+Enter
6. Check the verification queries to confirm the update

### Option 2: Copy SQL Directly

```sql
UPDATE public.questions
SET 
  explanation = 'Under Code F para 3.2, if visual recording equipment fails, the interview may continue but should be audio recorded under Code E if practicable. If audio recording is not possible, a written record should be made under Code C. The suspect should be informed of the failure and the reason for the alternative recording method. This ensures continuity of the interview process while maintaining a proper record of proceedings.',
  updated_at = NOW()
WHERE 
  (
    question_text ILIKE '%recording equipment fails%'
    OR question_text ILIKE '%equipment fails%'
    OR question_text ILIKE '%recording equipment failure%'
  )
  AND (
    question_text ILIKE '%Code F%'
    OR question_text ILIKE '%para 3.2%'
    OR category ILIKE '%PACE Code F%'
    OR category ILIKE '%Code F%'
  )
  AND (
    explanation ILIKE '%not working correctly%'
    OR explanation ILIKE '%not working%'
    OR explanation IS NULL
    OR explanation = ''
  );
```

## Verification

After running the fix, verify:
1. The explanation should now be complete and professional
2. The question should display correctly in practice mode
3. Users should see the full explanation when reviewing answers

## Status
✅ SQL script created  
⏳ Ready to deploy to Supabase
