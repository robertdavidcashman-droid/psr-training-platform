import OpenAI from "openai";
import { QuestionSchema, type Question } from "./schemas";
import { hashString } from "./utils";
import { getReferenceSuggestions, isPaceCustodyTopic } from "@/lib/references";

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

  const requiresReferences =
    isPaceCustodyTopic(topicId) ||
    /pace|custody|detention|interview|arrest/i.test(topicName);

  const buildPrompt = (strictCitations: boolean) => `Generate a ${difficulty} level ${type} question for Police Station Representative (PSR) training on the topic: "${topicName}".

Output MUST be a single JSON object matching this schema (no markdown):
{
  "stem": "string",
  "options": [
    { "id": "A", "text": "..." },
    { "id": "B", "text": "..." },
    { "id": "C", "text": "..." },
    { "id": "D", "text": "..." }
  ],
  "correct": "A" | "B" | "C" | "D",
  "explanation": "Educational explanation. Not legal advice.",
  "references": [
    {
      "instrument": "PACE" | "Code C" | "Code G" | "Code D" | "CPIA" | "Bail Act" | "LASPO" | "LAA Guidance",
      "cite": "e.g. \\"PACE 1984 s.24; Code G para x.x\\"",
      "note": "optional string"
    }
  ],
  "pitfalls": ["optional", "array"],
  "tags": ["optional", "array"]
}

Requirements:
- The question should be directly relevant to PSR accreditation practice.
- Options must be plausible and distinct.
- Explanation should teach the principle and briefly explain why other options are wrong.
- ${requiresReferences ? "This topic is procedure/powers-related. Include at least ONE reference in the array." : "Include references if applicable; otherwise return an empty array."}
- Never invent paragraph numbers if you are not sure. If unsure, set cite to start with "Check: ..." or add a note explaining uncertainty.
${strictCitations ? "- STRICT: You MUST return references.length >= 1 for this topic. If you cannot, return a 'Check:' reference rather than leaving it empty." : ""}

IMPORTANT: Training content only. Do not provide legal advice. Encourage users to check the current Act/Code.`;

  try {
    const system =
      "You generate premium PSR training questions. Output strict JSON only. Never provide legal advice. If unsure about citations, label them as 'Check:' and explain uncertainty in note.";

    const call = async (strictCitations: boolean) => {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: buildPrompt(strictCitations) },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content);

      const normalizeOptionId = (id: unknown): "A" | "B" | "C" | "D" | null => {
        const s = String(id ?? "").trim();
        if (!s) return null;
        const u = s.toUpperCase();
        if (u === "A" || u === "B" || u === "C" || u === "D") return u;
        if (u === "A)" || u === "B)" || u === "C)" || u === "D)") return u[0] as "A" | "B" | "C" | "D";
        if (u === "1") return "A";
        if (u === "2") return "B";
        if (u === "3") return "C";
        if (u === "4") return "D";
        return null;
      };

      const isRecord = (v: unknown): v is Record<string, unknown> =>
        typeof v === "object" && v !== null;

      const optionsRaw: unknown[] = Array.isArray((parsed as Record<string, unknown>)?.options)
        ? ((parsed as Record<string, unknown>).options as unknown[])
        : [];

      const options = optionsRaw
        .map((o) => {
          const rec = isRecord(o) ? o : {};
          const id = normalizeOptionId(rec.id);
          const text = typeof rec.text === "string" ? rec.text : "";
          return { id, text };
        })
        .filter((o): o is { id: "A" | "B" | "C" | "D"; text: string } => Boolean(o.id && o.text));

      const correct = normalizeOptionId((parsed as Record<string, unknown>)?.correct);

      const instruments = new Set([
        "PACE",
        "Code C",
        "Code G",
        "Code D",
        "CPIA",
        "Bail Act",
        "LASPO",
        "LAA Guidance",
      ]);

      const referencesRaw: unknown[] = Array.isArray((parsed as Record<string, unknown>)?.references)
        ? ((parsed as Record<string, unknown>).references as unknown[])
        : [];

      type Ref = Question["references"][number];

      const references = referencesRaw
        .map((r): Ref | null => {
          const rec = isRecord(r) ? r : {};
          const instrument = typeof rec.instrument === "string" && instruments.has(rec.instrument)
            ? (rec.instrument as Question["references"][number]["instrument"])
            : null;
          const cite = typeof rec.cite === "string" ? rec.cite : "";
          const note = typeof rec.note === "string" ? rec.note : undefined;
          if (!instrument || !cite) return null;
          return { instrument, cite, note: note ?? undefined };
        })
        .filter((r): r is Ref => r !== null);

      const pitfallsRaw: unknown[] = Array.isArray((parsed as Record<string, unknown>)?.pitfalls)
        ? ((parsed as Record<string, unknown>).pitfalls as unknown[])
        : [];
      const pitfalls = pitfallsRaw.filter((p): p is string => typeof p === "string" && p.trim().length > 0);

      const tagsRaw: unknown[] = Array.isArray((parsed as Record<string, unknown>)?.tags)
        ? ((parsed as Record<string, unknown>).tags as unknown[])
        : [];
      const tags = tagsRaw.filter((t): t is string => typeof t === "string" && t.trim().length > 0);

      const candidate: Question = {
        id: `ai-${hashString(content)}`,
        topicId,
        difficulty,
        type,
        stem: typeof (parsed as Record<string, unknown>)?.stem === "string" ? ((parsed as Record<string, unknown>).stem as string) : "",
        options: options.length ? options : undefined,
        correct: correct ?? undefined,
        explanation: typeof (parsed as Record<string, unknown>)?.explanation === "string" ? ((parsed as Record<string, unknown>).explanation as string) : "",
        references,
        pitfalls: pitfalls.length ? pitfalls : undefined,
        tags: tags.length ? tags : undefined,
      };

      const validated = QuestionSchema.safeParse(candidate);
      if (!validated.success) return null;

      let data = validated.data;

      // Citation guard: if procedure topic, enforce at least one reference.
      // If the model omitted references, use curated topic references as an explicit fallback.
      if (requiresReferences && data.references.length === 0) {
        const fallback = getReferenceSuggestions(topicId);
        if (fallback.length > 0) {
          data = {
            ...data,
            references: fallback.map((r) => ({
              ...r,
              note: r.note ?? "Curated fallback reference (verify against current Code/Act).",
            })),
          };
        }
      }

      if (requiresReferences && data.references.length === 0) return null;

      return data;
    };

    // Attempt 1: normal prompt; if citations missing, retry once more strict.
    const first = await call(false);
    if (first) return first;

    const second = await call(true);
    if (second) return second;

    // Final fallback: return null so API can fall back to seeded. (Avoid silent hallucination.)
    return null;
  } catch (error) {
    console.error("OpenAI generation error:", error);
    return null;
  }
}
