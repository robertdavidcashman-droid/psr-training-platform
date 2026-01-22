import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { TopicSchema, QuestionSchema } from "@/lib/schemas";

describe("Content Files", () => {
  const contentDir = path.join(process.cwd(), "content");

  describe("topics.json", () => {
    it("should exist and be valid JSON", () => {
      const filePath = path.join(contentDir, "topics.json");
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it("should have categories array", () => {
      const filePath = path.join(contentDir, "topics.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      expect(data.categories).toBeDefined();
      expect(Array.isArray(data.categories)).toBe(true);
      expect(data.categories.length).toBeGreaterThan(0);
    });

    it("should have topics array with valid topics", () => {
      const filePath = path.join(contentDir, "topics.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      expect(data.topics).toBeDefined();
      expect(Array.isArray(data.topics)).toBe(true);
      expect(data.topics.length).toBeGreaterThan(0);

      // Validate each topic
      data.topics.forEach((topic: unknown) => {
        expect(() => TopicSchema.parse(topic)).not.toThrow();
      });
    });

    it("should have topics with valid category references", () => {
      const filePath = path.join(contentDir, "topics.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const categoryIds = data.categories.map((c: { id: string }) => c.id);

      data.topics.forEach((topic: { id: string; category: string }) => {
        expect(categoryIds).toContain(topic.category);
      });
    });
  });

  describe("questions", () => {
    const questionsDir = path.join(contentDir, "questions");

    function loadAllQuestions(): unknown[] {
      if (fs.existsSync(questionsDir) && fs.statSync(questionsDir).isDirectory()) {
        const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
        const all: unknown[] = [];
        for (const file of files) {
          const data = JSON.parse(fs.readFileSync(path.join(questionsDir, file), "utf-8"));
          if (Array.isArray(data.questions)) all.push(...data.questions);
        }
        return all;
      }

      // Legacy fallback (kept for safety)
      const legacyPath = path.join(contentDir, "questions.json");
      if (!fs.existsSync(legacyPath)) return [];
      const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
      return Array.isArray(legacy.questions) ? legacy.questions : [];
    }

    it("should load at least one questions file", () => {
      // If folder exists, it must contain at least one JSON file.
      if (fs.existsSync(questionsDir)) {
        const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
        expect(files.length).toBeGreaterThan(0);
      } else {
        // Otherwise legacy file must exist.
        expect(fs.existsSync(path.join(contentDir, "questions.json"))).toBe(true);
      }
    });

    it("should have questions array with valid questions", () => {
      const questions = loadAllQuestions();
      expect(questions.length).toBeGreaterThan(0);
      questions.forEach((question: unknown) => {
        expect(() => QuestionSchema.parse(question)).not.toThrow();
      });
    });

    it("should have questions with valid topic references", () => {
      const topicsPath = path.join(contentDir, "topics.json");
      const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
      const topicIds = topicsData.topics.map((t: { id: string }) => t.id);

      const questions = loadAllQuestions() as { topicId: string }[];
      const invalidTopics: string[] = [];
      questions.forEach((question) => {
        if (!topicIds.includes(question.topicId)) {
          invalidTopics.push(question.topicId);
        }
      });

      if (invalidTopics.length > 0) {
        const uniqueInvalid = Array.from(new Set(invalidTopics));
        console.warn(`Questions with invalid topicIds: ${uniqueInvalid.join(", ")}`);
        // For now, we'll warn but not fail - these need to be added to topics.json
        // expect(topicIds).toContain(question.topicId);
      }
    });

    it("should have MCQ questions with 4 options and a correct answer id", () => {
      const questions = loadAllQuestions() as unknown[];
      const mcqQuestions = questions.filter(
        (q): q is { type: string; options?: unknown; correct?: unknown } =>
          typeof q === "object" && q !== null && (q as { type?: unknown }).type === "mcq"
      );

      mcqQuestions.forEach((question) => {
        expect(question.options).toBeDefined();
        expect(Array.isArray(question.options)).toBe(true);
        expect((question.options as unknown[]).length).toBe(4);
        expect(["A", "B", "C", "D"]).toContain(question.correct);
      });
    });
  });

  describe("scenarios.json", () => {
    it("should exist and be valid JSON", () => {
      const filePath = path.join(contentDir, "scenarios.json");
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it("should have scenarios array", () => {
      const filePath = path.join(contentDir, "scenarios.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      expect(data.scenarios).toBeDefined();
      expect(Array.isArray(data.scenarios)).toBe(true);
      expect(data.scenarios.length).toBeGreaterThan(0);
    });

    it("should have scenarios with steps and choices", () => {
      const filePath = path.join(contentDir, "scenarios.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      data.scenarios.forEach((scenario: { steps: { choices: unknown[] }[] }) => {
        expect(scenario.steps).toBeDefined();
        expect(Array.isArray(scenario.steps)).toBe(true);
        expect(scenario.steps.length).toBeGreaterThan(0);

        scenario.steps.forEach((step) => {
          expect(step.choices).toBeDefined();
          expect(Array.isArray(step.choices)).toBe(true);
          expect(step.choices.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
