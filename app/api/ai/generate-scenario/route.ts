import { NextRequest, NextResponse } from "next/server";
import { GenerateScenarioRequestSchema, type Scenario } from "@/lib/schemas";
import { checkRateLimit, recordRequest, isOpenAIConfigured } from "@/lib/openai";
import fs from "fs";
import path from "path";

// Load seeded scenarios for fallback
function getSeededScenarios(): Scenario[] {
  try {
    const scenariosPath = path.join(process.cwd(), "content", "scenarios.json");
    const data = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));
    return data.scenarios || [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const parsed = GenerateScenarioRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { topicId } = parsed.data;

    // Check rate limit
    const clientIp = request.headers.get("x-forwarded-for") || "anonymous";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    recordRequest(clientIp);

    // For scenarios, we primarily use seeded content as AI generation
    // of complex branching scenarios requires more elaborate prompting
    // and validation than is practical for real-time generation.

    const seededScenarios = getSeededScenarios();
    let filteredScenarios = seededScenarios.filter((s) => s.topicId === topicId);

    // If no scenarios for specific topic, use any scenario
    if (filteredScenarios.length === 0) {
      filteredScenarios = seededScenarios;
    }

    if (filteredScenarios.length === 0) {
      return NextResponse.json(
        { error: "No scenarios available for this topic" },
        { status: 404 }
      );
    }

    // Return random seeded scenario
    const randomScenario =
      filteredScenarios[Math.floor(Math.random() * filteredScenarios.length)];

    return NextResponse.json({
      scenario: randomScenario,
      source: "seeded",
      note: isOpenAIConfigured()
        ? "AI scenario generation available for future enhancement"
        : "Using seeded scenarios (OpenAI not configured)",
    });
  } catch (error) {
    console.error("Generate scenario error:", error);
    return NextResponse.json(
      { error: "Failed to generate scenario" },
      { status: 500 }
    );
  }
}
