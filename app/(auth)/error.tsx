'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Authentication Error
          </h2>
          
          <p className="text-muted-foreground mb-6">
            We encountered an error during authentication. Please try again.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-4 bg-muted rounded-lg text-left">
              <p className="text-xs font-mono text-muted-foreground break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              variant="default"
              className="w-full sm:w-auto"
            >
              Try again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/login'}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
