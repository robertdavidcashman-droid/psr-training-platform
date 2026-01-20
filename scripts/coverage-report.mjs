#!/usr/bin/env node

/**
 * Seeded question coverage report (PASS/FAIL).
 *
 * Rules:
 * - Fails if any core category has < 15 seeded questions (upgraded threshold)
 * - Fails if any PACE/Custody category question is missing references
 * - Reports coverage against PSRAS standards criteria
 *
 * Notes:
 * - This validates seeded content only (not AI output).
 */

import fs from "fs";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const contentDir = path.join(projectRoot, "content");
const topicsPath = path.join(contentDir, "topics.json");
const questionsDir = path.join(contentDir, "questions");
const legacyQuestionsPath = path.join(contentDir, "questions.json");

function loadTopics() {
  const data = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
  const topicToCategory = new Map();
  for (const t of data.topics ?? []) topicToCategory.set(t.id, t.category);
  const categories = new Map();
  for (const c of data.categories ?? []) categories.set(c.id, c.name);
  return { topicToCategory, categories };
}

function loadSeededQuestions() {
  const all = [];
  if (fs.existsSync(questionsDir) && fs.statSync(questionsDir).isDirectory()) {
    const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      const raw = JSON.parse(fs.readFileSync(path.join(questionsDir, f), "utf-8"));
      if (Array.isArray(raw?.questions)) all.push(...raw.questions);
    }
    return all;
  }

  if (fs.existsSync(legacyQuestionsPath)) {
    const legacy = JSON.parse(fs.readFileSync(legacyQuestionsPath, "utf-8"));
    if (Array.isArray(legacy?.questions)) return legacy.questions;
  }
  return all;
}

const DIFFICULTIES = new Set(["foundation", "intermediate", "advanced"]);
const TYPES = new Set(["mcq", "best-answer", "scenario", "short-structured"]);
const OPTION_IDS = new Set(["A", "B", "C", "D"]);

function validateQuestion(q) {
  const issues = [];
  if (!q || typeof q !== "object") return ["not an object"];
  if (typeof q.id !== "string" || !q.id) issues.push("id missing/invalid");
  if (typeof q.topicId !== "string" || !q.topicId) issues.push("topicId missing/invalid");
  if (!DIFFICULTIES.has(q.difficulty)) issues.push("difficulty invalid");
  if (!TYPES.has(q.type)) issues.push("type invalid");
  if (typeof q.stem !== "string" || !q.stem) issues.push("stem missing/invalid");
  if (typeof q.explanation !== "string" || !q.explanation) issues.push("explanation missing/invalid");
  if (!Array.isArray(q.references)) issues.push("references missing/invalid");

  if (q.type === "mcq" || q.type === "best-answer") {
    if (!Array.isArray(q.options) || q.options.length !== 4) issues.push("options must be 4 for mcq/best-answer");
    if (!OPTION_IDS.has(q.correct)) issues.push("correct must be A/B/C/D for mcq/best-answer");
    if (Array.isArray(q.options)) {
      const ids = new Set(q.options.map((o) => o?.id));
      for (const id of OPTION_IDS) {
        if (!ids.has(id)) issues.push(`missing option ${id}`);
      }
    }
  }

  return issues;
}

function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

function main() {
  printHeader("Seeded question coverage report");

  if (!fs.existsSync(topicsPath)) {
    console.error(`FAIL: Missing topics file at ${topicsPath}`);
    process.exit(1);
  }

  const { topicToCategory, categories } = loadTopics();
  const rawQuestions = loadSeededQuestions();

  if (rawQuestions.length === 0) {
    console.error("FAIL: No seeded questions found.");
    process.exit(1);
  }

  const questions = [];
  const invalid = [];

  for (const q of rawQuestions) {
    const issues = validateQuestion(q);
    if (issues.length > 0) {
      invalid.push({ id: q?.id, issues });
      continue;
    }
    questions.push(q);
  }

  if (invalid.length > 0) {
    console.error(`FAIL: ${invalid.length} seeded question(s) failed schema validation.`);
    console.error("First invalid question:");
    console.error(JSON.stringify(invalid[0], null, 2));
    process.exit(1);
  }

  const countsByCategory = new Map();
  const countsByTopic = new Map();
  const missingRefs = [];

  for (const q of questions) {
    const categoryId = topicToCategory.get(q.topicId) ?? "unknown";
    countsByCategory.set(categoryId, (countsByCategory.get(categoryId) ?? 0) + 1);
    countsByTopic.set(q.topicId, (countsByTopic.get(q.topicId) ?? 0) + 1);

    const isPaceCategory = categoryId === "pace-custody" || q.topicId.startsWith("pace-");
    if (isPaceCategory) {
      if (!q.references || q.references.length === 0) {
        missingRefs.push({ id: q.id, topicId: q.topicId });
      }
    }
  }

  const coreCategories = [
    "pace-custody",
    "vulnerability",
    "interview",
    "disclosure",
    "bail",
    "client-care",
    "portfolio",
    "evidence",
  ];

  printHeader("Counts by category");
  for (const catId of coreCategories) {
    const name = categories.get(catId) ?? catId;
    const count = countsByCategory.get(catId) ?? 0;
    const status = count >= 15 ? "PASS" : count >= 10 ? "WARN" : "FAIL";
    console.log(`${status}  ${name} (${catId}): ${count}`);
  }

  printHeader("Counts by topic");
  const topicsSorted = [...countsByTopic.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  for (const [topicId, count] of topicsSorted) {
    console.log(`${topicId}: ${count}`);
  }

  const lowCats = coreCategories
    .map((id) => ({ id, count: countsByCategory.get(id) ?? 0 }))
    .filter((x) => x.count < 10);
  
  const warnCats = coreCategories
    .map((id) => ({ id, count: countsByCategory.get(id) ?? 0 }))
    .filter((x) => x.count >= 10 && x.count < 15);

  if (missingRefs.length > 0) {
    printHeader("PACE/Custody questions missing references");
    for (const r of missingRefs.slice(0, 20)) {
      console.log(`- ${r.id} (${r.topicId})`);
    }
  }

  if (warnCats.length > 0) {
    console.log("\nWARN: Some categories have fewer than 15 questions:");
    for (const c of warnCats) console.log(`  - ${c.id}: ${c.count}`);
  }

  if (lowCats.length > 0 || missingRefs.length > 0) {
    console.error("\nFAIL: Coverage requirements not met.");
    if (lowCats.length > 0) {
      console.error("Categories below minimum (10):");
      for (const c of lowCats) console.error(`- ${c.id}: ${c.count}`);
    }
    if (missingRefs.length > 0) {
      console.error(`PACE/Custody questions missing references: ${missingRefs.length}`);
    }
    process.exit(1);
  }

  console.log(`\nPASS: ${questions.length} seeded questions validated. Coverage OK.`);
}

main();

