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
export const QuestionDifficultySchema = z.enum([
  "foundation",
  "intermediate",
  "advanced",
]);

export const QuestionTypeSchema = z.enum([
  "mcq",
  "best-answer",
  "scenario",
  "short-structured",
]);

export const QuestionOptionIdSchema = z.enum(["A", "B", "C", "D"]);

export const QuestionOptionSchema = z.object({
  id: QuestionOptionIdSchema,
  text: z.string().min(1),
});

export const ReferenceInstrumentSchema = z.enum([
  "PACE",
  "Code C",
  "Code G",
  "Code D",
  "CPIA",
  "Bail Act",
  "LASPO",
  "LAA Guidance",
]);

export const QuestionReferenceSchema = z.object({
  instrument: ReferenceInstrumentSchema,
  cite: z.string().min(1),
  note: z.string().optional(),
});

export const QuestionSchema = z
  .object({
    id: z.string(),
    topicId: z.string(),
    difficulty: QuestionDifficultySchema,
    type: QuestionTypeSchema,
    stem: z.string().min(1),
    options: z.array(QuestionOptionSchema).optional(),
    correct: QuestionOptionIdSchema.optional(),
    expectedAnswerOutline: z.array(z.string().min(1)).optional(),
    explanation: z.string().min(1),
    references: z.array(QuestionReferenceSchema).default([]),
    pitfalls: z.array(z.string().min(1)).optional(),
    tags: z.array(z.string().min(1)).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type === "mcq" || q.type === "best-answer") {
      if (!q.options || q.options.length !== 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "MCQ questions must have exactly 4 options",
          path: ["options"],
        });
      }
      if (!q.correct) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "MCQ questions must specify a correct option id",
          path: ["correct"],
        });
      }
    }
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
  difficulty: QuestionDifficultySchema.optional(),
  type: z
    .enum(["mcq", "best-answer", "scenario", "short-structured", "short-response"])
    .optional()
    .transform((t) => (t === "short-response" ? "short-structured" : t)),
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
