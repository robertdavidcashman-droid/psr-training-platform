import { chromium, type FullConfig } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export default async function globalSetup(config: FullConfig) {
  const baseURL = (config.projects[0]?.use.baseURL as string | undefined) || "http://localhost:3100";
  const cookieName = process.env.GATEWAY_COOKIE_NAME || "app_gateway";

  const storageStatePath = path.resolve(process.cwd(), "test-results", "gateway-storage.json");
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Set gateway cookie so E2E tests can reach protected routes.
  await context.addCookies([
    {
      name: cookieName,
      value: "1",
      url: baseURL,
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);

  await context.storageState({ path: storageStatePath });
  await browser.close();
}

