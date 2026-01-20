#!/usr/bin/env node

/**
 * PSRAS Standards Importer (One-time / refresh script)
 * 
 * This script is designed to fetch and extract structured data from
 * the authoritative SRA PSRAS standards pages. In practice, the
 * standards.json is curated manually from official sources.
 * 
 * This script validates and reports on the existing standards.json
 * to ensure it is well-formed and has expected structure.
 * 
 * Usage: node scripts/import-psras-standards.mjs [--validate]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const standardsPath = path.join(projectRoot, "content", "psras", "standards.json");

// Authoritative source URLs for reference
const AUTHORITATIVE_SOURCES = {
  sraStandards: "https://www.sra.org.uk/solicitors/resources/specific-areas-of-practice/standards/",
  sraAssessment: "https://guidance.sra.org.uk/solicitors/resources/specific-areas-of-practice/assessment-guidelines/",
  cardiffOverview: "https://www.cardiff.ac.uk/professional-development/available-training/short-courses/psras/about-the-psras",
  laaArrangements: "https://assets.publishing.service.gov.uk/media/68dcf841ef1c2f72bc1e4c9f/Police_Station_Register_Arrangements_2025.pdf",
  paceCodeC: "https://www.gov.uk/government/publications/pace-code-c-2023/pace-code-c-2023-accessible",
  paceCodeD: "https://www.gov.uk/government/publications/pace-code-d-2017/pace-code-d-2017-accessible",
  paceCodeE: "https://www.gov.uk/government/publications/pace-codes-e-and-f-2018/pace-code-e-2018-accessible",
  paceCodeF: "https://www.gov.uk/government/publications/pace-codes-e-and-f-2018/pace-code-f-2018-accessible",
  paceCodeG: "https://www.gov.uk/government/publications/pace-code-g-2012/pace-code-g-2012-accessible",
};

function validateStandards(standards) {
  const issues = [];

  if (!standards.version) {
    issues.push("Missing version field");
  }

  if (!standards.sourceUrls || typeof standards.sourceUrls !== "object") {
    issues.push("Missing or invalid sourceUrls");
  }

  if (!Array.isArray(standards.parts)) {
    issues.push("Missing or invalid parts array");
    return { valid: false, issues, stats: null };
  }

  let unitCount = 0;
  let outcomeCount = 0;
  let criteriaCount = 0;
  let authoritiesCount = 0;
  const criteriaIds = new Set();
  const tagSet = new Set();

  for (const part of standards.parts) {
    if (!part.id || !part.title) {
      issues.push(`Part missing id or title: ${JSON.stringify(part).slice(0, 50)}`);
      continue;
    }

    if (!Array.isArray(part.units)) {
      issues.push(`Part ${part.id} missing units array`);
      continue;
    }

    for (const unit of part.units) {
      unitCount++;

      if (!unit.id || !unit.title) {
        issues.push(`Unit missing id or title in ${part.id}`);
        continue;
      }

      if (!Array.isArray(unit.outcomes)) {
        issues.push(`Unit ${unit.id} missing outcomes array`);
        continue;
      }

      for (const outcome of unit.outcomes) {
        outcomeCount++;

        if (!outcome.id || !outcome.title) {
          issues.push(`Outcome missing id or title in ${unit.id}`);
          continue;
        }

        if (!Array.isArray(outcome.criteria)) {
          issues.push(`Outcome ${outcome.id} missing criteria array`);
          continue;
        }

        for (const criterion of outcome.criteria) {
          criteriaCount++;

          if (!criterion.id || !criterion.label) {
            issues.push(`Criterion missing id or label in ${outcome.id}`);
            continue;
          }

          if (criteriaIds.has(criterion.id)) {
            issues.push(`Duplicate criterion ID: ${criterion.id}`);
          }
          criteriaIds.add(criterion.id);

          if (!criterion.summary) {
            issues.push(`Criterion ${criterion.id} missing summary`);
          }

          if (Array.isArray(criterion.expectedAuthorities)) {
            authoritiesCount += criterion.expectedAuthorities.length;
          }

          if (Array.isArray(criterion.tags)) {
            criterion.tags.forEach((t) => tagSet.add(t));
          }
        }
      }
    }
  }

  const stats = {
    parts: standards.parts.length,
    units: unitCount,
    outcomes: outcomeCount,
    criteria: criteriaCount,
    authorities: authoritiesCount,
    uniqueTags: tagSet.size,
    tags: [...tagSet].sort(),
  };

  return {
    valid: issues.length === 0,
    issues,
    stats,
  };
}

function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

function main() {
  const args = process.argv.slice(2);
  const _validateOnly = args.includes("--validate");

  printHeader("PSRAS Standards Importer/Validator");

  // Check if standards.json exists
  if (!fs.existsSync(standardsPath)) {
    console.error(`FAIL: Standards file not found at ${standardsPath}`);
    console.log("\nTo create the standards file, run this script with curated data.");
    process.exit(1);
  }

  // Load and parse
  let standards;
  try {
    const raw = fs.readFileSync(standardsPath, "utf-8");
    standards = JSON.parse(raw);
  } catch (err) {
    console.error(`FAIL: Could not parse standards.json: ${err.message}`);
    process.exit(1);
  }

  // Validate
  const result = validateStandards(standards);

  printHeader("Validation Results");

  if (result.issues.length > 0) {
    console.log(`Issues found: ${result.issues.length}`);
    for (const issue of result.issues.slice(0, 20)) {
      console.log(`  - ${issue}`);
    }
    if (result.issues.length > 20) {
      console.log(`  ... and ${result.issues.length - 20} more`);
    }
  } else {
    console.log("No issues found.");
  }

  if (result.stats) {
    printHeader("Statistics");
    console.log(`Parts: ${result.stats.parts}`);
    console.log(`Units: ${result.stats.units}`);
    console.log(`Outcomes: ${result.stats.outcomes}`);
    console.log(`Criteria: ${result.stats.criteria}`);
    console.log(`Expected Authorities: ${result.stats.authorities}`);
    console.log(`Unique Tags: ${result.stats.uniqueTags}`);
  }

  printHeader("Source URLs Check");
  for (const [key, url] of Object.entries(AUTHORITATIVE_SOURCES)) {
    const inFile = standards.sourceUrls?.[key];
    if (inFile === url) {
      console.log(`MATCH: ${key}`);
    } else if (inFile) {
      console.log(`DIFF: ${key} (file has different URL)`);
    } else {
      console.log(`MISSING: ${key} not in standards.json`);
    }
  }

  if (result.valid) {
    console.log("\nPASS: standards.json is valid.");
    process.exit(0);
  } else {
    console.error("\nFAIL: standards.json has validation issues.");
    process.exit(1);
  }
}

main();
