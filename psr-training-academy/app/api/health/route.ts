import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface HealthCheck {
  status: 'ok' | 'error';
  checks: {
    env: {
      supabaseUrl: boolean;
      supabaseAnonKey: boolean;
      serviceRoleKey: boolean;
    };
    db: {
      reachable: boolean;
      rlsBlocked?: boolean;
      error?: string;
    };
    auth: {
      sessionReadable: boolean;
      authenticated: boolean;
      error?: string;
    };
  };
  actionable_error?: string;
  timestamp: string;
}

export async function GET() {
  const checks: HealthCheck = {
    status: 'ok',
    checks: {
      env: {
        supabaseUrl: false,
        supabaseAnonKey: false,
        serviceRoleKey: false,
      },
      db: {
        reachable: false,
      },
      auth: {
        sessionReadable: false,
        authenticated: false,
      },
    },
    timestamp: new Date().toISOString(),
  };

  const errors: string[] = [];

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  checks.checks.env.supabaseUrl = Boolean(supabaseUrl && supabaseUrl.startsWith('http'));
  checks.checks.env.supabaseAnonKey = Boolean(supabaseAnonKey && supabaseAnonKey.length > 20);
  checks.checks.env.serviceRoleKey = Boolean(serviceRoleKey);

  if (!checks.checks.env.supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is missing or invalid');
  }
  if (!checks.checks.env.supabaseAnonKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid');
  }

  // If basic env is missing, return early (but still HTTP 200)
  if (!isSupabaseConfigured()) {
    checks.status = 'error';
    checks.actionable_error = `Missing required environment variables: ${errors.join(', ')}`;
    return NextResponse.json(checks, { status: 200 });
  }

  // Test database connectivity
  try {
    const supabase = await createClient();
    
    // Try to query the healthcheck table (will be created by migration)
    const { data, error: dbError } = await supabase
      .from('healthcheck')
      .select('ok')
      .eq('id', 1)
      .single();

    if (dbError) {
      // Check if it's an RLS issue
      if (dbError.code === 'PGRST116' || dbError.message?.includes('RLS') || dbError.message?.includes('policy')) {
        checks.checks.db.rlsBlocked = true;
        errors.push('Database query blocked by RLS policies');
      } else if (dbError.code === 'PGRST204' || dbError.message?.includes('relation') || dbError.message?.includes('does not exist') || dbError.message?.includes('schema cache')) {
        // Healthcheck table doesn't exist - this is not critical, just means migration hasn't run
        // Try a simpler connectivity test using a table that should exist (like profiles)
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .limit(1);
          
          if (!profileError) {
            checks.checks.db.reachable = true;
            // Don't add to errors - healthcheck table is optional for diagnostics
          } else {
            checks.checks.db.error = `Healthcheck table missing (run migration). Profile table test: ${profileError.message}`;
          }
        } catch (fallbackErr: any) {
          checks.checks.db.error = `Healthcheck table missing. Fallback test failed: ${fallbackErr.message}`;
        }
      } else {
        errors.push(`Database error: ${dbError.message}`);
        checks.checks.db.error = dbError.message;
      }
    } else if (data) {
      checks.checks.db.reachable = true;
    }
  } catch (err: any) {
    checks.checks.db.error = err.message || 'Unknown database error';
    errors.push(`Database connection failed: ${err.message}`);
  }

  // Test auth session
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    checks.checks.auth.sessionReadable = true;
    checks.checks.auth.authenticated = Boolean(user);

    if (authError) {
      checks.checks.auth.error = authError.message;
      // Don't treat auth errors as critical - user might not be logged in
    }
  } catch (err: any) {
    checks.checks.auth.error = err.message || 'Unknown auth error';
    errors.push(`Auth session check failed: ${err.message}`);
  }

  // Determine overall status
  if (errors.length > 0) {
    checks.status = 'error';
    checks.actionable_error = errors.join('; ');
  }

  // Always return 200 - the JSON status field indicates health
  // This allows the endpoint to be reachable even when there are issues
  return NextResponse.json(checks, { status: 200 });
}
