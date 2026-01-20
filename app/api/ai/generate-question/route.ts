import { NextRequest, NextResponse } from "next/server";
import { GenerateQuestionRequestSchema, type Question } from "@/lib/schemas";
import {
  isOpenAIConfigured,
  checkRateLimit,
  recordRequest,
  getCachedQuestion,
  setCachedQuestion,
  generateQuestionWithAI,
} from "@/lib/openai";
import { hashString } from "@/lib/utils";
import fs from "fs";
import path from "path";

// Load seeded questions for fallback
function getSeededQuestions(): Question[] {
  try {
    const contentDir = path.join(process.cwd(), "content");
    const folderPath = path.join(contentDir, "questions");

    // Preferred: /content/questions/*.json
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath).filter((f) => f.endsWith(".json"));
      const all: Question[] = [];
      for (const f of files) {
        const data = JSON.parse(fs.readFileSync(path.join(folderPath, f), "utf-8"));
        if (Array.isArray(data?.questions)) all.push(...data.questions);
      }
      return all;
    }

    // Legacy fallback: /content/questions.json
    const questionsPath = path.join(contentDir, "questions.json");
    const data = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));
    return data.questions || [];
  } catch {
    return [];
  }
}

// Get topic name from topics.json
function getTopicName(topicId: string): string {
  try {
    const topicsPath = path.join(process.cwd(), "content", "topics.json");
    const data = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
    const topic = data.topics?.find((t: { id: string }) => t.id === topicId);
    return topic?.name || topicId;
  } catch {
    return topicId;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parsed = GenerateQuestionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { topicId, difficulty = "intermediate", type = "mcq" } = parsed.data;

    // Check rate limit
    const clientIp = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Generate cache key
    const cacheKey = hashString(`${topicId}-${difficulty}-${type}`);

    // Check cache first
    const cached = getCachedQuestion(cacheKey);
    if (cached) {
      return NextResponse.json({
        question: cached,
        source: "cache",
      });
    }

    // Try OpenAI if configured (only for MCQ/best-answer types)
    if (isOpenAIConfigured() && (type === "mcq" || type === "best-answer")) {
      recordRequest(clientIp);
      const topicName = getTopicName(topicId);
      const aiQuestion = await generateQuestionWithAI(topicId, topicName, difficulty, type);

      if (aiQuestion) {
        setCachedQuestion(cacheKey, aiQuestion);
        return NextResponse.json({
          question: aiQuestion,
          source: "ai",
        });
      }
    }

    // Fallback to seeded questions
    const seededQuestions = getSeededQuestions();
    let filteredQuestions = seededQuestions.filter((q) => q.topicId === topicId);

    // If no questions for specific topic, use any questions
    if (filteredQuestions.length === 0) {
      filteredQuestions = seededQuestions;
    }

    // Filter by difficulty if possible
    const difficultyFiltered = filteredQuestions.filter(
      (q) => q.difficulty === difficulty
    );
    if (difficultyFiltered.length > 0) {
      filteredQuestions = difficultyFiltered;
    }

    if (filteredQuestions.length === 0) {
      return NextResponse.json(
        { error: "No questions available for this topic" },
        { status: 404 }
      );
    }

    // Return random seeded question
    const randomQuestion =
      filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    return NextResponse.json({
      question: randomQuestion,
      source: "seeded",
    });
  } catch (error) {
    console.error("Generate question error:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
