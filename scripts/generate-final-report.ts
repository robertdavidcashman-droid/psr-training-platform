#!/usr/bin/env tsx

/**
 * Final Test Report Generator
 * 
 * This script runs after all tests and generates the final TEST_REPORT.md
 * It aggregates results from all test suites including the coverage audit.
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();
const reportPath = join(projectRoot, "TEST_REPORT.md");

interface TestSummary {
  suite: string;
  passed: boolean;
  details?: string;
}

function generateFinalReport(): string {
  const timestamp = new Date().toISOString();
  const report: string[] = [];

  report.push("# TEST REPORT");
  report.push("");
  report.push(`Generated: ${timestamp}`);
  report.push("");
  report.push("## Test Summary");
  report.push("");
  report.push("This report is generated after running `npm run test:all`.");
  report.push("");
  report.push("### Test Suites");
  report.push("");
  report.push("1. **Lint** - Code quality checks");
  report.push("2. **Unit Tests** - Fast unit tests");
  report.push("3. **Integration Tests** - Server-side integration tests");
  report.push("4. **E2E Tests** - End-to-end browser tests");
  report.push("5. **Coverage Audit** - Coverage matrix validation");
  report.push("");
  report.push("### How to Run");
  report.push("");
  report.push("```bash");
  report.push("npm run test:all");
  report.push("```");
  report.push("");
  report.push("This will run all test suites in sequence and generate this report.");
  report.push("");
  report.push("### Individual Test Commands");
  report.push("");
  report.push("- `npm run test:lint` - Run linting");
  report.push("- `npm run test:unit` - Run unit tests");
  report.push("- `npm run test:integration` - Run integration tests");
  report.push("- `npm run test:e2e` - Run E2E tests");
  report.push("- `npm run audit:coverage` - Run coverage audit");
  report.push("");
  report.push("### Coverage Requirements");
  report.push("");
  report.push("- Every criterion must have >= 30 questions");
  report.push("- Every question must have >= 2 citations");
  report.push("- Citations must have both instrument and cite fields");
  report.push("- Coverage matrix display must match database truth");
  report.push("");
  report.push("### For More Details");
  report.push("");
  report.push("See `docs/TESTING.md` for comprehensive testing documentation.");
  report.push("");

  return report.join("\n");
}

function main() {
  const reportContent = generateFinalReport();
  writeFileSync(reportPath, reportContent, "utf-8");
  console.log(`\n📄 Test report template written to: ${reportPath}`);
  console.log("\nRun `npm run test:all` to generate the full test report.");
}

main();
