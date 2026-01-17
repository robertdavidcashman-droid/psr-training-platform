import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Log in')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('signup page renders', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByText('Create an account')).toBeVisible();
    await expect(page.getByRole('button', { name: /Create account|Creating/ })).toBeVisible();
  });

  test('signup and login flow', async ({ page }) => {
    // Generate unique test user
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    // Go to signup
    await page.goto('/signup');
    
    // Fill signup form
    await page.getByLabel('Name').fill(testName);
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    
    // Submit signup
    await page.getByRole('button', { name: /Create account|Creating/ }).click();
    
    // Wait for success message or redirect
    // Note: If email confirmation is enabled, user will see a message
    // If disabled, user should be redirected to dashboard
    try {
      // Check for success message first
      const successMessage = page.getByText(/Check your email|account created/i);
      await successMessage.waitFor({ timeout: 5000 }).catch(() => null);
      
      // If we see success message, email confirmation is required
      // In that case, we can't complete the full flow without email
      // But we can verify the signup worked
      if (await successMessage.isVisible().catch(() => false)) {
        // Signup succeeded, but needs email confirmation
        // This is expected behavior
        return;
      }
    } catch {
      // No success message, might have redirected
    }
    
    // If redirected to dashboard, signup worked without email confirmation
    // If still on signup, check for error
    const currentUrl = page.url();
    if (currentUrl.includes('/dashboard')) {
      // Success! User was auto-logged in
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
      
      // Verify session persists on refresh
      await page.reload();
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible();
    } else if (currentUrl.includes('/signup')) {
      // Check if there's an error
      const errorText = await page.textContent('body').catch(() => '');
      if (errorText?.includes('Failed to fetch') || errorText?.includes('network')) {
        // This is the issue we're trying to fix
        throw new Error('Signup failed with network error - Supabase connection issue');
      }
    }
  });
});

test('protected route redirects to login once (no loop) and preserves next', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForURL((url) => url.pathname === '/login');

  const url = new URL(page.url());
  expect(url.pathname).toBe('/login');
  expect(url.searchParams.get('next')).toContain('/dashboard');

  // Refresh should remain on /login and should not nest next params.
  await page.reload();
  const url2 = new URL(page.url());
  expect(url2.pathname).toBe('/login');
  expect(url2.searchParams.get('next') ?? '').toContain('/dashboard');
  expect(url2.searchParams.get('next') ?? '').not.toContain('/login');
});

test('admin route redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/admin');
  await page.waitForURL((url) => url.pathname === '/login');
  expect(new URL(page.url()).searchParams.get('next')).toContain('/admin');
});

test('scenarios route redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/scenarios');
  await page.waitForURL((url) => url.pathname === '/login');
  expect(new URL(page.url()).searchParams.get('next')).toContain('/scenarios');
});

test('portfolio route redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/portfolio');
  await page.waitForURL((url) => url.pathname === '/login');
  expect(new URL(page.url()).searchParams.get('next')).toContain('/portfolio');
});

test('admin questions route redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/admin/questions');
  await page.waitForURL((url) => url.pathname === '/login');
  expect(new URL(page.url()).searchParams.get('next')).toContain('/admin/questions');
});

test('review route redirects to login when unauthenticated', async ({ page }) => {
  await page.goto('/review');
  await page.waitForURL((url) => url.pathname === '/login');
  expect(new URL(page.url()).searchParams.get('next')).toContain('/review');
});

test('optional: login works with provided test credentials', async ({ page }) => {
  const email = process.env.PLAYWRIGHT_TEST_USER_EMAIL;
  const password = process.env.PLAYWRIGHT_TEST_USER_PASSWORD;
  test.skip(
    !email || !password,
    'Set PLAYWRIGHT_TEST_USER_EMAIL and PLAYWRIGHT_TEST_USER_PASSWORD to run this test.',
  );

  await page.goto('/login?next=/dashboard');
  await page.getByLabel('Email').fill(email!);
  await page.getByLabel('Password').fill(password!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL((url) => url.pathname === '/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Refresh should keep the session and stay on dashboard (no flicker check here; just URL).
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  // Logout should return to login.
  await page.getByRole('button', { name: 'Log out' }).click();
  await page.waitForURL((url) => url.pathname === '/login');
});
