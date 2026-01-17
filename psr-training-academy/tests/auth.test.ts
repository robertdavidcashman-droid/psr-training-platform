import { describe, expect, it, vi } from 'vitest';

// NOTE: these tests intentionally focus on no-env behavior to avoid coupling
// the unit suite to a live Supabase project.

describe('auth utilities', () => {
  it('getCurrentUser returns null when Supabase env is not configured', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { getCurrentUser } = await import('@/lib/auth');
    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it('requireAuth redirects when not authenticated', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    vi.mock('next/navigation', () => ({
      redirect: (to: string) => {
        throw new Error(`REDIRECT:${to}`);
      },
    }));

    const { requireAuth } = await import('@/lib/auth');

    await expect(requireAuth()).rejects.toThrowError('REDIRECT:/login');
  });

  it('requireAdmin redirects to login when Supabase env is not configured', async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    vi.mock('next/navigation', () => ({
      redirect: (to: string) => {
        throw new Error(`REDIRECT:${to}`);
      },
    }));

    const { requireAdmin } = await import('@/lib/auth');

    await expect(requireAdmin()).rejects.toThrowError('REDIRECT:/login');
  });

  it('requireAdmin redirects to /login when no user session', async () => {
    vi.resetModules();

    vi.doMock('next/navigation', () => ({
      redirect: (to: string) => {
        throw new Error(`REDIRECT:${to}`);
      },
    }));

    vi.doMock('@/lib/supabase/config', () => ({
      isSupabaseConfigured: () => true,
    }));

    vi.doMock('@/lib/supabase/server', () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: null } }),
        },
      }),
    }));

    const { requireAdmin } = await import('@/lib/auth');
    await expect(requireAdmin()).rejects.toThrowError('REDIRECT:/login');
  });

  it('requireAdmin redirects to /dashboard when user is not admin', async () => {
    vi.resetModules();

    vi.doMock('next/navigation', () => ({
      redirect: (to: string) => {
        throw new Error(`REDIRECT:${to}`);
      },
    }));

    vi.doMock('@/lib/supabase/config', () => ({
      isSupabaseConfigured: () => true,
    }));

    vi.doMock('@/lib/supabase/server', () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: 'user-1', email: 'u@example.com' } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { role: 'user' }, error: null }),
            }),
          }),
        }),
      }),
    }));

    const { requireAdmin } = await import('@/lib/auth');
    await expect(requireAdmin()).rejects.toThrowError('REDIRECT:/dashboard');
  });

  it('requireAdmin returns user when admin', async () => {
    vi.resetModules();

    vi.doMock('@/lib/supabase/config', () => ({
      isSupabaseConfigured: () => true,
    }));

    vi.doMock('@/lib/supabase/server', () => ({
      createClient: async () => ({
        auth: {
          getUser: async () => ({ data: { user: { id: 'admin-1', email: 'a@example.com' } } }),
        },
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: { role: 'admin' }, error: null }),
            }),
          }),
        }),
      }),
    }));

    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin();
    expect(user.id).toBe('admin-1');
  });
});
