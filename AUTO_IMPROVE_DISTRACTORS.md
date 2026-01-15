# Auto-Improve Question Distractors

This guide explains how to automatically improve weak distractors in your questions to make them more challenging and plausible.

## Overview

The automated improvement system identifies common weak patterns in distractors and replaces them with better alternatives:

- **"Nothing"** → **"This is not required"**
- **"Always"** → **"Generally"**
- **"Never"** → **"Rarely"**
- **"Cannot"** → **"May not be able to"**
- **"Only"** → **"Primarily"**
- **"Illegal"** → **"Not permitted in these circumstances"**
- **"Must not"** → **"Should not"**
- **"Forbidden"** → **"Not permitted"**

## Method 1: SQL Script (Recommended for Database)

### Quick Start

1. Open your Supabase SQL Editor
2. Copy and paste the contents of `scripts/auto-improve-distractors.sql`
3. Run the script
4. Review the results

### What It Does

- Creates a function `improve_distractor_auto()` that improves distractor text
- Updates all approved questions automatically
- Only modifies distractors (incorrect answers), not correct answers
- Reports how many questions were updated

### Advantages

- ✅ Runs directly in database
- ✅ No need for Node.js environment
- ✅ Fast and efficient
- ✅ Can be scheduled or run on-demand

## Method 2: JavaScript Script (For Automation)

### Prerequisites

- Node.js installed
- Environment variables set up (`.env.local`)
- Required packages: `@supabase/supabase-js`, `dotenv`

### Quick Start

1. Make sure you have the required environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   # OR
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Run the script:
   ```bash
   node scripts/auto-improve-distractors.js
   ```

### What It Does

- Fetches all approved questions
- Calculates quality scores for each question
- Identifies questions with weak distractors (score < 8)
- Automatically improves distractors using pattern matching
- Updates questions in the database
- Provides detailed statistics

### Output Example

```
🚀 AUTO-IMPROVING QUESTION DISTRACTORS
============================================================
📋 Step 1: Fetching all approved questions...
   ✅ Found 150 questions

📋 Step 2: Analyzing and improving distractors...
   ✅ Identified 45 questions needing improvement

📋 Step 3: Applying improvements to database...
   Progress: 10/45 questions updated
   Progress: 20/45 questions updated
   Progress: 30/45 questions updated
   Progress: 40/45 questions updated
   ✅ Successfully improved 45 questions

📊 Step 4: Calculating final statistics...
============================================================
✅ AUTO-IMPROVEMENT COMPLETE!
============================================================

📊 Final Statistics:
   Total questions: 150
   Excellent quality (10/10): 85
   Good quality (8-9/10): 55
   Needs review (<8/10): 10
   Average quality score: 8.5/10
   Questions improved: 45
```

## What Gets Improved

The script automatically improves distractors by:

1. **Replacing absolute terms** with nuanced language
2. **Making vague statements** more specific
3. **Improving tone** to match the correct answer style
4. **Adding context** where appropriate

### Example Transformations

**Before:**
- "Nothing - disclosure is optional"
- "Police must always wait for a solicitor"
- "This is illegal under PACE"
- "Only solicitors can represent clients"

**After:**
- "This is not required - disclosure is at the prosecution's discretion"
- "Police generally wait for a solicitor when requested"
- "This is not permitted in these circumstances under PACE"
- "Primarily solicitors represent clients, but other representatives may be authorized"

## Safety Features

1. **Only modifies approved questions** - Questions in draft or pending status are not changed
2. **Only improves distractors** - Correct answers are never modified
3. **Preserves structure** - JSON structure and option keys remain unchanged
4. **Non-destructive** - You can review changes and revert if needed (via version control or database backups)

## Review After Auto-Improvement

After running the auto-improvement:

1. **Check the admin interface** at `/admin/questions`
2. **Review quality scores** - They should have improved
3. **Spot-check random questions** - Make sure improvements make sense
4. **Verify correctness** - Ensure correct answers weren't modified (they shouldn't be)

## Manual Review Recommended For

While the script handles common patterns well, you may want to manually review:

- Questions with very short distractors (< 30 characters)
- Questions requiring domain-specific knowledge
- Questions where context matters significantly
- Questions with technical legal terminology

## Running Periodically

You can run the auto-improvement script:

- **After importing new questions** - To ensure quality from the start
- **Periodically** - To catch any questions that were missed
- **Before major releases** - To ensure all questions are of high quality

## Limitations

The automated script is good at:
- ✅ Replacing common weak patterns
- ✅ Improving language consistency
- ✅ Basic text transformations

The automated script cannot:
- ❌ Understand context deeply
- ❌ Create domain-specific improvements
- ❌ Replace very short answers with meaningful content (flags but doesn't auto-fix)
- ❌ Handle questions requiring expert knowledge

For these cases, use the manual admin interface at `/admin/questions`.

## Troubleshooting

### Script fails with "Missing environment variables"
- Make sure `.env.local` exists with `NEXT_PUBLIC_SUPABASE_URL`
- For SQL script, this doesn't apply - run directly in Supabase

### No questions were updated
- Check that you have questions with `status = 'approved'`
- Verify that questions actually have weak distractors (check quality scores)
- Look at the console output for specific error messages

### Questions seem incorrect after improvement
- Review the changes in the admin interface
- Check if the pattern matching replaced something incorrectly
- Revert specific questions if needed
- Consider adjusting the improvement function for edge cases

## Next Steps

1. Run the auto-improvement script
2. Review the improved questions
3. Use the admin interface for any remaining manual improvements
4. Monitor question quality scores over time

## Support

If you encounter issues:
1. Check the console/error logs
2. Verify database permissions
3. Review the improvement patterns in the script
4. Test with a small subset of questions first
