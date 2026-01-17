import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // Use Turbopack so Next respects `turbopack.root` and avoids inferring the parent workspace root
        // (which can break module resolution when this app lives inside a larger folder).
        command: 'npm run dev -- --turbo -p 3000',
        port: 3000,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
