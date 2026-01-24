#!/usr/bin/env tsx

/**
 * Question Syllabus Alignment Audit
 *
 * Validates that all questions align to PSRAS syllabus standards:
 * - topicId exists in content/topics.json
 * - question has at least one syllabus tag (from standards.json criteria tags)
 * - citations exist and are well-formed
 * - flags placeholder citations ("Check: ...") and low-signal boilerplate stems/options
 *
 * Exit code:
 * - 0 if no errors (and, if --strict, no warnings)
 * - 1 otherwise
 *
 * Usage:
 * - npm run audit:questions
 * - npm run audit:questions -- --strict
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

type Severity = "error" | "warn";

interface AuditIssue {
  severity: Severity;
  code: string;
  file: string;
  questionId?: string;
  message: string;
  details?: Record<string, unknown>;
}

interface Criterion {
  id: string;
  label: string;
  tags?: string[];
  expectedAuthorities?: Array<{ instrument: string; cite: string; url?: string }>;
}

interface QuestionRef {
  instrument: string;
  cite: string;
  note?: string;
}

interface Question {
  id: string;
  topicId: string;
  difficulty: "foundation" | "intermediate" | "advanced";
  type: "mcq" | "best-answer" | "mcq_multi" | "short_answer";
  stem: string;
  explanation: string;
  tags?: string[];
  options?: Array<{ id: string; text: string }>;
  correct?: string;
  correctAnswers?: string[];
  expectedAnswerOutline?: string[];
  references?: QuestionRef[];
}

interface QuestionFile {
  fileName: string;
  path: string;
  questions: Question[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const QUESTIONS_DIR = join(projectRoot, "content", "questions");
const STANDARDS_PATH = join(projectRoot, "content", "psras", "standards.json");
const TOPICS_PATH = join(projectRoot, "content", "topics.json");

function getArgs() {
  const args = process.argv.slice(2);
  return {
    strict: args.includes("--strict"),
  };
}

function loadStandards(): Criterion[] {
  const data = JSON.parse(readFileSync(STANDARDS_PATH, "utf-8"));
  const criteria: Criterion[] = [];

  for (const part of data.parts ?? []) {
    for (const unit of part.units ?? []) {
      for (const outcome of unit.outcomes ?? []) {
        for (const criterion of outcome.criteria ?? []) {
          criteria.push({
            id: criterion.id,
            label: criterion.label,
            tags: criterion.tags ?? [],
            expectedAuthorities: criterion.expectedAuthorities ?? [],
          });
        }
      }
    }
  }

  return criteria;
}

function loadTopics(): Set<string> {
  const data = JSON.parse(readFileSync(TOPICS_PATH, "utf-8"));
  const ids = new Set<string>();
  for (const t of data.topics ?? []) {
    if (t?.id) ids.add(String(t.id));
  }
  return ids;
}

function loadQuestionFiles(): QuestionFile[] {
  if (!statSync(QUESTIONS_DIR).isDirectory()) {
    throw new Error(`Questions directory not found: ${QUESTIONS_DIR}`);
  }

  const files = readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((fileName) => {
    const p = join(QUESTIONS_DIR, fileName);
    const data = JSON.parse(readFileSync(p, "utf-8"));
    const questions: Question[] = Array.isArray(data?.questions) ? data.questions : [];
    return { fileName, path: p, questions };
  });
}

function isGeneratedQuestionId(id: unknown): boolean {
  return typeof id === "string" && id.startsWith("gen-");
}

function isPlaceholderCitation(cite: string): boolean {
  const c = cite.toLowerCase();
  return c.includes("check:") || c.includes("(check:");
}

function isBoilerplateDistractor(text: string): boolean {
  const t = text.toLowerCase().trim();
  return (
    t === "this is not required by the relevant legislation" ||
    t === "this would be incorrect under the applicable rules" ||
    t === "this does not reflect the proper procedure"
  );
}

function looksBoilerplate(q: Question): boolean {
  const stem = (q.stem ?? "").toLowerCase();
  const options = q.options ?? [];
  const hasBoilerplateOptions = options.some((o) => isBoilerplateDistractor(String(o?.text ?? "")));

  const boilerplateStemPatterns = [
    /^according to [^,]+, what is required regarding /,
    /^what does [^ ]+ require regarding /,
    /^under [^,]+, which of the following is correct\?/,
    /^in relation to .* what is the best approach under /,
    /^when dealing with .* which action is most appropriate given /,
    /^scenario: a situation involving .* according to /,
  ];

  const hasBoilerplateStem = boilerplateStemPatterns.some((re) => re.test(stem));
  return hasBoilerplateOptions || hasBoilerplateStem || isGeneratedQuestionId(q.id);
}

function getMatchingCriteriaByTags(questionTags: string[], criteria: Criterion[]): Criterion[] {
  if (!questionTags.length) return [];
  const matches: Criterion[] = [];
  for (const c of criteria) {
    const cTags = c.tags ?? [];
    if (cTags.some((t) => questionTags.includes(t))) {
      matches.push(c);
    }
  }
  return matches;
}

function main() {
  const { strict } = getArgs();

  const criteria = loadStandards();
  const topicIds = loadTopics();
  const files = loadQuestionFiles();

  const allowedTags = new Set<string>();
  for (const c of criteria) {
    for (const t of c.tags ?? []) allowedTags.add(t);
  }

  const issues: AuditIssue[] = [];

  // Duplicate ID check across whole bank
  const seenIds = new Map<string, string>(); // id -> fileName

  for (const f of files) {
    for (const qRaw of f.questions as any[]) {
      const q = qRaw as Question;
      const qid = (q as any)?.id;

      if (typeof qid === "string") {
        const prev = seenIds.get(qid);
        if (prev && prev !== f.fileName) {
          issues.push({
            severity: "error",
            code: "duplicate_id",
            file: f.fileName,
            questionId: qid,
            message: `Duplicate question id also found in ${prev}`,
          });
        } else {
          seenIds.set(qid, f.fileName);
        }
      }
    }
  }

  for (const f of files) {
    for (const qRaw of f.questions as any[]) {
      const q = qRaw as Question;
      const questionId = (q as any)?.id;

      const push = (issue: Omit<AuditIssue, "file" | "questionId">) => {
        issues.push({ file: f.fileName, questionId: typeof questionId === "string" ? questionId : undefined, ...issue });
      };

      // Required fields
      if (typeof q.id !== "string" || q.id.trim() === "") {
        push({ severity: "error", code: "missing_id", message: "Question is missing a valid id" });
        continue;
      }
      if (typeof q.topicId !== "string" || q.topicId.trim() === "") {
        push({ severity: "error", code: "missing_topicId", message: "Question is missing a valid topicId" });
      } else if (!topicIds.has(q.topicId)) {
        push({
          severity: "error",
          code: "unknown_topicId",
          message: `topicId "${q.topicId}" is not defined in content/topics.json`,
        });
      }
      if (!["foundation", "intermediate", "advanced"].includes(q.difficulty)) {
        push({ severity: "error", code: "invalid_difficulty", message: `Invalid difficulty "${(q as any).difficulty}"` });
      }
      if (!["mcq", "best-answer", "mcq_multi", "short_answer"].includes(q.type)) {
        push({ severity: "error", code: "invalid_type", message: `Invalid type "${(q as any).type}"` });
      }
      if (typeof q.stem !== "string" || q.stem.trim() === "") {
        push({ severity: "error", code: "missing_stem", message: "Question is missing a stem" });
      }
      if (typeof q.explanation !== "string" || q.explanation.trim() === "") {
        push({ severity: "error", code: "missing_explanation", message: "Question is missing an explanation" });
      }

      // Tag alignment
      const tags = (q.tags ?? []).map(String);
      if (!tags.length) {
        push({ severity: "error", code: "missing_tags", message: "Question has no tags (cannot align to syllabus criteria)" });
      } else {
        const hasSyllabusTag = tags.some((t) => allowedTags.has(t));
        if (!hasSyllabusTag) {
          push({
            severity: "error",
            code: "no_syllabus_tag",
            message: "Question tags do not include any syllabus criteria tag from standards.json",
            details: { tags },
          });
        }

        const unknownTags = tags.filter((t) => !allowedTags.has(t));
        if (unknownTags.length) {
          push({
            severity: strict ? "error" : "warn",
            code: "unknown_tags",
            message: `Question contains tags not present in standards.json (allowed as metadata, but may reduce alignment): ${unknownTags.join(", ")}`,
            details: { unknownTags },
          });
        }
      }

      // Type-specific shape
      if (q.type === "mcq" || q.type === "best-answer") {
        const options = q.options ?? [];
        if (!Array.isArray(options) || options.length < 2) {
          push({ severity: "error", code: "missing_options", message: "MCQ question must have options[]" });
        }
        if (typeof q.correct !== "string" || q.correct.trim() === "") {
          push({ severity: "error", code: "missing_correct", message: "MCQ question must have correct answer id" });
        }
      }

      if (q.type === "mcq_multi") {
        const options = q.options ?? [];
        if (!Array.isArray(options) || options.length < 2) {
          push({ severity: "error", code: "missing_options", message: "mcq_multi question must have options[]" });
        }
        if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
          push({ severity: "error", code: "missing_correctAnswers", message: "mcq_multi must have correctAnswers[]" });
        }
      }

      if (q.type === "short_answer") {
        if (!Array.isArray(q.expectedAnswerOutline) || q.expectedAnswerOutline.length === 0) {
          push({
            severity: "warn",
            code: "missing_expectedAnswerOutline",
            message: "short_answer should include expectedAnswerOutline[] for consistent marking guidance",
          });
        }
      }

      // Citation checks
      const refs = q.references ?? [];
      if (!Array.isArray(refs) || refs.length < 2) {
        push({
          severity: "error",
          code: "insufficient_citations",
          message: `Question has ${(refs?.length ?? 0)} citation(s); expected >= 2`,
        });
      } else {
        for (const r of refs) {
          if (!r?.instrument || !r?.cite) {
            push({
              severity: "error",
              code: "malformed_citation",
              message: "Citation missing instrument or cite",
              details: { citation: r },
            });
          } else if (isPlaceholderCitation(r.cite)) {
            push({
              severity: strict ? "error" : "warn",
              code: "placeholder_citation",
              message: `Citation looks like a placeholder ("${r.cite}")`,
              details: { instrument: r.instrument, cite: r.cite },
            });
          }
        }
      }

      // Expected authority match (best-effort)
      const matchingCriteria = getMatchingCriteriaByTags(tags, criteria);
      const expectedInstruments = new Set<string>();
      for (const c of matchingCriteria) {
        for (const a of c.expectedAuthorities ?? []) {
          if (a?.instrument) expectedInstruments.add(String(a.instrument));
        }
      }
      if (expectedInstruments.size > 0) {
        const questionInstruments = new Set((refs ?? []).map((r) => String(r.instrument)));
        const matches = [...questionInstruments].filter((i) => expectedInstruments.has(i)).length;
        if (matches === 0) {
          push({
            severity: strict ? "error" : "warn",
            code: "authority_mismatch",
            message: `Citations do not include any expected authority instruments for matched syllabus criteria`,
            details: {
              expectedInstruments: [...expectedInstruments].sort(),
              questionInstruments: [...questionInstruments].sort(),
              matchedCriteria: matchingCriteria.map((c) => c.id),
            },
          });
        }
      }

      // Boilerplate quality checks
      const boilerplate = looksBoilerplate(q);
      if (boilerplate && !isGeneratedQuestionId(q.id)) {
        push({
          severity: strict ? "error" : "warn",
          code: "boilerplate_content",
          message: "Question looks like autogenerated boilerplate (low-signal stem/options) but is not marked as generated",
        });
      }
    }
  }

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warn").length;

  const summary = {
    generatedAt: new Date().toISOString(),
    strict,
    totals: {
      files: files.length,
      questions: files.reduce((sum, f) => sum + f.questions.length, 0),
      uniqueIds: seenIds.size,
      errors: errorCount,
      warnings: warnCount,
    },
    issues,
  };

  const outJson = join(projectRoot, "question-audit-results.json");
  writeFileSync(outJson, JSON.stringify(summary, null, 2) + "\n", "utf-8");

  console.log("\n=== Question Syllabus Alignment Audit ===\n");
  console.log(`Files: ${summary.totals.files}`);
  console.log(`Questions: ${summary.totals.questions}`);
  console.log(`Unique IDs: ${summary.totals.uniqueIds}`);
  console.log(`Errors: ${summary.totals.errors}`);
  console.log(`Warnings: ${summary.totals.warnings}`);
  console.log(`Report: ${outJson}\n`);

  if (issues.length) {
    const top = issues.slice(0, 25);
    console.log("Top issues:");
    for (const i of top) {
      console.log(
        `- [${i.severity.toUpperCase()}] ${i.code} ${i.questionId ? `(${i.questionId})` : ""} in ${i.file}: ${i.message}`
      );
    }
    if (issues.length > top.length) {
      console.log(`... and ${issues.length - top.length} more`);
    }
    console.log("");
  }

  const shouldFail = errorCount > 0 || (strict && warnCount > 0);
  if (shouldFail) {
    console.error("❌ AUDIT FAILED");
    process.exit(1);
  } else {
    console.log("✅ AUDIT PASSED");
    process.exit(0);
  }
}

main();

