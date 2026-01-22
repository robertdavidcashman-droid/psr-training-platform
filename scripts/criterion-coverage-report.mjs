#!/usr/bin/env node

/**
 * Criterion Coverage Report
 * 
 * Generates a report showing question coverage for each PSRAS criterion.
 * Shows: criterion slug, count before, count after, status.
 * 
 * Usage: node scripts/criterion-coverage-report.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, "..");
const standardsPath = join(projectRoot, "content", "psras", "standards.json");
const questionsDir = join(projectRoot, "content", "questions");

// Load standards
const standardsData = JSON.parse(readFileSync(standardsPath, "utf-8"));

// Load questions from JSON files
function loadQuestions() {
  const questions = [];
  const files = [
    "core.json",
    "pace.json",
    "pace-extended.json",
    "client-care.json",
    "client-care-extended.json",
    "vulnerability.json",
    "vulnerability-extended.json",
    "disclosure.json",
    "disclosure-extended.json",
    "interview.json",
    "interview-extended.json",
    "evidence.json",
    "evidence-extended.json",
    "bail.json",
    "bail-extended.json",
    "portfolio.json",
    "portfolio-extended.json",
    "authority-to-act.json",
    "telephone-advice.json",
    "identification.json",
    "interview-recording.json",
    "charging.json",
    "cit-scenarios.json",
    "register-entry.json",
    "probationary-extended.json",
    "delay-legal-advice.json",
    "voluntary-attendance.json",
    "nfa-cautions.json",
  ];

  for (const file of files) {
    const filePath = join(questionsDir, file);
    try {
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      if (Array.isArray(data.questions)) {
        questions.push(...data.questions);
      }
    } catch (error) {
      // File might not exist, skip
    }
  }

  return questions;
}

const questions = loadQuestions();

function getCriterionCoverage() {
  // Build tag-to-questions map
  const tagToQuestions = new Map();
  for (const q of questions) {
    for (const tag of q.tags ?? []) {
      const list = tagToQuestions.get(tag) ?? [];
      list.push(q);
      tagToQuestions.set(tag, list);
    }
  }

  const criteria = [];

  for (const part of standardsData.parts) {
    for (const unit of part.units) {
      for (const outcome of unit.outcomes) {
        for (const criterion of outcome.criteria) {
          // Count questions matching this criterion's tags
          const matchingQuestions = new Set();
          for (const tag of criterion.tags ?? []) {
            for (const q of tagToQuestions.get(tag) ?? []) {
              matchingQuestions.add(q.id);
            }
          }

          const questionCount = matchingQuestions.size;
          let status;
          if (questionCount === 0) {
            status = "Missing";
          } else if (questionCount < 5) {
            status = "Partial";
          } else {
            status = "OK";
          }

          criteria.push({
            criterionId: criterion.id,
            label: criterion.label,
            tags: criterion.tags ?? [],
            questionCount,
            status,
            partTitle: part.title,
            unitTitle: unit.title,
            outcomeTitle: outcome.title,
          });
        }
      }
    }
  }

  return criteria;
}

function main() {
  console.log("📊 Criterion Coverage Report\n");
  console.log(`Generated: ${new Date().toISOString()}\n`);

  const criteria = getCriterionCoverage();

  // Summary stats
  const missing = criteria.filter((c) => c.status === "Missing").length;
  const partial = criteria.filter((c) => c.status === "Partial").length;
  const ok = criteria.filter((c) => c.status === "OK").length;
  const total = criteria.length;

  console.log("Summary:");
  console.log(`  Total criteria: ${total}`);
  console.log(`  Missing (0 questions): ${missing}`);
  console.log(`  Partial (1-4 questions): ${partial}`);
  console.log(`  OK (5+ questions): ${ok}`);
  console.log(`  Coverage rate: ${Math.round(((ok + partial) / total) * 100)}%`);
  console.log("");

  // Group by status
  const byStatus = {
    Missing: criteria.filter((c) => c.status === "Missing"),
    Partial: criteria.filter((c) => c.status === "Partial"),
    OK: criteria.filter((c) => c.status === "OK"),
  };

  // Report by status
  for (const [status, items] of Object.entries(byStatus)) {
    if (items.length === 0) continue;

    console.log(`\n${status} (${items.length} criteria):`);
    console.log("─".repeat(80));

    for (const criterion of items.slice(0, 20)) {
      // Create a slug-like identifier
      const slug = criterion.criterionId;
      console.log(`${slug.padEnd(15)} | ${criterion.questionCount.toString().padStart(2)} questions | ${criterion.label}`);
    }

    if (items.length > 20) {
      console.log(`... and ${items.length - 20} more`);
    }
  }

  // Detailed table (CSV-like format for easy parsing)
  console.log("\n\nDetailed Report (CSV format):");
  console.log("Criterion ID,Label,Question Count,Status,Tags");
  for (const criterion of criteria) {
    const tags = criterion.tags.join(";");
    console.log(
      `"${criterion.criterionId}","${criterion.label}",${criterion.questionCount},"${criterion.status}","${tags}"`
    );
  }
}

main();
