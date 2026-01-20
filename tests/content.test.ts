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

  describe("questions.json", () => {
    it("should exist and be valid JSON", () => {
      const filePath = path.join(contentDir, "questions.json");
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it("should have questions array with valid questions", () => {
      const filePath = path.join(contentDir, "questions.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      expect(data.questions).toBeDefined();
      expect(Array.isArray(data.questions)).toBe(true);
      expect(data.questions.length).toBeGreaterThan(0);

      // Validate each question
      data.questions.forEach((question: unknown) => {
        expect(() => QuestionSchema.parse(question)).not.toThrow();
      });
    });

    it("should have questions with valid topic references", () => {
      const topicsPath = path.join(contentDir, "topics.json");
      const questionsPath = path.join(contentDir, "questions.json");

      const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

      const topicIds = topicsData.topics.map((t: { id: string }) => t.id);

      questionsData.questions.forEach((question: { topicId: string }) => {
        expect(topicIds).toContain(question.topicId);
      });
    });

    it("should have MCQ questions with correct option structure", () => {
      const filePath = path.join(contentDir, "questions.json");
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      const mcqQuestions = data.questions.filter(
        (q: { type: string }) => q.type === "mcq" || q.type === "best-answer"
      );

      mcqQuestions.forEach((question: { options?: { isCorrect: boolean }[] }) => {
        expect(question.options).toBeDefined();
        expect(Array.isArray(question.options)).toBe(true);
        expect(question.options!.length).toBeGreaterThanOrEqual(2);

        // At least one correct answer
        const correctCount = question.options!.filter((o) => o.isCorrect).length;
        expect(correctCount).toBeGreaterThanOrEqual(1);
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
