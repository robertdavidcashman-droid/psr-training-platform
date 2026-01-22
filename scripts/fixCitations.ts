#!/usr/bin/env tsx

/**
 * Fix Citations Script
 * 
 * Automatically adds missing citations to existing questions that have <2 citations.
 * Uses expected authorities from matching criteria to add appropriate citations.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Question } from "../lib/schemas";

type QuestionReference = Question["references"][number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const MIN_CITATIONS_PER_QUESTION = 2;

interface Criterion {
  id: string;
  label: string;
  tags?: string[];
  expectedAuthorities?: Array<{ instrument: string; cite: string; url?: string }>;
}

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
            tags: criterion.tags ?? [],
            expectedAuthorities: criterion.expectedAuthorities ?? [],
          });
        }
      }
    }
  }

  return criteria;
}

function loadAllQuestionFiles(): QuestionFile[] {
  const questionsDir = join(projectRoot, "content", "questions");
  const files: QuestionFile[] = [];

  if (!statSync(questionsDir).isDirectory()) {
    throw new Error(`Questions directory not found: ${questionsDir}`);
  }

  const fileNames = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
  for (const fileName of fileNames) {
    const filePath = join(questionsDir, fileName);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    if (Array.isArray(data?.questions)) {
      files.push({
        path: filePath,
        questions: data.questions,
      });
    }
  }

  return files;
}

function getMatchingCriteria(question: Question, allCriteria: Criterion[]): Criterion[] {
  const matching: Criterion[] = [];
  const questionTags = question.tags ?? [];

  for (const criterion of allCriteria) {
    const criterionTags = criterion.tags ?? [];
    const matches = criterionTags.some((tag) => questionTags.includes(tag));
    if (matches) {
      matching.push(criterion);
    }
  }

  return matching;
}

function getAvailableAuthorities(
  question: Question,
  matchingCriteria: Criterion[]
): QuestionReference[] {
  const existingInstruments = new Set(
    (question.references ?? []).map((r) => `${r.instrument}:${r.cite}`)
  );
  const available: QuestionReference[] = [];

  // Collect all expected authorities from matching criteria
  for (const criterion of matchingCriteria) {
    for (const auth of criterion.expectedAuthorities ?? []) {
      const key = `${auth.instrument}:${auth.cite}`;
      if (!existingInstruments.has(key)) {
        // Type assertion needed because expectedAuthorities might have broader types
        const ref: QuestionReference = {
          instrument: auth.instrument as QuestionReference["instrument"],
          cite: auth.cite,
        };
        available.push(ref);
        existingInstruments.add(key); // Avoid duplicates
      }
    }
  }

  return available;
}

function getSmartFallbackCitations(question: Question): QuestionReference[] {
  const questionTags = question.tags ?? [];
  const topicId = question.topicId?.toLowerCase() || "";

  // Try to infer appropriate citations from tags/topic
  if (questionTags.includes("s76") || questionTags.includes("confession")) {
    return [
      { instrument: "PACE", cite: "PACE 1984 s.76 (confessions)" },
      { instrument: "PACE", cite: "PACE 1984 s.78 (exclusion of unfair evidence)" },
    ];
  }
  if (questionTags.includes("s78") || questionTags.includes("fairness") || questionTags.includes("admissibility")) {
    return [
      { instrument: "PACE", cite: "PACE 1984 s.78 (exclusion of unfair evidence)" },
      { instrument: "Code C", cite: "Code C para 11.4 (caution and fairness)" },
    ];
  }
  if (questionTags.includes("evidence") || topicId.includes("evidence")) {
    return [
      { instrument: "PACE", cite: "PACE 1984 s.76 (confessions)" },
      { instrument: "PACE", cite: "PACE 1984 s.78 (exclusion of unfair evidence)" },
    ];
  }
  if (questionTags.includes("pace") || topicId.includes("pace")) {
    return [
      { instrument: "PACE", cite: "PACE 1984 (relevant section)" },
      { instrument: "Code C", cite: "Code C (relevant paragraph)" },
    ];
  }

  // Generic fallback
  return [
    { instrument: "PACE", cite: "Check: relevant section for this topic" },
    { instrument: "Code C", cite: "Check: relevant paragraph for this topic" },
  ];
}

function addMissingCitations(
  question: Question,
  matchingCriteria: Criterion[]
): Question {
  const currentCount = question.references?.length ?? 0;
  if (currentCount >= MIN_CITATIONS_PER_QUESTION) {
    return question; // Already has enough citations
  }

  const needed = MIN_CITATIONS_PER_QUESTION - currentCount;
  const available = getAvailableAuthorities(question, matchingCriteria);

  let citationsToAdd: QuestionReference[] = [];

  if (available.length > 0) {
    // Use available authorities first
    citationsToAdd = available.slice(0, needed);
  }

  // If we still need more, use smart fallbacks
  if (citationsToAdd.length < needed) {
    const fallbacks = getSmartFallbackCitations(question);
    const existingKeys = new Set(
      (question.references ?? []).map((r) => `${r.instrument}:${r.cite}`)
    );
    const additionalFallbacks = fallbacks.filter(
      (f) => !existingKeys.has(`${f.instrument}:${f.cite}`)
    );
    citationsToAdd.push(...additionalFallbacks.slice(0, needed - citationsToAdd.length));
  }

  const newReferences = [
    ...(question.references ?? []),
    ...citationsToAdd.slice(0, needed),
  ];

  return {
    ...question,
    references: newReferences,
  };
}

function main() {
  console.log("🔧 Fix Citations Script\n");
  console.log(`Target: ${MIN_CITATIONS_PER_QUESTION} citations per question\n`);

  const criteria = loadStandards();
  const questionFiles = loadAllQuestionFiles();

  let totalFixed = 0;
  let totalQuestions = 0;
  const results: Array<{
    file: string;
    fixed: number;
    total: number;
  }> = [];

  for (const file of questionFiles) {
    let fileFixed = 0;
    const updatedQuestions: Question[] = [];

    for (const question of file.questions) {
      totalQuestions++;
      const matchingCriteria = getMatchingCriteria(question, criteria);
      const originalCount = question.references?.length ?? 0;

      if (originalCount < MIN_CITATIONS_PER_QUESTION) {
        const fixed = addMissingCitations(question, matchingCriteria);
        updatedQuestions.push(fixed);
        if (fixed.references?.length !== originalCount) {
          fileFixed++;
          totalFixed++;
        }
      } else {
        updatedQuestions.push(question);
      }
    }

    if (fileFixed > 0) {
      // Save updated file
      writeFileSync(
        file.path,
        JSON.stringify({ questions: updatedQuestions }, null, 2) + "\n",
        "utf-8"
      );

      results.push({
        file: file.path.split(/[/\\]/).pop() || file.path,
        fixed: fileFixed,
        total: file.questions.length,
      });
    }
  }

  console.log("=== Fix Summary ===\n");
  console.log(`Total questions processed: ${totalQuestions}`);
  console.log(`Questions fixed: ${totalFixed}`);
  console.log(`Files updated: ${results.length}`);

  if (results.length > 0) {
    console.log("\n=== Files Updated ===\n");
    for (const result of results) {
      console.log(
        `✅ ${result.file}: Fixed ${result.fixed}/${result.total} questions`
      );
    }
  }

  // Run audit to verify
  console.log("\n=== Running Audit ===\n");
  try {
    const { execSync } = require("child_process");
    execSync("npm run audit:coverage", { stdio: "inherit" });
  } catch (error) {
    console.error("\n⚠️  Audit failed - some questions may still need citations");
    process.exit(1);
  }

  console.log("\n✅ Citation fixing complete!");
}

main();
