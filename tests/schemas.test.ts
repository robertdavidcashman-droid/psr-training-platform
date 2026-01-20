import { describe, it, expect } from "vitest";
import {
  TopicSchema,
  QuestionSchema,
  GenerateQuestionRequestSchema,
  HealthResponseSchema,
} from "@/lib/schemas";

describe("Schema Validation", () => {
  describe("TopicSchema", () => {
    it("should validate a valid topic", () => {
      const topic = {
        id: "test-topic",
        name: "Test Topic",
        description: "A test topic description",
        category: "test-category",
      };
      expect(() => TopicSchema.parse(topic)).not.toThrow();
    });

    it("should validate topic with optional fields", () => {
      const topic = {
        id: "test-topic",
        name: "Test Topic",
        description: "A test topic description",
        category: "test-category",
        subtopics: ["Subtopic 1", "Subtopic 2"],
        officialResources: [
          { title: "Resource", url: "https://example.com" },
        ],
      };
      expect(() => TopicSchema.parse(topic)).not.toThrow();
    });

    it("should reject invalid topic", () => {
      const topic = {
        id: "test-topic",
        // missing name
        description: "A test topic description",
      };
      expect(() => TopicSchema.parse(topic)).toThrow();
    });
  });

  describe("QuestionSchema", () => {
    it("should validate a valid MCQ question", () => {
      const question = {
        id: "q001",
        topicId: "test-topic",
        type: "mcq",
        difficulty: "intermediate",
        question: "What is the answer?",
        options: [
          { id: "a", text: "Option A", isCorrect: false },
          { id: "b", text: "Option B", isCorrect: true },
          { id: "c", text: "Option C", isCorrect: false },
          { id: "d", text: "Option D", isCorrect: false },
        ],
        explanation: "Option B is correct because...",
        whyItMatters: "This is important because...",
      };
      expect(() => QuestionSchema.parse(question)).not.toThrow();
    });

    it("should reject question with invalid type", () => {
      const question = {
        id: "q001",
        topicId: "test-topic",
        type: "invalid-type",
        difficulty: "intermediate",
        question: "What is the answer?",
        explanation: "Explanation",
        whyItMatters: "Important",
      };
      expect(() => QuestionSchema.parse(question)).toThrow();
    });

    it("should reject question with invalid difficulty", () => {
      const question = {
        id: "q001",
        topicId: "test-topic",
        type: "mcq",
        difficulty: "super-hard",
        question: "What is the answer?",
        explanation: "Explanation",
        whyItMatters: "Important",
      };
      expect(() => QuestionSchema.parse(question)).toThrow();
    });
  });

  describe("GenerateQuestionRequestSchema", () => {
    it("should validate a minimal request", () => {
      const request = { topicId: "test-topic" };
      expect(() => GenerateQuestionRequestSchema.parse(request)).not.toThrow();
    });

    it("should validate a full request", () => {
      const request = {
        topicId: "test-topic",
        difficulty: "advanced",
        type: "best-answer",
      };
      expect(() => GenerateQuestionRequestSchema.parse(request)).not.toThrow();
    });

    it("should reject request without topicId", () => {
      const request = { difficulty: "intermediate" };
      expect(() => GenerateQuestionRequestSchema.parse(request)).toThrow();
    });
  });

  describe("HealthResponseSchema", () => {
    it("should validate a valid health response", () => {
      const response = {
        status: "ok",
        timestamp: new Date().toISOString(),
        version: "2.0.0",
        checks: {
          envLoaded: true,
          openaiConfigured: false,
          contentLoaded: true,
        },
      };
      expect(() => HealthResponseSchema.parse(response)).not.toThrow();
    });
  });
});
