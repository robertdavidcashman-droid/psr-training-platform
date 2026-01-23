# Authentication Diagnostic & Auto-Fix Guide

This guide explains how to use the new comprehensive authentication diagnostic and auto-fix system.

## Quick Start

### Run Auto-Diagnostic

When experiencing authentication errors, run the comprehensive diagnostic tool:

```bash
npm run auto-diagnose:auth
```

This will:
1. Check environment variables
2. Test network connectivity
3. Verify CORS configuration
4. Test authentication endpoints
5. Provide specific fix instructions for any issues found

Results are saved to `auth-diagnostic-results.json` for reference.

## Features

### 1. Enhanced Supabase Client (`lib/supabase/client.ts`)

- **Connection Validation**: Validates environment variables before creating client
- **Timeout Protection**: 30-second timeout on all requests
- **Health Check Method**: `checkClientHealth()` for pre-flight checks
- **Better Error Messages**: Detailed error classification

### 2. Connection Utility (`lib/auth/connection.ts`)

- **Error Classification**: Automatically categorizes errors (Config, Network, CORS, Timeout, Auth)
- **Retry Logic**: Exponential backoff retry for transient errors
- **Connection Testing**: `testConnection()` function
- **Environment Validation**: `validateEnvironment()` function

### 3. Health Check API (`/api/auth/health-check`)

Server-side endpoint that checks:
- Environment variables
- Supabase client creation
- Network connectivity
- Auth endpoint health

Access via: `GET /api/auth/health-check`

### 4. Connection Status Component

Visual indicator showing connection health:
- Automatically checks connection on mount
- Shows specific error details and fix instructions
- Auto-refreshes every 30 seconds
- Integrated into login page

### 5. Enhanced Login Page

- **Pre-flight Checks**: Validates connection before attempting auth
- **Automatic Retry**: Retries failed requests with exponential backoff
- **Better Error Messages**: Shows specific fix instructions for each error type
- **Connection Status**: Visual indicator when connection issues detected

## Error Types & Fixes

### ConfigError
**Symptoms**: Missing or invalid environment variables

**Fix**:
1. Check `NEXT_PUBLIC_SUPABASE_URL` is set
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
3. For Vercel: Set in Project Settings → Environment Variables
4. Redeploy after adding variables

### CORSError
**Symptoms**: "CORS error" or "Access-Control" errors

**Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Add your domain to allowed origins:
   - Production: `https://psrtrain.com`
   - Vercel: `https://*.vercel.app`
   - Local: `http://localhost:3000`
3. Wait 1-2 minutes for propagation
4. Clear browser cache

### NetworkError
**Symptoms**: "Failed to fetch", "NetworkError", connection refused

**Fix**:
1. Check internet connection
2. Check Supabase status: https://status.supabase.com
3. Try disabling VPN/proxy
4. Check firewall settings

### TimeoutError
**Symptoms**: Request timed out

**Fix**:
1. Check internet connection speed
2. Check Supabase status
3. Retry in a few moments

### AuthError
**Symptoms**: Invalid credentials, user not found

**Fix**:
1. Verify email and password
2. Check if email confirmation is required
3. Try password reset if needed

## Usage Examples

### Check Connection Health (Client-Side)

```typescript
import { checkClientHealth } from '@/lib/supabase/client';

const health = await checkClientHealth();
if (!health.healthy) {
  console.error('Connection issue:', health.error);
}
```

### Use Retry Logic

```typescript
import { withRetry } from '@/lib/auth/connection';

const result = await withRetry(
  async () => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  { maxRetries: 3, initialDelay: 1000 }
);
```

### Classify Errors

```typescript
import { classifyError } from '@/lib/auth/connection';

try {
  // ... auth operation
} catch (error) {
  const classification = classifyError(error);
  console.log('Error type:', classification.type);
  console.log('Fix instructions:', classification.fixInstructions);
}
```

### Use Connection Status Component

```tsx
import { ConnectionStatus } from '@/components/auth/ConnectionStatus';

<ConnectionStatus
  onStatusChange={(healthy) => console.log('Connection:', healthy)}
  showWhenHealthy={false}
  autoRefresh={true}
/>
```

## Troubleshooting Workflow

1. **Run Auto-Diagnostic**
   ```bash
   npm run auto-diagnose:auth
   ```

2. **Check Results**
   - Review console output
   - Check `auth-diagnostic-results.json` for detailed results
   - Follow fix instructions provided

3. **Verify Fix**
   - Run diagnostic again
   - Test login/signup flow
   - Check browser console for errors

4. **If Still Failing**
   - Check Supabase dashboard for project status
   - Verify environment variables in deployment platform
   - Check browser network tab for specific errors
   - Review `auth-diagnostic-results.json` for clues

## API Endpoints

### Health Check
```
GET /api/auth/health-check
```

Returns:
```json
{
  "healthy": true,
  "checks": {
    "environment": "local",
    "envVars": { ... },
    "network": { ... },
    "authEndpoint": { ... }
  },
  "responseTime": 123
}
```

## Best Practices

1. **Always run diagnostic first** when encountering auth errors
2. **Check environment variables** before debugging network issues
3. **Use retry logic** for transient network errors
4. **Monitor connection status** in production
5. **Keep diagnostic results** for troubleshooting history

## Integration with Existing Code

The enhanced client is backward compatible. Existing code using `createClient()` will automatically benefit from:
- Better error messages
- Timeout protection
- Environment validation

No code changes required for basic usage.
