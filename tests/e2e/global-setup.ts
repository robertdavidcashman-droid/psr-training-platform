import { chromium, type FullConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export default async function globalSetup(config: FullConfig) {
  // Create storage state directory for test results
  const storageStatePath = path.resolve(process.cwd(), "test-results", "gateway-storage.json");
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  // Create empty storage state (tests will authenticate individually)
  const browser = await chromium.launch();
  const context = await browser.newContext();
  await context.storageState({ path: storageStatePath });
  await browser.close();
}

