import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type FailureCategory = 
  | 'ENV' 
  | 'NETWORK' 
  | 'CORS' 
  | 'AUTH' 
  | 'COOKIE/SESSION' 
  | 'RLS' 
  | 'ROUTING/MIDDLEWARE' 
  | 'BUILD/TYPE';

interface DiagnosisResult {
  category: FailureCategory | null;
  evidence: {
    statusCodes?: number[];
    headers?: Record<string, string>;
    errorMessages?: string[];
    networkErrors?: string[];
  };
  recommended_fix: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * GET /api/diagnose
 * Comprehensive diagnosis endpoint that classifies "Failed to fetch" errors
 * Uses a ranked decision tree to identify root cause
 */
export async function GET(request: NextRequest) {
  const result: DiagnosisResult = {
    category: null,
    evidence: {},
    recommended_fix: [],
    confidence: 'low',
  };

  // Step 1: Check ENV category
  if (!isSupabaseConfigured()) {
    result.category = 'ENV';
    result.confidence = 'high';
    result.evidence.errorMessages = ['Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    result.recommended_fix = [
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
      'Or run: npm run doctor (will bootstrap local Supabase automatically)',
    ];
    return NextResponse.json(result, { status: 200 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  // Step 2: Check URL format (ENV category)
  try {
    const url = new URL(supabaseUrl);
    if (!url.protocol.startsWith('http')) {
      result.category = 'ENV';
      result.confidence = 'high';
      result.evidence.errorMessages = [`Invalid URL protocol: ${url.protocol}`];
      result.recommended_fix = ['Fix NEXT_PUBLIC_SUPABASE_URL to use http:// or https://'];
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    result.category = 'ENV';
    result.confidence = 'high';
    result.evidence.errorMessages = ['Invalid URL format'];
    result.recommended_fix = ['Fix NEXT_PUBLIC_SUPABASE_URL format'];
    return NextResponse.json(result, { status: 200 });
  }

  // Step 3: Check NETWORK category (DNS, unreachable)
  try {
    const healthUrl = `${supabaseUrl}/auth/v1/health`;
    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
      },
      signal: AbortSignal.timeout(5000),
    });

    result.evidence.statusCodes = [healthResponse.status];

    if (!healthResponse.ok && healthResponse.status >= 500) {
      result.category = 'NETWORK';
      result.confidence = 'high';
      result.evidence.errorMessages = [`Supabase returned ${healthResponse.status}`];
      result.recommended_fix = [
        'Supabase project may be paused (free tier)',
        'Check Supabase Dashboard → Project Status',
        'Or switch to local Supabase: npm run doctor',
      ];
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err: any) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      result.category = 'NETWORK';
      result.confidence = 'high';
      result.evidence.networkErrors = [err.message];
      result.evidence.errorMessages = ['DNS resolution failed or network unreachable'];
      result.recommended_fix = [
        'Check internet connection',
        'Verify Supabase URL is correct',
        'Check if Supabase project is active (not paused)',
        'Or use local Supabase: npm run doctor',
      ];
      return NextResponse.json(result, { status: 200 });
    } else if (err.name === 'AbortError' || err.message.includes('timeout')) {
      result.category = 'NETWORK';
      result.confidence = 'high';
      result.evidence.errorMessages = ['Request timeout'];
      result.recommended_fix = [
        'Supabase project may be paused',
        'Check Supabase Dashboard',
        'Or use local Supabase: npm run doctor',
      ];
      return NextResponse.json(result, { status: 200 });
    }
  }

  // Step 4: Check CORS category
  try {
    const testUrl = `${supabaseUrl}/auth/v1/health`;
    const corsResponse = await fetch(testUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': request.headers.get('origin') || 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
      },
      signal: AbortSignal.timeout(3000),
    });

    const corsHeaders = {
      'access-control-allow-origin': corsResponse.headers.get('access-control-allow-origin') || '',
      'access-control-allow-methods': corsResponse.headers.get('access-control-allow-methods') || '',
    };
    result.evidence.headers = corsHeaders;

    // If CORS headers are missing or restrictive, likely CORS issue
    if (!corsHeaders['access-control-allow-origin'] || corsHeaders['access-control-allow-origin'] === 'null') {
      result.category = 'CORS';
      result.confidence = 'medium';
      result.recommended_fix = [
        'Use server-side login route: POST /api/auth/login (avoids CORS)',
        'Or configure CORS in Supabase Dashboard → Settings → API',
      ];
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    // CORS check failed, but not necessarily a CORS issue
  }

  // Step 5: Check AUTH category (401/403)
  try {
    const authTestUrl = `${supabaseUrl}/auth/v1/user`;
    const authResponse = await fetch(authTestUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      signal: AbortSignal.timeout(5000),
    });

    if (authResponse.status === 401 || authResponse.status === 403) {
      result.category = 'AUTH';
      result.confidence = 'high';
      result.evidence.statusCodes = [authResponse.status];
      result.evidence.errorMessages = ['Invalid or expired API key'];
      result.recommended_fix = [
        'Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct',
        'Get key from Supabase Dashboard → Settings → API → anon public',
        'Ensure you are using anon key, NOT service role key',
      ];
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    // Auth check failed, continue
  }

  // Step 6: Check COOKIE/SESSION category
  try {
    const supabase = await createClient();
    const { data: { user }, error: sessionError } = await supabase.auth.getUser();

    if (sessionError && sessionError.message.includes('cookie') || sessionError.message.includes('session')) {
      result.category = 'COOKIE/SESSION';
      result.confidence = 'medium';
      result.evidence.errorMessages = [sessionError.message];
      result.recommended_fix = [
        'Check middleware cookie handling',
        'Ensure @supabase/ssr is properly configured',
        'Verify cookies are being set in auth callback',
      ];
      return NextResponse.json(result, { status: 200 });
    }
  } catch (err) {
    // Session check failed
  }

  // Step 7: Check RLS category
  try {
    const supabase = await createClient();
    const { data, error: dbError } = await supabase
      .from('healthcheck')
      .select('ok')
      .limit(1);

    if (dbError) {
      if (dbError.code === 'PGRST116' || dbError.message?.includes('RLS') || dbError.message?.includes('policy')) {
        result.category = 'RLS';
        result.confidence = 'high';
        result.evidence.errorMessages = [dbError.message];
        result.recommended_fix = [
          'Run migrations to create RLS policies',
          'For local: supabase db reset',
          'For hosted: Run migrations in Supabase SQL Editor',
        ];
        return NextResponse.json(result, { status: 200 });
      } else if (dbError.code === 'PGRST204' || dbError.message?.includes('does not exist')) {
        result.category = 'RLS';
        result.confidence = 'medium';
        result.evidence.errorMessages = ['Table does not exist'];
        result.recommended_fix = [
          'Run migrations to create tables',
          'For local: supabase db reset',
          'For hosted: Run migrations in Supabase SQL Editor',
        ];
        return NextResponse.json(result, { status: 200 });
      }
    }
  } catch (err) {
    // RLS check failed
  }

  // Step 8: If we get here, likely ROUTING/MIDDLEWARE or unknown
  // Check if request came from a protected route that should be public
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const pathname = refererUrl.pathname;
      
      // Check if middleware might be blocking
      if (pathname.startsWith('/api/') && pathname !== '/api/health' && pathname !== '/api/diagnose') {
        result.category = 'ROUTING/MIDDLEWARE';
        result.confidence = 'low';
        result.recommended_fix = [
          'Check middleware.ts - ensure /api/* routes are not intercepted',
          'Verify middleware matcher config excludes API routes',
        ];
        return NextResponse.json(result, { status: 200 });
      }
    } catch (err) {
      // URL parse failed
    }
  }

  // Default: Unknown issue
  result.category = null;
  result.confidence = 'low';
  result.recommended_fix = [
    'Run: npm run doctor for comprehensive diagnostics',
    'Check browser console for detailed error messages',
    'Check /api/health for system status',
  ];

  return NextResponse.json(result, { status: 200 });
}
