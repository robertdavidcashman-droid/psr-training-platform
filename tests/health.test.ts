import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

// Helper to create a minimal fetch Response-like object
function okResponse(body: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as any;
}

describe('/api/health', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns ENV error when SUPABASE env missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { GET } = await import('@/app/api/health/route');
    const res = await GET({} as any);
    const json = await (res as any).json();

    expect((res as any).status).toBe(500);
    expect(json.status).toBe('error');
    expect(json.category).toBe('ENV');
    expect(json.checks.env.supabaseUrl).toBe(false);
    expect(json.checks.env.anonKey).toBe(false);
  });

  it('returns ok when env/network/db checks pass (mocked)', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    // Mock global fetch for Supabase auth health endpoint
    const fetchSpy = vi
      .spyOn(globalThis as any, 'fetch')
      .mockImplementation(async (url: any) => {
        if (String(url).includes('/auth/v1/health')) return okResponse({ status: 'ok' }, 200);
        return okResponse({}, 200);
      });

    // Mock supabase server client used inside the route
    vi.doMock('@/lib/supabase/server', () => {
      return {
        createClient: async () => ({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: async () => ({ data: { id: 1, ok: true }, error: null }),
              }),
            }),
          }),
          auth: {
            getUser: async () => ({ data: { user: null } }),
          },
        }),
      };
    });

    const { GET } = await import('@/app/api/health/route');
    const res = await GET({} as any);
    const json = await (res as any).json();

    expect((res as any).status).toBe(200);
    expect(json.status).toBe('ok');
    expect(json.checks.network.authHealth).toBe('ok');
    expect(json.checks.db.healthcheckRead).toBe('ok');

    fetchSpy.mockRestore();
  });
});

