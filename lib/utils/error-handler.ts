/**
 * Error handling utilities
 */

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unknown error occurred';
}

export function isConnectionError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('econnrefused') ||
    message.includes('enotfound')
  );
}

export function isSupabaseError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes('supabase') ||
    message.includes('postgres') ||
    message.includes('database') ||
    message.includes('row-level security') ||
    message.includes('rls')
  );
}

export function formatErrorForUser(error: unknown): string {
  if (isConnectionError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  if (isSupabaseError(error)) {
    return 'A database error occurred. Please try again later.';
  }
  return getErrorMessage(error);
}







