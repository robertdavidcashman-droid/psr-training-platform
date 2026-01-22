#!/usr/bin/env tsx

/**
 * Coverage Seeding Script
 * 
 * Generates missing questions to ensure every criterion has at least 30 questions.
 * Only adds questions that are missing - does not delete existing questions.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { generateQuestionsForCriterion, type Criterion } from "../lib/questionGenerator";
import type { Question } from "../lib/schemas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const MIN_QUESTIONS_PER_CRITERION = 30;

interface QuestionFile {
  path: string;
  questions: Question[];
}

function loadStandards(): Criterion[] {
  const standardsPath = join(projectRoot, "content", "psras", "standards.json");
  const data = JSON.parse(readFileSync(standardsPath, "utf-8"));
  const criteria: Criterion[] = [];

  for (const part of data.parts ?? []) {
    for (const unit of part.units ?? []) {
      for (const outcome of unit.outcomes ?? []) {
        for (const criterion of outcome.criteria ?? []) {
          criteria.push({
            id: criterion.id,
            label: criterion.label,
            summary: criterion.summary ?? "",
            tags: criterion.tags ?? [],
            expectedAuthorities: criterion.expectedAuthorities ?? [],
          });
        }
      }
    }
  }

  return criteria;
}

function loadAllQuestions(): { questions: Question[]; existingIds: Set<string> } {
  const questionsDir = join(projectRoot, "content", "questions");
  const allQuestions: Question[] = [];
  const existingIds = new Set<string>();

  if (!statSync(questionsDir).isDirectory()) {
    throw new Error(`Questions directory not found: ${questionsDir}`);
  }

  const files = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = join(questionsDir, file);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    if (Array.isArray(data?.questions)) {
      for (const q of data.questions) {
        allQuestions.push(q);
        existingIds.add(q.id);
      }
    }
  }

  return { questions: allQuestions, existingIds };
}

function getQuestionsForCriterion(
  criterion: Criterion,
  allQuestions: Question[]
): Question[] {
  const matchingQuestions = new Map<string, Question>();

  for (const q of allQuestions) {
    const questionTags = q.tags ?? [];
    const criterionTags = criterion.tags ?? [];

    // Check if question matches any criterion tag
    const matches = criterionTags.some((tag) => questionTags.includes(tag));
    if (matches) {
      matchingQuestions.set(q.id, q);
    }
  }

  return Array.from(matchingQuestions.values());
}

function findOrCreateQuestionFile(
  criterion: Criterion,
  questionsDir: string
): QuestionFile {
  // Try to find an existing file that matches the criterion's primary tag
  const primaryTag = criterion.tags?.[0];
  if (primaryTag) {
    // Map common tags to file names
    const tagToFile: Record<string, string> = {
      "authority-to-act": "authority-to-act.json",
      "dscc": "authority-to-act.json",
      "probationary": "probationary-extended.json",
      "legal-advice": "delay-legal-advice.json",
      "s58": "delay-legal-advice.json",
      "telephone-advice": "telephone-advice.json",
      "detention": "pace.json",
      "time-limits": "pace-extended.json",
      "reviews": "pace-extended.json",
      "vulnerability": "vulnerability.json",
      "appropriate-adult": "vulnerability-extended.json",
      "disclosure": "disclosure.json",
      "interview": "interview.json",
      "intervention": "interview-extended.json",
      "bail": "bail.json",
      "charging": "charging.json",
      "identification": "identification.json",
      "recording": "interview-recording.json",
      "arrest": "voluntary-attendance.json",
      "nfa": "nfa-cautions.json",
      "register": "register-entry.json",
      "cit": "cit-scenarios.json",
      "ethics": "client-care.json",
      "portfolio": "portfolio.json",
    };

    const fileName = tagToFile[primaryTag];
    if (fileName) {
      const filePath = join(questionsDir, fileName);
      if (statSync(filePath).isFile()) {
        const data = JSON.parse(readFileSync(filePath, "utf-8"));
        return {
          path: filePath,
          questions: Array.isArray(data?.questions) ? data.questions : [],
        };
      }
    }
  }

  // Default: use a generic file or create new one
  // For now, use "variety-samples.json" as a catch-all
  const defaultPath = join(questionsDir, "variety-samples.json");
  if (statSync(defaultPath).isFile()) {
    const data = JSON.parse(readFileSync(defaultPath, "utf-8"));
    return {
      path: defaultPath,
      questions: Array.isArray(data?.questions) ? data.questions : [],
    };
  }

  // Create new file
  return {
    path: defaultPath,
    questions: [],
  };
}

function saveQuestionFile(file: QuestionFile) {
  const data = {
    questions: file.questions,
  };
  writeFileSync(file.path, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function main() {
  console.log("🌱 Coverage Seeding Script\n");
  console.log(`Target: ${MIN_QUESTIONS_PER_CRITERION} questions per criterion\n`);

  const criteria = loadStandards();
  const { questions: allQuestions, existingIds } = loadAllQuestions();
  const questionsDir = join(projectRoot, "content", "questions");

  let totalGenerated = 0;
  let criteriaNeedingQuestions = 0;
  const results: Array<{
    criterionId: string;
    label: string;
    existing: number;
    generated: number;
    total: number;
  }> = [];

  for (const criterion of criteria) {
    const existingQuestions = getQuestionsForCriterion(criterion, allQuestions);
    const existingCount = existingQuestions.length;
    const needed = Math.max(0, MIN_QUESTIONS_PER_CRITERION - existingCount);

    if (needed > 0) {
      criteriaNeedingQuestions++;
      console.log(
        `📝 ${criterion.id}: ${existingCount}/${MIN_QUESTIONS_PER_CRITERION} questions - generating ${needed}...`
      );

      // Generate questions
      const generated = generateQuestionsForCriterion(criterion, existingIds);

      // Take only the number needed
      const questionsToAdd = generated.slice(0, needed);

      // Add to existing IDs to avoid duplicates
      for (const q of questionsToAdd) {
        existingIds.add(q.id);
      }

      // Find or create appropriate file
      const questionFile = findOrCreateQuestionFile(criterion, questionsDir);

      // Add questions to file
      questionFile.questions.push(...questionsToAdd);

      // Save file
      saveQuestionFile(questionFile);

      // Update allQuestions for next iterations
      allQuestions.push(...questionsToAdd);

      totalGenerated += questionsToAdd.length;

      results.push({
        criterionId: criterion.id,
        label: criterion.label,
        existing: existingCount,
        generated: questionsToAdd.length,
        total: existingCount + questionsToAdd.length,
      });
    } else {
      results.push({
        criterionId: criterion.id,
        label: criterion.label,
        existing: existingCount,
        generated: 0,
        total: existingCount,
      });
    }
  }

  console.log("\n=== Seeding Summary ===\n");
  console.log(`Total criteria: ${criteria.length}`);
  console.log(`Criteria needing questions: ${criteriaNeedingQuestions}`);
  console.log(`Total questions generated: ${totalGenerated}`);

  console.log("\n=== Detailed Results ===\n");
  for (const result of results) {
    if (result.generated > 0) {
      console.log(
        `✅ ${result.criterionId}: ${result.existing} → ${result.total} questions (+${result.generated})`
      );
    } else if (result.existing < MIN_QUESTIONS_PER_CRITERION) {
      console.log(
        `⚠️  ${result.criterionId}: ${result.existing}/${MIN_QUESTIONS_PER_CRITERION} questions (no questions generated - check generator)`
      );
    }
  }

  // Run audit to verify
  console.log("\n=== Running Audit ===\n");
  try {
    const { execSync } = require("child_process");
    execSync("npm run audit:coverage", { stdio: "inherit" });
  } catch (error) {
    console.error("\n⚠️  Audit failed - some criteria may still need questions");
    process.exit(1);
  }

  console.log("\n✅ Seeding complete!");
}

main();
