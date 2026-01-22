import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { generateQuestionsForCriterion, type Criterion } from "@/lib/questionGenerator";
import type { Question } from "@/lib/schemas";

const projectRoot = process.cwd();
const questionsDir = join(projectRoot, "content", "questions");
const MIN_QUESTIONS_PER_CRITERION = 30;

async function checkAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  return !error && !!data;
}

function loadStandards(): Criterion[] {
  const standardsPath = join(projectRoot, "content", "psras", "standards.json");
  const data = JSON.parse(readFileSync(standardsPath, "utf-8"));
  const criteria: Criterion[] = [];

  for (const part of data.parts ?? []) {
    for (const unit of part.units ?? []) {
      for (const outcome of unit.outcomes ?? []) {
        for (const criterion of outcome.criteria ?? []) {
          criteria.push({
            id: criterion.id,
            label: criterion.label,
            summary: criterion.summary ?? "",
            tags: criterion.tags ?? [],
            expectedAuthorities: criterion.expectedAuthorities ?? [],
          });
        }
      }
    }
  }

  return criteria;
}

function loadAllQuestions(): { questions: Question[]; existingIds: Set<string> } {
  const allQuestions: Question[] = [];
  const existingIds = new Set<string>();

  const files = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const filePath = join(questionsDir, file);
    const data = JSON.parse(readFileSync(filePath, "utf-8"));
    if (Array.isArray(data?.questions)) {
      for (const q of data.questions) {
        allQuestions.push(q);
        existingIds.add(q.id);
      }
    }
  }

  return { questions: allQuestions, existingIds };
}

function getQuestionsForCriterion(
  criterion: Criterion,
  allQuestions: Question[]
): Question[] {
  const matchingQuestions = new Map<string, Question>();

  for (const q of allQuestions) {
    const questionTags = q.tags ?? [];
    const criterionTags = criterion.tags ?? [];

    const matches = criterionTags.some((tag) => questionTags.includes(tag));
    if (matches) {
      matchingQuestions.set(q.id, q);
    }
  }

  return Array.from(matchingQuestions.values());
}

function findQuestionFile(criterion: Criterion): string {
  const primaryTag = criterion.tags?.[0];
  if (primaryTag) {
    const tagToFile: Record<string, string> = {
      "authority-to-act": "authority-to-act.json",
      "dscc": "authority-to-act.json",
      "probationary": "probationary-extended.json",
      "legal-advice": "delay-legal-advice.json",
      "s58": "delay-legal-advice.json",
      "telephone-advice": "telephone-advice.json",
      "detention": "pace.json",
      "time-limits": "pace-extended.json",
      "reviews": "pace-extended.json",
      "vulnerability": "vulnerability.json",
      "appropriate-adult": "vulnerability-extended.json",
      "disclosure": "disclosure.json",
      "interview": "interview.json",
      "intervention": "interview-extended.json",
      "bail": "bail.json",
      "charging": "charging.json",
      "identification": "identification.json",
      "recording": "interview-recording.json",
      "arrest": "voluntary-attendance.json",
      "nfa": "nfa-cautions.json",
      "register": "register-entry.json",
      "cit": "cit-scenarios.json",
      "ethics": "client-care.json",
      "portfolio": "portfolio.json",
    };

    const fileName = tagToFile[primaryTag];
    if (fileName) {
      const filePath = join(questionsDir, fileName);
      if (statSync(filePath).isFile()) {
        return filePath;
      }
    }
  }

  return join(questionsDir, "variety-samples.json");
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await checkAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { criterionId, confirmPhrase } = body;

    // For full regenerate, require confirmation phrase
    if (!criterionId && confirmPhrase !== "REBUILD_ALL") {
      return NextResponse.json(
        { error: "Full regenerate requires confirmPhrase: 'REBUILD_ALL'" },
        { status: 400 }
      );
    }

    const criteria = loadStandards();
    const { questions: allQuestions } = loadAllQuestions();

    let regenerated = 0;
    const results: Array<{
      criterionId: string;
      label: string;
      generated: number;
    }> = [];

    const criteriaToProcess = criterionId
      ? criteria.filter((c) => c.id === criterionId)
      : criteria;

    for (const criterion of criteriaToProcess) {
      // Generate exactly 30 questions
      const generated = generateQuestionsForCriterion(criterion, new Set());

      // Remove existing questions for this criterion (if regenerating)
      const existingQuestions = getQuestionsForCriterion(criterion, allQuestions);
      const existingIdsToRemove = new Set(existingQuestions.map((q) => q.id));

      // Find the file
      const filePath = findQuestionFile(criterion);
      const fileData = JSON.parse(readFileSync(filePath, "utf-8"));
      const fileQuestions = Array.isArray(fileData?.questions)
        ? fileData.questions
        : [];

      // Remove old questions for this criterion
      const filteredQuestions = fileQuestions.filter(
        (q: Question) => !existingIdsToRemove.has(q.id)
      );

      // Add new questions
      filteredQuestions.push(...generated.slice(0, MIN_QUESTIONS_PER_CRITERION));

      // Save file
      writeFileSync(
        filePath,
        JSON.stringify({ questions: filteredQuestions }, null, 2) + "\n",
        "utf-8"
      );

      regenerated += generated.length;
      results.push({
        criterionId: criterion.id,
        label: criterion.label,
        generated: generated.length,
      });
    }

    return NextResponse.json({
      success: true,
      regenerated,
      results,
      message: criterionId
        ? `Regenerated questions for criterion ${criterionId}`
        : "Regenerated all criteria",
    });
  } catch (error) {
    console.error("Coverage regenerate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
