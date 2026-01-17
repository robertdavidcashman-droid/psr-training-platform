import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface DiagnosticResult {
  status: 'ok' | 'error';
  checks: {
    dns: {
      reachable: boolean;
      error?: string;
    };
    authEndpoint: {
      reachable: boolean;
      cors?: boolean;
      error?: string;
    };
    restEndpoint: {
      reachable: boolean;
      cors?: boolean;
      error?: string;
    };
    urlFormat: {
      valid: boolean;
      error?: string;
    };
    keyFormat: {
      valid: boolean;
      error?: string;
    };
    clientSideServiceRole: {
      detected: boolean;
      error?: string;
    };
  };
  likelyCauses: Array<{
    cause: string;
    confidence: 'high' | 'medium' | 'low';
    fix: string;
  }>;
  actionable_fixes: string[];
}

export async function GET() {
  const result: DiagnosticResult = {
    status: 'ok',
    checks: {
      dns: { reachable: false },
      authEndpoint: { reachable: false },
      restEndpoint: { reachable: false },
      urlFormat: { valid: false },
      keyFormat: { valid: false },
      clientSideServiceRole: { detected: false },
    },
    likelyCauses: [],
    actionable_fixes: [],
  };

  if (!isSupabaseConfigured()) {
    result.status = 'error';
    result.likelyCauses.push({
      cause: 'Missing environment variables',
      confidence: 'high',
      fix: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local or Vercel environment variables',
    });
    result.actionable_fixes.push('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to environment variables');
    return NextResponse.json(result, { status: 200 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  // Check URL format
  try {
    const url = new URL(supabaseUrl);
    result.checks.urlFormat.valid = url.protocol === 'https:' || url.protocol === 'http:';
    if (!result.checks.urlFormat.valid) {
      result.checks.urlFormat.error = 'URL must use http:// or https://';
    }
  } catch (err) {
    result.checks.urlFormat.valid = false;
    result.checks.urlFormat.error = 'Invalid URL format';
    result.likelyCauses.push({
      cause: 'Invalid Supabase URL format',
      confidence: 'high',
      fix: 'Ensure NEXT_PUBLIC_SUPABASE_URL is a valid URL (e.g., https://xxx.supabase.co)',
    });
  }

  // Check key format (JWT-like)
  result.checks.keyFormat.valid = supabaseAnonKey.length > 20 && supabaseAnonKey.includes('.');
  if (!result.checks.keyFormat.valid) {
    result.checks.keyFormat.error = 'Key format appears invalid (should be JWT-like)';
    result.likelyCauses.push({
      cause: 'Invalid anon key format',
      confidence: 'high',
      fix: 'Get the correct anon public key from Supabase Dashboard → Settings → API',
    });
  }

  // Check for service role key being used client-side (common mistake)
  if (supabaseAnonKey.startsWith('eyJ') && supabaseAnonKey.length > 200) {
    // Service role keys are longer and have different structure
    // This is a heuristic check
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && supabaseAnonKey === serviceRoleKey) {
      result.checks.clientSideServiceRole.detected = true;
      result.likelyCauses.push({
        cause: 'Service role key used client-side (SECURITY RISK)',
        confidence: 'high',
        fix: 'NEVER use SUPABASE_SERVICE_ROLE_KEY in NEXT_PUBLIC_* variables. Use anon key for client-side.',
      });
    }
  }

  // Test DNS and endpoints (server-side fetch)
  try {
    // Test auth health endpoint
    const authHealthUrl = `${supabaseUrl}/auth/v1/health`;
    const authResponse = await fetch(authHealthUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
      },
      signal: AbortSignal.timeout(5000),
    });

    result.checks.dns.reachable = true;
    result.checks.authEndpoint.reachable = authResponse.ok || authResponse.status < 500;

    if (!authResponse.ok) {
      result.checks.authEndpoint.error = `HTTP ${authResponse.status}`;
    }

    // Check for CORS (if we can read response, CORS is likely OK)
    try {
      await authResponse.text();
      result.checks.authEndpoint.cors = true;
    } catch {
      result.checks.authEndpoint.cors = false;
      result.likelyCauses.push({
        cause: 'CORS blocking requests',
        confidence: 'medium',
        fix: 'Ensure Supabase project allows requests from your domain. Check Supabase Dashboard → Settings → API → CORS settings',
      });
    }
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      result.checks.dns.reachable = false;
      result.checks.dns.error = 'DNS resolution failed or network error';
      result.likelyCauses.push({
        cause: 'Network/DNS resolution failure',
        confidence: 'high',
        fix: 'Check internet connection, verify Supabase project is active (not paused), and URL is correct',
      });
    } else if (err.name === 'AbortError' || err.message.includes('timeout')) {
      result.checks.dns.reachable = false;
      result.checks.dns.error = 'Request timeout';
      result.likelyCauses.push({
        cause: 'Supabase project may be paused or unreachable',
        confidence: 'high',
        fix: 'Check Supabase Dashboard to ensure project is active. Free tier projects pause after inactivity.',
      });
    } else {
      result.checks.dns.error = err.message;
    }
  }

  // Test REST endpoint
  try {
    const restUrl = `${supabaseUrl}/rest/v1/`;
    const restResponse = await fetch(restUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    result.checks.restEndpoint.reachable = restResponse.ok || restResponse.status === 404 || restResponse.status === 406;
    // 404/406 are OK - means endpoint exists but needs table name

    try {
      await restResponse.text();
      result.checks.restEndpoint.cors = true;
    } catch {
      result.checks.restEndpoint.cors = false;
    }
  } catch (err: any) {
    result.checks.restEndpoint.error = err.message;
  }

  // Generate actionable fixes
  if (!result.checks.urlFormat.valid) {
    result.actionable_fixes.push('Fix NEXT_PUBLIC_SUPABASE_URL format');
  }
  if (!result.checks.keyFormat.valid) {
    result.actionable_fixes.push('Fix NEXT_PUBLIC_SUPABASE_ANON_KEY (get from Supabase Dashboard)');
  }
  if (!result.checks.dns.reachable) {
    result.actionable_fixes.push('Check Supabase project status and network connectivity');
  }
  if (result.checks.clientSideServiceRole.detected) {
    result.actionable_fixes.push('CRITICAL: Remove service role key from client-side environment variables');
  }

  // Determine overall status
  const criticalFailures = [
    !result.checks.urlFormat.valid,
    !result.checks.keyFormat.valid,
    !result.checks.dns.reachable,
    result.checks.clientSideServiceRole.detected,
  ].filter(Boolean).length;

  if (criticalFailures > 0) {
    result.status = 'error';
  }

  // Always return 200 - the JSON status field indicates health
  return NextResponse.json(result, { status: 200 });
}
