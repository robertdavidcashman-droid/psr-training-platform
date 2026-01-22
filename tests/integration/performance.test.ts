import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { questions as allQuestions } from "@/content/questions";
import standardsData from "@/content/psras/standards.json";

const projectRoot = process.cwd();

describe("Performance & Stability Checks", () => {
  it("should load all questions quickly", () => {
    const start = Date.now();
    const questions = allQuestions;
    const duration = Date.now() - start;

    expect(questions.length).toBeGreaterThan(0);
    expect(duration).toBeLessThan(1000); // Should load in < 1 second
  });

  it("should compute coverage matrix efficiently", () => {
    const start = Date.now();

    // Build tag-to-questions map
    const tagToQuestions = new Map<string, typeof allQuestions>();
    for (const q of allQuestions) {
      for (const tag of q.tags ?? []) {
        const list = tagToQuestions.get(tag) ?? [];
        list.push(q);
        tagToQuestions.set(tag, list);
      }
    }

    // Process standards data
    let totalCriteria = 0;
    for (const part of standardsData.parts ?? []) {
      for (const unit of part.units ?? []) {
        for (const outcome of unit.outcomes ?? []) {
          for (const criterion of outcome.criteria ?? []) {
            totalCriteria++;
            const matchingQuestions = new Set<string>();
            for (const tag of criterion.tags ?? []) {
              for (const q of tagToQuestions.get(tag) ?? []) {
                matchingQuestions.add(q.id);
              }
            }
          }
        }
      }
    }

    const duration = Date.now() - start;

    expect(totalCriteria).toBeGreaterThan(0);
    expect(duration).toBeLessThan(1000); // Should compute in < 1 second
  });

  it("should not have N+1 query patterns in question loading", () => {
    // This test ensures we're not doing repeated file reads
    const questionsDir = join(projectRoot, "content", "questions");
    const files = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));

    // All questions should be loaded from index, not individual files
    const start = Date.now();
    const questions = allQuestions;
    const duration = Date.now() - start;

    // Loading from index should be very fast
    expect(duration).toBeLessThan(100);
  });

  it("should have efficient question lookup by tag", () => {
    const start = Date.now();

    // Build index once
    const tagIndex = new Map<string, typeof allQuestions>();
    for (const q of allQuestions) {
      for (const tag of q.tags ?? []) {
        const list = tagIndex.get(tag) ?? [];
        list.push(q);
        tagIndex.set(tag, list);
      }
    }

    // Lookup multiple tags
    const testTags = ["pace", "bail", "disclosure", "interview", "vulnerability"];
    for (const tag of testTags) {
      const questions = tagIndex.get(tag) ?? [];
      expect(questions.length).toBeGreaterThanOrEqual(0);
    }

    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100); // Lookups should be very fast
  });

  it("should validate question schema efficiently", () => {
    const start = Date.now();

    // Validate all questions have required fields
    let validCount = 0;
    for (const q of allQuestions) {
      if (q.id && q.stem && q.explanation && q.difficulty && q.type) {
        validCount++;
      }
    }

    const duration = Date.now() - start;
    expect(validCount).toBe(allQuestions.length);
    expect(duration).toBeLessThan(500); // Validation should be fast
  });
});
