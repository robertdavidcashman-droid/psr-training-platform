import { NextRequest, NextResponse } from 'next/server';

interface Diagnosis {
  category: 'ENV' | 'NETWORK' | 'CORS' | 'AUTH' | 'COOKIE' | 'RLS' | 'ROUTING' | 'BUILD';
  evidence: string[];
  rankedFixes: Array<{
    action: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export async function GET(request: NextRequest) {
  // Fetch health check first
  const healthUrl = new URL('/api/health', request.url);
  let healthData: any = null;

  try {
    const healthResponse = await fetch(healthUrl.toString());
    healthData = await healthResponse.json();
  } catch (error) {
    return NextResponse.json({
      category: 'NETWORK' as const,
      evidence: ['Cannot reach /api/health endpoint'],
      rankedFixes: [
        {
          action: 'check_server_running',
          description: 'Ensure Next.js development server is running on port 3000',
          priority: 'high' as const,
        },
      ],
    } as Diagnosis);
  }

  const diagnosis: Diagnosis = {
    category: healthData.category || 'ENV',
    evidence: [],
    rankedFixes: [],
  };

  // Analyze health check results
  const checks = healthData.checks || {};

  // ENV issues
  if (!checks.env?.supabaseUrl || !checks.env?.anonKey) {
    diagnosis.category = 'ENV';
    diagnosis.evidence.push('Missing SUPABASE_URL or ANON_KEY environment variables');
    diagnosis.rankedFixes.push({
      action: 'setup_env_local',
      description: 'Create .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
      priority: 'high',
    });
    diagnosis.rankedFixes.push({
      action: 'start_local_supabase',
      description: 'Run `supabase start` and copy local credentials to .env.local',
      priority: 'high',
    });
  }

  // NETWORK issues
  if (checks.network?.authHealth === 'fail') {
    diagnosis.category = 'NETWORK';
    diagnosis.evidence.push(`Auth health check failed: ${checks.network.detail || 'Unknown error'}`);
    diagnosis.rankedFixes.push({
      action: 'verify_supabase_url',
      description: 'Ensure NEXT_PUBLIC_SUPABASE_URL is correct and reachable',
      priority: 'high',
    });
    diagnosis.rankedFixes.push({
      action: 'check_firewall_cors',
      description: 'Verify network connectivity and CORS settings',
      priority: 'medium',
    });
  }

  // RLS/Database issues
  if (checks.db?.healthcheckRead === 'fail') {
    if (checks.db.detail?.includes('does not exist') || checks.db.detail?.includes('relation')) {
      diagnosis.category = 'RLS';
      diagnosis.evidence.push('healthcheck table does not exist');
      diagnosis.rankedFixes.push({
        action: 'run_migrations',
        description: 'Apply database migrations to create healthcheck table',
        priority: 'high',
      });
    } else if (checks.db.detail?.includes('permission') || checks.db.detail?.includes('RLS')) {
      diagnosis.category = 'RLS';
      diagnosis.evidence.push('RLS policy blocking healthcheck read');
      diagnosis.rankedFixes.push({
        action: 'fix_rls_policies',
        description: 'Ensure healthcheck table has proper RLS policies for anon role',
        priority: 'high',
      });
    } else {
      diagnosis.category = 'RLS';
      diagnosis.evidence.push(`Database query failed: ${checks.db.detail}`);
      diagnosis.rankedFixes.push({
        action: 'check_database_connection',
        description: 'Verify database is accessible and credentials are correct',
        priority: 'high',
      });
    }
  }

  // AUTH issues
  if (!checks.auth?.serverSession && checks.env?.supabaseUrl && checks.env?.anonKey) {
    // This is normal for unauthenticated requests, but if user expected to be logged in, it's an issue
    if (request.headers.get('referer')?.includes('/dashboard')) {
      diagnosis.category = 'AUTH';
      diagnosis.evidence.push('No server session found for authenticated route');
      diagnosis.rankedFixes.push({
        action: 'check_cookie_settings',
        description: 'Verify cookie settings in Supabase auth configuration',
        priority: 'medium',
      });
      diagnosis.rankedFixes.push({
        action: 'verify_middleware',
        description: 'Ensure middleware is properly refreshing sessions',
        priority: 'medium',
      });
    }
  }

  return NextResponse.json(diagnosis);
}
