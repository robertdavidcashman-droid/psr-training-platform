import { z } from "zod";

// Topic schema
export const TopicSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  subtopics: z.array(z.string()).optional(),
  officialResources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
  })).optional(),
});

export type Topic = z.infer<typeof TopicSchema>;

// Question schemas
export const QuestionOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  isCorrect: z.boolean(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  type: z.enum(["mcq", "best-answer", "scenario", "short-response"]),
  difficulty: z.enum(["foundation", "intermediate", "advanced"]),
  question: z.string(),
  options: z.array(QuestionOptionSchema).optional(),
  correctAnswer: z.string().optional(),
  explanation: z.string(),
  whyItMatters: z.string(),
  disclaimer: z.string().optional(),
});

export type Question = z.infer<typeof QuestionSchema>;

// Scenario schemas
export const ScenarioStepSchema = z.object({
  id: z.string(),
  content: z.string(),
  choices: z.array(z.object({
    id: z.string(),
    text: z.string(),
    feedback: z.string(),
    isOptimal: z.boolean(),
    nextStepId: z.string().optional(),
  })),
});

export const ScenarioSchema = z.object({
  id: z.string(),
  topicId: z.string(),
  title: z.string(),
  briefing: z.string(),
  steps: z.array(ScenarioStepSchema),
  debrief: z.string(),
});

export type Scenario = z.infer<typeof ScenarioSchema>;

// API request/response schemas
export const GenerateQuestionRequestSchema = z.object({
  topicId: z.string(),
  difficulty: z.enum(["foundation", "intermediate", "advanced"]).optional(),
  type: z.enum(["mcq", "best-answer", "scenario", "short-response"]).optional(),
});

export const GenerateScenarioRequestSchema = z.object({
  topicId: z.string(),
});

// Health check response
export const HealthResponseSchema = z.object({
  status: z.enum(["ok", "error"]),
  timestamp: z.string(),
  version: z.string(),
  checks: z.object({
    envLoaded: z.boolean(),
    openaiConfigured: z.boolean(),
    contentLoaded: z.boolean(),
  }),
});

// Self-test response
export const SelfTestResponseSchema = z.object({
  status: z.enum(["pass", "fail"]),
  timestamp: z.string(),
  tests: z.array(z.object({
    name: z.string(),
    passed: z.boolean(),
    message: z.string().optional(),
  })),
});
