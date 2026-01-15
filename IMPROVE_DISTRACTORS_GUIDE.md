# Guide: Improving Question Distractors

## Overview

This guide helps you improve the quality of multiple-choice questions by making distractors (incorrect answers) more plausible and challenging. Good distractors should make students think carefully rather than allowing them to immediately eliminate wrong answers.

## What Makes a Weak Distractor?

Distractors are considered "weak" if they are too obviously wrong, making it easy to guess the correct answer. Common issues include:

### 1. Absolute Terms
- **Avoid:** "Always", "Never", "Cannot", "Only"
- **Better:** "Generally", "Rarely", "May not", "Primarily"
- **Example:**
  - ❌ Weak: "Police must always wait for a solicitor"
  - ✅ Better: "Police generally wait for a solicitor when requested"

### 2. "Nothing" Answers
- **Avoid:** "Nothing", "None", "Not required"
- **Better:** Be specific about what is not required in these circumstances
- **Example:**
  - ❌ Weak: "Nothing - disclosure is optional"
  - ✅ Better: "Disclosure is not mandatory under CPIA 1996 - it is at the prosecution's discretion"

### 3. Overly Short or Vague
- **Avoid:** Very short answers (less than 30 characters)
- **Better:** Provide enough detail to be plausible
- **Example:**
  - ❌ Weak: "Yes"
  - ✅ Better: "Yes, but only in certain circumstances with appropriate safeguards"

### 4. Extreme or Illegal Statements
- **Avoid:** "Illegal", "Forbidden", "Must not" (unless actually true)
- **Better:** "Not permitted in these circumstances", "May not be appropriate"
- **Example:**
  - ❌ Weak: "This is illegal under PACE"
  - ✅ Better: "This is not permitted under these circumstances without proper authorization"

## Principles for Good Distractors

### 1. Plausibility
Distractors should be believable based on common misconceptions or partially correct information.

### 2. Similar Length and Style
Distractors should be similar in length and writing style to the correct answer to avoid giving clues.

### 3. Related Concepts
Distractors should test understanding of related but distinct concepts.

### 4. Common Mistakes
Include distractors based on common student mistakes or misconceptions.

## How to Use the Admin Interface

### Step 1: Identify Weak Questions
1. Navigate to `/admin/questions`
2. Use the "Quality" filter to show only "Needs Review (<8)"
3. Review the quality score and issues listed

### Step 2: Review Each Question
For each question flagged:
1. Read the question and all options carefully
2. Check the "Issues Found" section to see specific problems
3. Look at which distractors are marked as "Weak Distractor"

### Step 3: Improve Distractors
1. Click "Edit" on the question
2. For each weak distractor, rewrite it to:
   - Remove absolute terms (replace with nuanced language)
   - Add context and detail
   - Make it plausible based on common misconceptions
   - Match the length and style of the correct answer

### Step 4: Save and Verify
1. Click "Save Changes"
2. The quality score will update after reloading
3. Verify that all distractors are now plausible

## Examples of Improvements

### Example 1: Disclosure Question

**Before (Weak Distractors):**
- Option A: "Nothing - disclosure is optional"
- Option B: "The court must automatically acquit"
- Option C: "The court may stay proceedings..." ✅ (Correct)
- Option D: "The court can only order disclosure"

**After (Improved):**
- Option A: "Disclosure is not mandatory under CPIA 1996 - it is at the prosecution's discretion"
- Option B: "The court must automatically acquit the defendant without considering the evidence"
- Option C: "The court may stay proceedings..." ✅ (Correct)
- Option D: "The court can only order disclosure but cannot stay proceedings or exclude evidence"

### Example 2: Appropriate Adult Question

**Before (Weak):**
- Option A: "Proceed - client is 16"
- Option B: "Insist that an appropriate adult is called..." ✅ (Correct)
- Option C: "Only if client wants one"
- Option D: "Not required for 16-year-olds"

**After (Improved):**
- Option A: "Proceed with the interview as the client is 16 and appears to understand the situation"
- Option B: "Insist that an appropriate adult is called..." ✅ (Correct)
- Option C: "Ask the client if they want an appropriate adult present, and proceed if they decline"
- Option D: "Request an appropriate adult but allow the interview to proceed if one cannot be found immediately"

## Quality Scoring

Questions are scored on a scale of 0-10:

- **10/10:** Excellent - All distractors are plausible and challenging
- **8-9/10:** Good - Minor improvements possible
- **6-7/10:** Needs Review - Some distractors are weak
- **<6/10:** Poor - Multiple weak distractors, significant revision needed

## Checklist for Review

When reviewing and improving distractors, ask yourself:

- [ ] Are all distractors plausible (could a student reasonably choose them)?
- [ ] Do distractors avoid absolute terms (always/never/nothing)?
- [ ] Are distractors similar in length and style to the correct answer?
- [ ] Do distractors test understanding of related concepts?
- [ ] Would a knowledgeable student need to think carefully to eliminate wrong answers?
- [ ] Do distractors avoid giving away the correct answer through style differences?

## Using the SQL Script

You can also use the SQL script to identify weak questions directly in the database:

```sql
-- Run scripts/identify_weak_distractors.sql
-- This will list all questions with quality scores < 8
-- Ordered by worst quality first
```

## Best Practices Summary

1. **Make distractors plausible** - They should test real misunderstandings
2. **Use nuanced language** - Avoid absolutes, use qualifiers
3. **Match style and length** - Don't give hints through formatting
4. **Test related concepts** - Distractors should cover related but distinct ideas
5. **Review regularly** - Continuously improve question quality based on student performance

## Need Help?

If you're unsure about improving a distractor:
- Consider common student misconceptions in this topic area
- Review similar questions to see what works well
- Ask a subject matter expert for feedback
- Test the question with students and observe which distractors they choose
