import { test, expect } from '@playwright/test';

function randomEmail() {
  return `e2e.user.${Date.now()}@example.com`;
}

test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const json = await res.json();
  expect(json.status).toBe('ok');
});

test('signup -> dashboard', async ({ page }) => {
  const email = randomEmail();
  const password = 'Passw0rd!123';

  await page.goto('/signup');
  await page.getByLabel('Full Name').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
});

test('refresh persists session', async ({ page }) => {
  const email = randomEmail();
  const password = 'Passw0rd!123';

  await page.goto('/signup');
  await page.getByLabel('Full Name').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard/);
});

test('logout blocks dashboard', async ({ page }) => {
  const email = randomEmail();
  const password = 'Passw0rd!123';

  await page.goto('/signup');
  await page.getByLabel('Full Name').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login/);

  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login/);
});

test('wrong password shows friendly error', async ({ page }) => {
  const email = randomEmail();
  const password = 'Passw0rd!123';

  // Create account
  await page.goto('/signup');
  await page.getByLabel('Full Name').fill('E2E User');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  // Logout
  await page.getByRole('button', { name: 'Logout' }).click();
  await expect(page).toHaveURL(/\/login/);

  // Login with wrong password
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText(/login failed|invalid/i)).toBeVisible();
});

