/**
 * Coverage Requirements Tests
 * 
 * Tests that enforce:
 * - Every criterion has >= 30 questions
 * - Every question has >= 2 citations
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import type { Question } from "@/lib/schemas";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const MIN_QUESTIONS_PER_CRITERION = 30;
const MIN_CITATIONS_PER_QUESTION = 2;

function loadStandards() {
  const standardsPath = join(projectRoot, "content", "psras", "standards.json");
  const data = JSON.parse(readFileSync(standardsPath, "utf-8"));
  const criteria: Array<{ id: string; label: string; tags?: string[] }> = [];

  for (const part of data.parts ?? []) {
    for (const unit of part.units ?? []) {
      for (const outcome of unit.outcomes ?? []) {
        for (const criterion of outcome.criteria ?? []) {
          criteria.push(criterion);
        }
      }
    }
  }

  return criteria;
}

function loadQuestions(): Question[] {
  const questionsDir = join(projectRoot, "content", "questions");
  const questions: Question[] = [];

  if (!statSync(questionsDir).isDirectory()) {
    throw new Error(`Questions directory not found: ${questionsDir}`);
  }

  const files = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = join(questionsDir, file);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    if (Array.isArray(data?.questions)) {
      questions.push(...data.questions);
    }
  }

  return questions;
}

function getQuestionsForCriterion(
  criterion: { tags?: string[] },
  allQuestions: Question[]
): Question[] {
  const matchingQuestions = new Map<string, Question>();

  for (const q of allQuestions) {
    const questionTags = q.tags ?? [];
    const criterionTags = criterion.tags ?? [];

    const matches = criterionTags.some((tag) => questionTags.includes(tag));
    if (matches) {
      matchingQuestions.set(q.id, q);
    }
  }

  return Array.from(matchingQuestions.values());
}

describe("Coverage Requirements", () => {
  const criteria = loadStandards();
  const questions = loadQuestions();

  it("should have questions loaded", () => {
    expect(questions.length).toBeGreaterThan(0);
  });

  it("should have criteria loaded", () => {
    expect(criteria.length).toBeGreaterThan(0);
  });

  describe("Criterion Coverage", () => {
    for (const criterion of criteria) {
      it(`criterion ${criterion.id} (${criterion.label}) should have >= ${MIN_QUESTIONS_PER_CRITERION} questions`, () => {
        const matchingQuestions = getQuestionsForCriterion(criterion, questions);
        expect(matchingQuestions.length).toBeGreaterThanOrEqual(
          MIN_QUESTIONS_PER_CRITERION
        );
      });
    }
  });

  describe("Question Citations", () => {
    for (const question of questions) {
      it(`question ${question.id} should have >= ${MIN_CITATIONS_PER_QUESTION} citations`, () => {
        const citationCount = question.references?.length ?? 0;
        expect(citationCount).toBeGreaterThanOrEqual(MIN_CITATIONS_PER_QUESTION);
      });

      it(`question ${question.id} citations should have instrument and cite`, () => {
        for (const ref of question.references ?? []) {
          expect(ref.instrument).toBeDefined();
          expect(ref.cite).toBeDefined();
          expect(typeof ref.instrument).toBe("string");
          expect(typeof ref.cite).toBe("string");
        }
      });
    }
  });

  describe("Overall Coverage Statistics", () => {
    it("should report coverage statistics", () => {
      let criteriaWithZeroQuestions = 0;
      let criteriaWithInsufficientQuestions = 0;
      let questionsWithInsufficientCitations = 0;

      for (const criterion of criteria) {
        const matchingQuestions = getQuestionsForCriterion(criterion, questions);
        if (matchingQuestions.length === 0) {
          criteriaWithZeroQuestions++;
        } else if (matchingQuestions.length < MIN_QUESTIONS_PER_CRITERION) {
          criteriaWithInsufficientQuestions++;
        }
      }

      for (const question of questions) {
        const citationCount = question.references?.length ?? 0;
        if (citationCount < MIN_CITATIONS_PER_QUESTION) {
          questionsWithInsufficientCitations++;
        }
      }

      console.log("\nCoverage Statistics:");
      console.log(`  Total criteria: ${criteria.length}`);
      console.log(`  Criteria with 0 questions: ${criteriaWithZeroQuestions}`);
      console.log(
        `  Criteria with <${MIN_QUESTIONS_PER_CRITERION} questions: ${criteriaWithInsufficientQuestions}`
      );
      console.log(
        `  Questions with <${MIN_CITATIONS_PER_QUESTION} citations: ${questionsWithInsufficientCitations}`
      );

      expect(criteriaWithZeroQuestions).toBe(0);
      expect(criteriaWithInsufficientQuestions).toBe(0);
      expect(questionsWithInsufficientCitations).toBe(0);
    });
  });
});
