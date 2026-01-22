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
    const { criterionId } = body;

    const criteria = loadStandards();
    const { questions: allQuestions, existingIds } = loadAllQuestions();

    let totalGenerated = 0;
    const results: Array<{
      criterionId: string;
      label: string;
      existing: number;
      generated: number;
      total: number;
    }> = [];

    const criteriaToProcess = criterionId
      ? criteria.filter((c) => c.id === criterionId)
      : criteria.filter((c) => {
          const existing = getQuestionsForCriterion(c, allQuestions);
          return existing.length < MIN_QUESTIONS_PER_CRITERION;
        });

    for (const criterion of criteriaToProcess) {
      const existingQuestions = getQuestionsForCriterion(criterion, allQuestions);
      const existingCount = existingQuestions.length;
      const needed = Math.max(0, MIN_QUESTIONS_PER_CRITERION - existingCount);

      if (needed > 0) {
        // Generate questions
        const generated = generateQuestionsForCriterion(criterion, existingIds);

        // Take only what's needed
        const questionsToAdd = generated.slice(0, needed);

        // Add to existing IDs
        for (const q of questionsToAdd) {
          existingIds.add(q.id);
        }

        // Find file
        const filePath = findQuestionFile(criterion);
        const fileData = JSON.parse(readFileSync(filePath, "utf-8"));
        const fileQuestions = Array.isArray(fileData?.questions)
          ? fileData.questions
          : [];

        // Add questions
        fileQuestions.push(...questionsToAdd);

        // Save file
        writeFileSync(
          filePath,
          JSON.stringify({ questions: fileQuestions }, null, 2) + "\n",
          "utf-8"
        );

        totalGenerated += questionsToAdd.length;
        results.push({
          criterionId: criterion.id,
          label: criterion.label,
          existing: existingCount,
          generated: questionsToAdd.length,
          total: existingCount + questionsToAdd.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalGenerated,
      results,
      message: criterionId
        ? `Topped up questions for criterion ${criterionId}`
        : `Topped up ${results.length} criteria`,
    });
  } catch (error) {
    console.error("Coverage topup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
