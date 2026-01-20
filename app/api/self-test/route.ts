import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { TopicSchema, QuestionSchema } from "@/lib/schemas";

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

function loadSeededQuestions(): unknown[] {
  const contentDir = path.join(process.cwd(), "content");
  const folderPath = path.join(contentDir, "questions");
  const legacyPath = path.join(contentDir, "questions.json");

  try {
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith(".json"));

      const all: unknown[] = [];
      for (const f of files) {
        const raw = JSON.parse(fs.readFileSync(path.join(folderPath, f), "utf-8"));
        if (Array.isArray(raw?.questions)) all.push(...raw.questions);
      }
      return all;
    }
  } catch {
    // fall through to legacy
  }

  try {
    const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
    return Array.isArray(legacy?.questions) ? legacy.questions : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const timestamp = new Date().toISOString();
  const tests: TestResult[] = [];

  // Test 1: Load taxonomy JSON
  try {
    const topicsPath = path.join(process.cwd(), "content", "topics.json");
    const topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
    
    if (topicsData.topics && topicsData.topics.length > 0) {
      // Validate first topic
      TopicSchema.parse(topicsData.topics[0]);
      tests.push({
        name: "Load taxonomy JSON",
        passed: true,
        message: `Loaded ${topicsData.topics.length} topics`,
      });
    } else {
      tests.push({
        name: "Load taxonomy JSON",
        passed: false,
        message: "No topics found in taxonomy",
      });
    }
  } catch (error) {
    tests.push({
      name: "Load taxonomy JSON",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 2: Load questions JSON
  try {
    const questions = loadSeededQuestions();
    
    if (questions.length > 0) {
      // Validate first question
      QuestionSchema.parse(questions[0]);
      tests.push({
        name: "Load questions JSON",
        passed: true,
        message: `Loaded ${questions.length} questions`,
      });
    } else {
      tests.push({
        name: "Load questions JSON",
        passed: false,
        message: "No questions found",
      });
    }
  } catch (error) {
    tests.push({
      name: "Load questions JSON",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 3: Generate seeded question (simulated)
  try {
    const questions = loadSeededQuestions();
    
    if (questions.length > 0) {
      const randomQuestion = questions[
        Math.floor(Math.random() * questions.length)
      ];
      
      // Basic smoke check (structure is validated separately by Zod above)
      if (
        typeof randomQuestion === "object" &&
        randomQuestion !== null &&
        typeof (randomQuestion as Record<string, unknown>).stem === "string" &&
        Array.isArray((randomQuestion as Record<string, unknown>).options)
      ) {
        tests.push({
          name: "Generate seeded question",
          passed: true,
          message: "Successfully retrieved random question from seed bank",
        });
      } else {
        tests.push({
          name: "Generate seeded question",
          passed: false,
          message: "Question structure invalid",
        });
      }
    } else {
      tests.push({
        name: "Generate seeded question",
        passed: false,
        message: "No questions available",
      });
    }
  } catch (error) {
    tests.push({
      name: "Generate seeded question",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Test 4: Check OpenAI configuration (not actual call)
  const openaiConfigured = Boolean(process.env.OPENAI_API_KEY);
  tests.push({
    name: "OpenAI configuration",
    passed: true, // Pass even if not configured (fallback exists)
    message: openaiConfigured
      ? "API key configured"
      : "Not configured (using fallback seeded content)",
  });

  // Test 5: Validate scenarios JSON
  try {
    const scenariosPath = path.join(process.cwd(), "content", "scenarios.json");
    const scenariosData = JSON.parse(fs.readFileSync(scenariosPath, "utf-8"));
    
    if (scenariosData.scenarios && scenariosData.scenarios.length > 0) {
      tests.push({
        name: "Load scenarios JSON",
        passed: true,
        message: `Loaded ${scenariosData.scenarios.length} scenarios`,
      });
    } else {
      tests.push({
        name: "Load scenarios JSON",
        passed: false,
        message: "No scenarios found",
      });
    }
  } catch (error) {
    tests.push({
      name: "Load scenarios JSON",
      passed: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }

  // Calculate overall status
  const allPassed = tests.every((t) => t.passed);

  return NextResponse.json(
    {
      status: allPassed ? "pass" : "fail",
      timestamp,
      tests,
    },
    { status: allPassed ? 200 : 500 }
  );
}
