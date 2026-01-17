import { describe, expect, it, vi } from 'vitest';

describe('supabase helpers (no live Supabase)', () => {
  it('isSupabaseConfigured is false when env vars are missing', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { isSupabaseConfigured } = await import('@/lib/supabase/config');
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('server createClient returns a placeholder client when env vars are missing', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const createServerClientSpy = vi.fn(() => ({
      auth: { getUser: vi.fn(), signOut: vi.fn() },
    }));

    vi.doMock('@supabase/ssr', () => ({
      createServerClient: createServerClientSpy,
    }));

    const { createClient } = await import('@/lib/supabase/server');
    const client = await createClient();
    expect(client).toBeTruthy();
    expect(createServerClientSpy).toHaveBeenCalledWith(
      'https://placeholder.supabase.co',
      'placeholder-key',
      expect.any(Object),
    );
  });

  it('middleware getUserFromRequest returns user=null when env vars are missing', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { getUserFromRequest } = await import('@/lib/supabase/middleware');

    const request = {
      headers: new Headers(),
      cookies: {
        getAll: () => [],
        set: () => undefined,
      },
    } as unknown as Parameters<typeof getUserFromRequest>[0];

    const { user, response } = await getUserFromRequest(request);
    expect(user).toBeNull();
    expect(response).toBeTruthy();
  });

  it('middleware getUserFromRequest reads user when env vars exist', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    const createServerClientSpy = vi.fn(() => ({
      auth: {
        getUser: async () => ({ data: { user: { id: 'user-1' } } }),
      },
    }));

    vi.doMock('@supabase/ssr', () => ({
      createServerClient: createServerClientSpy,
    }));

    const { getUserFromRequest } = await import('@/lib/supabase/middleware');

    const request = {
      headers: new Headers(),
      cookies: {
        getAll: () => [{ name: 'sb-access-token', value: 'x' }],
        set: () => undefined,
      },
    } as unknown as Parameters<typeof getUserFromRequest>[0];

    const { user } = await getUserFromRequest(request);
    expect(user?.id).toBe('user-1');
    expect(createServerClientSpy).toHaveBeenCalled();
  });

  it('server createClient wires cookie adapter when env vars exist', async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    const cookieStore = {
      getAll: () => [{ name: 'sb-access-token', value: 'x' }],
      set: vi.fn(),
    };

    vi.doMock('next/headers', () => ({
      cookies: async () => cookieStore,
    }));

    const createServerClientSpy = vi.fn(() => ({
      auth: { getUser: vi.fn() },
    }));

    vi.doMock('@supabase/ssr', () => ({
      createServerClient: createServerClientSpy,
    }));

    const { createClient } = await import('@/lib/supabase/server');
    await createClient();

    const call = (createServerClientSpy.mock.calls[0] ?? []) as unknown[];
    const opts = call[2] as
      | {
          cookies?: {
            getAll: () => unknown;
            setAll: (cookiesToSet: unknown) => void;
          };
        }
      | undefined;
    expect(createServerClientSpy).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon-key',
      expect.any(Object),
    );
    expect(opts?.cookies?.getAll).toBeTypeOf('function');
    expect(opts?.cookies?.setAll).toBeTypeOf('function');

    // Execute the adapter functions for coverage.
    const all = opts!.cookies!.getAll();
    expect(all).toEqual([{ name: 'sb-access-token', value: 'x' }]);
    opts!.cookies!.setAll([{ name: 'a', value: 'b', options: { path: '/' } }]);
    expect(cookieStore.set).toHaveBeenCalled();
  });
});
