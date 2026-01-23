import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateEnvironment, testConnection, classifyError } from "@/lib/auth/connection";

export const dynamic = "force-dynamic";

interface HealthCheckResult {
  healthy: boolean;
  checks: {
    environment?: {
      valid: boolean;
      errors: string[];
      warnings: string[];
      timestamp: string;
    };
    clientCreation?: {
      success: boolean;
      error?: string;
      type?: string;
      timestamp: string;
    };
    network?: {
      connected: boolean;
      details?: {
        url?: string;
        endpoint?: string;
        status?: number;
      };
      error?: {
        type: string;
        message: string;
        fixInstructions: string[];
      };
      timestamp: string;
    };
    authEndpoint?: {
      healthy: boolean;
      error?: string;
      type?: string;
      timestamp: string;
    };
  };
  error?: {
    type: string;
    message: string;
    fixInstructions: string[];
  };
  responseTime: number;
  timestamp: string;
}

export async function GET() {
  const startTime = Date.now();
  const checks: HealthCheckResult['checks'] = {};

  // Check 1: Environment Variables
  const envValidation = validateEnvironment();
  checks.environment = {
    valid: envValidation.valid,
    errors: envValidation.errors,
    warnings: envValidation.warnings,
    timestamp: new Date().toISOString(),
  };

  if (!envValidation.valid) {
    return NextResponse.json(
      {
        healthy: false,
        checks,
        error: {
          type: "ConfigError",
          message: "Environment variables are missing or invalid",
          fixInstructions: envValidation.errors.map(
            (err) => `Fix: ${err}`
          ),
        },
        responseTime: Date.now() - startTime,
      },
      { status: 503 }
    );
  }

  // Check 2: Supabase Client Creation
  try {
    await createClient();
    checks.clientCreation = {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const classification = classifyError(error);
    checks.clientCreation = {
      success: false,
      error: classification.message,
      type: classification.type,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        healthy: false,
        checks,
        error: {
          type: classification.type,
          message: classification.message,
          fixInstructions: classification.fixInstructions,
        },
        responseTime: Date.now() - startTime,
      },
      { status: 503 }
    );
  }

  // Check 3: Network Connectivity
  const connectionTest = await testConnection();
  checks.network = {
    connected: connectionTest.connected,
    details: connectionTest.details,
    timestamp: new Date().toISOString(),
  };

  if (!connectionTest.connected && connectionTest.error) {
    checks.network.error = {
      type: connectionTest.error.type,
      message: connectionTest.error.message,
      fixInstructions: connectionTest.error.fixInstructions,
    };
  }

  // Check 4: Auth Endpoint Health
  try {
    const supabase = await createClient();
    const { error: sessionError } = await Promise.race([
      supabase.auth.getSession(),
      new Promise<{ error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      ),
    ]);

    if (sessionError && !sessionError.message.includes("session")) {
      checks.authEndpoint = {
        healthy: false,
        error: sessionError.message,
        timestamp: new Date().toISOString(),
      };
    } else {
      checks.authEndpoint = {
        healthy: true,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const classification = classifyError(error);
    checks.authEndpoint = {
      healthy: false,
      error: classification.message,
      type: classification.type,
      timestamp: new Date().toISOString(),
    };
  }

  // Determine overall health
  const isHealthy =
    checks.environment.valid &&
    checks.clientCreation.success &&
    checks.network.connected &&
    checks.authEndpoint.healthy;

  return NextResponse.json(
    {
      healthy: isHealthy,
      checks,
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    },
    { status: isHealthy ? 200 : 503 }
  );
}
