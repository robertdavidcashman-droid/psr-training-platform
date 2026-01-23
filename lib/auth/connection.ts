/**
 * Connection utility for authentication operations
 * Provides retry logic, error classification, and connection testing
 */

export enum ErrorType {
  ConfigError = "ConfigError",
  NetworkError = "NetworkError",
  CORSError = "CORSError",
  TimeoutError = "TimeoutError",
  AuthError = "AuthError",
  UnknownError = "UnknownError",
}

export interface ErrorClassification {
  type: ErrorType;
  message: string;
  fixInstructions: string[];
  retryable: boolean;
}

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 8000,
  backoffMultiplier: 2,
};

/**
 * Classify an error to determine its type and provide fix instructions
 */
export function classifyError(error: unknown): ErrorClassification {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();

  // Configuration errors - don't retry
  if (
    errorString.includes("missing") ||
    errorString.includes("environment variable") ||
    errorString.includes("not properly configured") ||
    errorString.includes("invalid supabase url")
  ) {
    return {
      type: ErrorType.ConfigError,
      message: "Configuration error: Authentication service is not properly configured.",
      fixInstructions: [
        "Check that NEXT_PUBLIC_SUPABASE_URL is set in your environment variables",
        "Check that NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your environment variables",
        "For production: Verify variables are set in Vercel → Settings → Environment Variables",
        "For local: Check your .env.local file",
        "Redeploy after adding environment variables",
      ],
      retryable: false,
    };
  }

  // CORS errors - don't retry (requires manual fix)
  if (
    errorString.includes("cors") ||
    errorString.includes("access-control") ||
    errorString.includes("origin") ||
    errorString.includes("preflight")
  ) {
    return {
      type: ErrorType.CORSError,
      message: "CORS error: The authentication server is blocking requests from this domain.",
      fixInstructions: [
        "Go to Supabase Dashboard → Settings → API",
        "Add your domain to the allowed origins list",
        "For production: Add https://psrtrain.com",
        "For Vercel previews: Add https://*.vercel.app",
        "Wait 1-2 minutes for changes to propagate",
        "Clear browser cache and try again",
      ],
      retryable: false,
    };
  }

  // Network errors - retryable
  if (
    errorString.includes("failed to fetch") ||
    errorString.includes("networkerror") ||
    errorString.includes("network request failed") ||
    errorString.includes("err_network") ||
    errorString.includes("err_internet_disconnected") ||
    errorString.includes("unable to reach") ||
    errorString.includes("connection refused") ||
    errorString.includes("dns")
  ) {
    return {
      type: ErrorType.NetworkError,
      message: "Network error: Unable to reach the authentication server.",
      fixInstructions: [
        "Check your internet connection",
        "Check if Supabase service is available (status.supabase.com)",
        "Try again in a few moments",
        "If using a VPN or proxy, try disabling it",
        "Check browser console for detailed error messages",
      ],
      retryable: true,
    };
  }

  // Timeout errors - retryable
  if (
    errorString.includes("timeout") ||
    errorString.includes("timed out") ||
    errorString.includes("request timeout")
  ) {
    return {
      type: ErrorType.TimeoutError,
      message: "Request timed out: The authentication server took too long to respond.",
      fixInstructions: [
        "Check your internet connection speed",
        "Try again in a few moments",
        "The server may be experiencing high load",
        "Check if Supabase service is available (status.supabase.com)",
      ],
      retryable: true,
    };
  }

  // Auth errors - don't retry (user/credential issues)
  if (
    errorString.includes("invalid login") ||
    errorString.includes("invalid credentials") ||
    errorString.includes("user not found") ||
    errorString.includes("email not confirmed") ||
    errorString.includes("already registered")
  ) {
    // Provide user-friendly message for invalid credentials
    // Note: Supabase returns "Invalid login credentials" for both wrong password AND unconfirmed email
    let friendlyMessage = errorMessage;
    if (errorString.includes("invalid login") || errorString.includes("invalid credentials")) {
      // Check if the original error message already includes helpful context
      if (errorMessage.includes("confirm your email") || errorMessage.includes("email confirmation")) {
        friendlyMessage = errorMessage; // Use the enhanced message from login page
      } else {
        friendlyMessage = "The email or password you entered is incorrect. Please check your credentials and try again. If you just created an account, you may need to confirm your email first.";
      }
    }
    
    return {
      type: ErrorType.AuthError,
      message: friendlyMessage,
      fixInstructions: [
        "Verify your email and password are correct",
        "If you just signed up, check your email for a confirmation link",
        "Check if email confirmation is required in your account settings",
        "Try resetting your password if needed",
      ],
      retryable: false,
    };
  }

  // Unknown errors - retryable (might be transient)
  return {
    type: ErrorType.UnknownError,
    message: errorMessage || "An unexpected error occurred",
    fixInstructions: [
      "Try refreshing the page",
      "Clear browser cache and cookies",
      "Check browser console for detailed error messages",
      "If the problem persists, contact support",
    ],
    retryable: true,
  };
}

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const classification = classifyError(error);

      // Don't retry if error is not retryable
      if (!classification.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxRetries) {
        throw error;
      }

      // Wait before retrying
      await sleep(delay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
    }
  }

  throw lastError;
}

/**
 * Test connection to Supabase
 */
export async function testConnection(): Promise<{
  connected: boolean;
  error?: ErrorClassification;
  details?: {
    url?: string;
    endpoint?: string;
    status?: number;
  };
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      connected: false,
      error: classifyError(new Error("Missing environment variables")),
    };
  }

  try {
    // Test health endpoint
    const healthUrl = `${url}/rest/v1/`;
    const response = await fetch(healthUrl, {
      method: "HEAD",
      headers: {
        apikey: key,
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok || response.status === 404) {
      // 404 is OK - means endpoint exists but route doesn't (expected for HEAD)
      return {
        connected: true,
        details: {
          url,
          endpoint: healthUrl,
          status: response.status,
        },
      };
    }

    return {
      connected: false,
      error: classifyError(
        new Error(`Connection test returned status ${response.status}`)
      ),
      details: {
        url,
        endpoint: healthUrl,
        status: response.status,
      },
    };
  } catch (error) {
    return {
      connected: false,
      error: classifyError(error),
      details: {
        url,
      },
    };
  }
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // #region agent log
  if (typeof window !== 'undefined') { fetch('http://127.0.0.1:7246/ingest/0eb3c384-f99b-4a17-9680-dd38a4e20b60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/auth/connection.ts:286',message:'validateEnvironment URL check',data:{url:url,urlLength:url?.length||0,urlHostname:url?new URL(url).hostname:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{}); }
  // #endregion

  if (!url) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is not set");
  } else {
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.protocol.startsWith("http")) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL must use http or https protocol");
      }
      if (!parsedUrl.hostname.includes("supabase")) {
        warnings.push("NEXT_PUBLIC_SUPABASE_URL doesn't appear to be a Supabase URL");
      }
      
      // Check for common typos in Supabase URLs
      // Known issue: cvsawjrtgmsmadtfwfa (missing 'r') should be cvsawjrtgmsmadtrfwfa
      if (parsedUrl.hostname.includes("cvsawjrtgmsmadtfwfa") && !parsedUrl.hostname.includes("cvsawjrtgmsmadtrfwfa")) {
        errors.push("NEXT_PUBLIC_SUPABASE_URL appears to have a typo: missing 'r' in project ID. Should be: cvsawjrtgmsmadtrfwfa.supabase.co");
      }
    } catch {
      errors.push("NEXT_PUBLIC_SUPABASE_URL is not a valid URL");
    }
  }

  if (!key) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  } else {
    if (key.length < 50) {
      warnings.push("NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short (expected ~100+ characters)");
    }
    if (!key.startsWith("eyJ")) {
      warnings.push("NEXT_PUBLIC_SUPABASE_ANON_KEY doesn't appear to be a JWT token");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
