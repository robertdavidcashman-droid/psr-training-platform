import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as healthGET } from '@/app/api/health/route';
import { GET as diagnosticsGET } from '@/app/api/diagnostics/supabase/route';
import { NextRequest } from 'next/server';

describe('Health Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('/api/health', () => {
    it('should return error when Supabase env vars are missing', async () => {
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await healthGET();
      const data = await response.json();

      expect(response.status).toBe(200); // Always returns 200, status in JSON
      expect(data.status).toBe('error');
      expect(data.checks.env.supabaseUrl).toBe(false);
      expect(data.checks.env.supabaseAnonKey).toBe(false);
      expect(data.actionable_error).toContain('Missing required environment variables');

      // Restore
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      if (originalKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    });

    it('should return ok structure when env vars are set', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key-12345678901234567890';

      const response = await healthGET();
      const data = await response.json();

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('checks');
      expect(data.checks).toHaveProperty('env');
      expect(data.checks).toHaveProperty('db');
      expect(data.checks).toHaveProperty('auth');
      expect(data).toHaveProperty('timestamp');
    });
  });

  describe('/api/diagnostics/supabase', () => {
    it('should return error when env vars are missing', async () => {
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const response = await diagnosticsGET();
      const data = await response.json();

      expect(response.status).toBe(200); // Always returns 200, status in JSON
      expect(data.status).toBe('error');
      expect(data.likelyCauses.length).toBeGreaterThan(0);
      expect(data.actionable_fixes.length).toBeGreaterThan(0);

      // Restore
      if (originalUrl) process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      if (originalKey) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    });

    it('should validate URL format', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';

      const response = await diagnosticsGET();
      const data = await response.json();

      expect(data.checks.urlFormat.valid).toBe(false);
      expect(data.checks.urlFormat.error).toBeDefined();
    });

    it('should detect invalid key format', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'short';

      const response = await diagnosticsGET();
      const data = await response.json();

      expect(data.checks.keyFormat.valid).toBe(false);
    });
  });
});
