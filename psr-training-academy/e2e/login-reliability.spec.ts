import { test, expect } from '@playwright/test';

test.describe('Login Reliability Tests', () => {
  // Generate unique test user for each test run
  const timestamp = Date.now();
  const testEmail = `psr.test.${timestamp}@gmail.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  test.beforeAll(async ({ browser }) => {
    // Ensure we start with a clean state - signup a test user
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto('/signup');
      await page.getByLabel('Name').fill(testName);
      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Password').fill(testPassword);
      await page.getByRole('button', { name: /Create account|Creating/ }).click();
      
      // Wait for either dashboard redirect (local) or email confirmation message
      await page.waitForTimeout(3000);
      const url = page.url();
      const bodyText = await page.textContent('body').catch(() => '');
      
      if (url.includes('/dashboard')) {
        // User was auto-logged in (local Supabase)
        console.log('Test user created and logged in');
      } else if (bodyText?.includes('email') && bodyText?.includes('confirm')) {
        // Email confirmation required (hosted Supabase)
        console.log('Test user created, email confirmation required');
        // For hosted Supabase, we'll need to manually confirm or use a different approach
        // For now, we'll skip tests that require login if email confirmation is needed
      }
    } catch (err) {
      console.warn('Could not create test user:', err);
    } finally {
      await context.close();
    }
  });

  test('E2E 1: Signup -> Login -> Dashboard', async ({ page }) => {
    // Create a new user for this test
    const uniqueEmail = `psr.test.${Date.now()}@gmail.com`;
    const password = 'TestPassword123!';
    const name = 'E2E Test User';

    // Signup
    await page.goto('/signup');
    await expect(page.getByText('Create an account')).toBeVisible();
    
    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: /Create account|Creating/ }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    const bodyText = await page.textContent('body').catch(() => '');
    const currentUrl = page.url();
    
    // Check for email confirmation (hosted Supabase)
    if (bodyText?.includes('check your email') || bodyText?.includes('confirm your account')) {
      // Email confirmation required - this is expected for hosted Supabase
      // We'll test login separately
      test.skip();
      return;
    }
    
    // Should redirect to dashboard if auto-logged in
    if (currentUrl.includes('/dashboard')) {
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
      return;
    }
    
    // If still on signup, try logging in
    if (currentUrl.includes('/signup')) {
      await page.goto('/login');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();
      
      // Wait for redirect
      await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 10000 });
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
    }
  });

  test('E2E 2: Login with correct credentials redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Log in')).toBeVisible();
    
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Should redirect to dashboard
    await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
  });

  test('E2E 3: Session persists after refresh', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard
    await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('E2E 4: Logout works and redirects to login', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill(testPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await page.waitForURL((url) => url.pathname === '/dashboard', { timeout: 10000 });
    
    // Click logout
    await page.getByRole('button', { name: 'Log out' }).click();
    
    // Should redirect to login
    await page.waitForURL((url) => url.pathname === '/login', { timeout: 5000 });
    await expect(page.getByText('Log in')).toBeVisible();
    
    // Try to access dashboard - should redirect to login
    await page.goto('/dashboard');
    await page.waitForURL((url) => url.pathname === '/login', { timeout: 5000 });
  });

  test('E2E 5: Incorrect password shows user-friendly error', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill(testEmail);
    await page.getByLabel('Password').fill('WrongPassword123!');
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Wait for error message
    await page.waitForTimeout(2000);
    
    // Should show user-friendly error, not "Failed to fetch"
    const errorText = await page.textContent('body').catch(() => '');
    const errorElement = await page.locator('p.text-destructive').textContent().catch(() => null);
    
    expect(errorElement || errorText).toContain('Email or password incorrect');
    expect(errorElement || errorText).not.toContain('Failed to fetch');
    expect(errorElement || errorText).not.toContain('TypeError');
    
    // Should still be on login page
    expect(page.url()).toContain('/login');
  });

  test('E2E 6: Protected routes redirect to login when not authenticated', async ({ page }) => {
    // Ensure we're logged out
    await page.goto('/logout');
    await page.waitForTimeout(1000);
    
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should redirect to login with next parameter
    await page.waitForURL((url) => url.pathname === '/login', { timeout: 5000 });
    const url = new URL(page.url());
    expect(url.searchParams.get('next')).toContain('/dashboard');
  });

  test('E2E 7: No redirect loops - login page accessible when logged out', async ({ page }) => {
    // Ensure logged out
    await page.goto('/logout');
    await page.waitForTimeout(1000);
    
    // Go to login
    await page.goto('/login');
    await page.waitForTimeout(2000);
    
    // Should still be on login page (no loop)
    expect(page.url()).toContain('/login');
    await expect(page.getByText('Log in')).toBeVisible();
  });

  test('E2E 8: Login form shows password toggle', async ({ page }) => {
    await page.goto('/login');
    
    const passwordField = page.getByLabel('Password');
    await passwordField.fill('TestPassword123!');
    
    // Check that password is hidden by default
    expect(await passwordField.getAttribute('type')).toBe('password');
    
    // Find and click the show password button
    const toggleButton = page.locator('button[type="button"]').filter({ has: page.locator('svg') }).first();
    await toggleButton.click();
    
    // Password should now be visible
    await expect(passwordField).toHaveAttribute('type', 'text');
  });

  test('E2E 9: Health endpoints are accessible', async ({ request }) => {
    // Test /api/health
    const healthResponse = await request.get('/api/health');
    expect(healthResponse.ok()).toBeTruthy();
    const healthData = await healthResponse.json();
    expect(healthData).toHaveProperty('status');
    expect(healthData).toHaveProperty('checks');
    
    // Test /api/auth/health
    const authHealthResponse = await request.get('/api/auth/health');
    expect(authHealthResponse.ok()).toBeTruthy();
    const authHealthData = await authHealthResponse.json();
    expect(authHealthData).toHaveProperty('ok');
    expect(authHealthData).toHaveProperty('hasSession');
  });
});
