import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type CheckResult = 'ok' | 'fail';

interface HealthCheckResult {
  status: 'ok' | 'error';
  checks: {
    env: {
      supabaseUrl: boolean;
      anonKey: boolean;
    };
    network: {
      authHealth: CheckResult;
      detail?: string;
    };
    db: {
      healthcheckRead: CheckResult;
      detail?: string;
    };
    auth: {
      serverSession: boolean;
    };
  };
  category?: 'ENV' | 'NETWORK' | 'CORS' | 'AUTH' | 'COOKIE' | 'RLS' | 'ROUTING' | 'BUILD';
}

export async function GET(request: NextRequest) {
  const result: HealthCheckResult = {
    status: 'ok',
    checks: {
      env: {
        supabaseUrl: false,
        anonKey: false,
      },
      network: {
        authHealth: 'fail',
      },
      db: {
        healthcheckRead: 'fail',
      },
      auth: {
        serverSession: false,
      },
    },
  };

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  result.checks.env.supabaseUrl = !!supabaseUrl && supabaseUrl.length > 0;
  result.checks.env.anonKey = !!anonKey && anonKey.length > 0;

  if (!result.checks.env.supabaseUrl || !result.checks.env.anonKey) {
    result.status = 'error';
    result.category = 'ENV';
    return NextResponse.json(result, { status: 500 });
  }

  // Validate URL format
  try {
    new URL(supabaseUrl!);
  } catch {
    result.status = 'error';
    result.category = 'ENV';
    return NextResponse.json(result, { status: 500 });
  }

  // Check network - auth health endpoint
  try {
    const healthUrl = `${supabaseUrl}/auth/v1/health`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'apikey': anonKey!,
      },
    });

    clearTimeout(timeoutId);

    if (healthResponse.ok) {
      result.checks.network.authHealth = 'ok';
    } else {
      result.checks.network.authHealth = 'fail';
      result.checks.network.detail = `HTTP ${healthResponse.status}`;
    }
  } catch (error: any) {
    result.checks.network.authHealth = 'fail';
    result.checks.network.detail = error.message || 'Network error';
  }

  // Check database - healthcheck table read
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('healthcheck')
      .select('id, ok')
      .eq('id', 1)
      .single();

    if (error) {
      result.checks.db.healthcheckRead = 'fail';
      result.checks.db.detail = error.message || 'Database query failed';
      
      // Classify the error
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        result.category = result.category || 'RLS';
      } else if (error.message?.includes('permission') || error.message?.includes('RLS')) {
        result.category = result.category || 'RLS';
      }
    } else if (data) {
      result.checks.db.healthcheckRead = 'ok';
    }
  } catch (error: any) {
    result.checks.db.healthcheckRead = 'fail';
    result.checks.db.detail = error.message || 'Database connection failed';
  }

  // Check auth - server session
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    result.checks.auth.serverSession = !!user;
  } catch (error: any) {
    result.checks.auth.serverSession = false;
  }

  // Determine overall status and category
  if (
    result.checks.network.authHealth === 'fail' ||
    result.checks.db.healthcheckRead === 'fail'
  ) {
    result.status = 'error';
    if (!result.category) {
      if (result.checks.network.authHealth === 'fail') {
        result.category = 'NETWORK';
      } else if (result.checks.db.healthcheckRead === 'fail') {
        result.category = result.category || 'RLS';
      }
    }
  }

  const statusCode = result.status === 'ok' ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}
