# Complete Fix Guide - Answer Formats & Distractors

This guide will help you fix all answer format issues and improve distractors for all questions.

## Quick Fix (Run in Order)

### Step 1: Fix Answer Format Mismatches
**File:** `scripts/FIX_ANSWERS_NOW.sql`

**What it does:**
- Fixes all questions where answers use letters (a,b,c,d) but options use numbers (0,1,2,3)
- Fixes the specific disclosure question
- Shows verification results

**How to run:**
1. Go to: https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new
2. Copy and paste the entire `FIX_ANSWERS_NOW.sql` file
3. Click "Run"
4. Check the results - should show 0 format mismatches

---

### Step 2: Improve Scenario Question Distractors
**File:** `scripts/IMPROVE_ALL_SCENARIOS.sql`

**What it does:**
- Improves distractors for scenario-based questions
- Makes incorrect answers more plausible
- Updates 3 main scenario questions

**How to run:**
1. In Supabase SQL Editor (same as above)
2. Copy and paste `IMPROVE_ALL_SCENARIOS.sql`
3. Click "Run"
4. Check results - shows which scenario questions were improved

---

### Step 3: Improve ALL Question Distractors
**File:** `scripts/IMPROVE_ALL_DISTRACTORS.sql`

**What it does:**
- Finds all questions with weak distractors (containing "nothing", "always", "never", etc.)
- Improves them automatically
- Makes incorrect answers more plausible and challenging
- Applies to ALL questions, not just scenarios

**How to run:**
1. In Supabase SQL Editor
2. Copy and paste `IMPROVE_ALL_DISTRACTORS.sql`
3. Click "Run"
4. Review the results - shows how many questions were improved

---

## What Gets Fixed

### Answer Format Issues
- ✅ Converts letter answers (["b"]) to numeric (["1"]) when options use numbers
- ✅ Converts numeric answers to letters when options use letters
- ✅ Ensures all answers match their option key format

### Distractor Improvements
- ✅ Replaces "Nothing" with "This is not required" or context-appropriate alternatives
- ✅ Replaces "Always" with "Generally"
- ✅ Replaces "Never" with "Rarely"
- ✅ Replaces "Only" with "Primarily"
- ✅ Replaces "Cannot" with "May not be able to"
- ✅ Makes distractors more plausible and challenging

---

## Expected Results

After running all three scripts:

1. **Format Mismatches:** 0 remaining
2. **Scenario Questions:** All have improved distractors
3. **All Questions:** Distractors are more plausible and challenging

---

## Verification

After running the scripts, test in the app:

1. Go to Practice Mode
2. Try the disclosure question - should mark correctly
3. Try scenario questions - distractors should be more challenging
4. Try other questions - incorrect answers should be plausible

---

## Files Created

- `scripts/FIX_ANSWERS_NOW.sql` - Fixes format mismatches
- `scripts/IMPROVE_ALL_SCENARIOS.sql` - Improves scenario distractors
- `scripts/IMPROVE_ALL_DISTRACTORS.sql` - Improves all question distractors
- `scripts/validate-answer-formats.js` - Validation script (optional)

---

## Quick Links

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/cvsawjrtgmsmadtfwfa/sql/new
- **Practice Mode:** http://localhost:3000/practice

---

## Notes

- All scripts are idempotent (safe to run multiple times)
- Scripts show verification results after running
- Some questions may need manual review if they have complex distractors
- The improvement scripts preserve correct answers - only incorrect options are improved

















