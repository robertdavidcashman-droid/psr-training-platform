import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('middleware route exclusions', () => {
  it('excludes /api and auth/public routes from middleware blocking', () => {
    const content = readFileSync('middleware.ts', 'utf-8');

    // API exclusion
    expect(content).toContain("pathname.startsWith('/api/')");

    // Auth/public exclusions
    expect(content).toContain("pathname === '/login'");
    expect(content).toContain("pathname === '/signup'");
    expect(content).toContain("pathname.startsWith('/reset-password')");
    expect(content).toContain("pathname.startsWith('/auth/callback')");
    expect(content).toContain("pathname === '/'");
    expect(content).toContain("pathname === '/privacy'");
    expect(content).toContain("pathname === '/terms'");
  });
});

