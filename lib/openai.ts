import OpenAI from "openai";
import { QuestionSchema, type Question } from "./schemas";
import { hashString } from "./utils";

// Simple in-memory rate limiter
const rateLimiter = {
  requests: new Map<string, number[]>(),
  limit: 10, // requests per minute
  window: 60000, // 1 minute in ms

  check(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const recentRequests = requests.filter((t) => now - t < this.window);
    this.requests.set(key, recentRequests);
    return recentRequests.length < this.limit;
  },

  record(key: string): void {
    const requests = this.requests.get(key) || [];
    requests.push(Date.now());
    this.requests.set(key, requests);
  },
};

// Simple in-memory cache
const cache = new Map<string, { data: Question; expires: number }>();
const CACHE_TTL = 3600000; // 1 hour

export function getCachedQuestion(key: string): Question | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

export function setCachedQuestion(key: string, question: Question): void {
  cache.set(key, { data: question, expires: Date.now() + CACHE_TTL });
}

// OpenAI client (lazy initialization)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function checkRateLimit(identifier: string): boolean {
  return rateLimiter.check(identifier);
}

export function recordRequest(identifier: string): void {
  rateLimiter.record(identifier);
}

// Generate question using OpenAI
export async function generateQuestionWithAI(
  topicId: string,
  topicName: string,
  difficulty: "foundation" | "intermediate" | "advanced" = "intermediate",
  type: "mcq" | "best-answer" = "mcq"
): Promise<Question | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  const prompt = `Generate a ${difficulty} level ${type} question for Police Station Representative (PSR) training on the topic: "${topicName}".

Requirements:
1. The question should test understanding relevant to PSR accreditation
2. Provide 4 answer options (a, b, c, d)
3. One option must be correct
4. Provide an educational explanation (NOT legal advice)
5. Explain why understanding this matters for PSR practice

Format your response as JSON:
{
  "question": "The question text",
  "options": [
    {"id": "a", "text": "Option A text", "isCorrect": false},
    {"id": "b", "text": "Option B text", "isCorrect": true},
    {"id": "c", "text": "Option C text", "isCorrect": false},
    {"id": "d", "text": "Option D text", "isCorrect": false}
  ],
  "explanation": "Educational explanation of the correct answer and why other options are incorrect",
  "whyItMatters": "Why understanding this is important for PSR practice"
}

IMPORTANT: This is for training purposes only. Do not provide legal advice. Focus on general principles and educational content.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an educational content generator for Police Station Representative training. Generate training questions that test understanding of procedures, professional conduct, and legal principles. Never provide specific legal advice. Always emphasize that trainees should refer to current legislation and guidance.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);

    // Validate with Zod
    const question: Question = {
      id: `ai-${hashString(content)}`,
      topicId,
      type,
      difficulty,
      question: parsed.question,
      options: parsed.options,
      explanation: parsed.explanation,
      whyItMatters: parsed.whyItMatters,
      disclaimer:
        "This question is AI-generated for training purposes and does not constitute legal advice.",
    };

    // Validate structure
    QuestionSchema.parse(question);

    return question;
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return null;
  }
}
