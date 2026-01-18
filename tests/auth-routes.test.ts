import { describe, expect, it, vi } from 'vitest';

describe('/api/auth/login', () => {
  it('returns structured validation issues on bad input', async () => {
    vi.resetModules();
    const { POST } = await import('@/app/api/auth/login/route');

    const req = {
      json: async () => ({ email: 'not-an-email', password: '' }),
    } as any;

    const res = await POST(req);
    const json = await (res as any).json();

    expect((res as any).status).toBe(400);
    expect(json.error).toBe('Validation failed');
    expect(Array.isArray(json.issues)).toBe(true);
    expect(json.issues.length).toBeGreaterThan(0);
  });

  it('returns 401 with clean error when Supabase rejects credentials (mocked)', async () => {
    vi.resetModules();
    vi.doMock('@/lib/supabase/server', () => {
      return {
        createClient: async () => ({
          auth: {
            signInWithPassword: async () => ({
              data: { user: null, session: null },
              error: { message: 'Invalid login credentials', status: 400 },
            }),
          },
        }),
      };
    });

    const { POST } = await import('@/app/api/auth/login/route');

    const req = {
      json: async () => ({ email: 'user@example.com', password: 'wrong' }),
    } as any;

    const res = await POST(req);
    const json = await (res as any).json();

    expect((res as any).status).toBe(401);
    expect(json.error).toContain('Invalid');
  });
});

