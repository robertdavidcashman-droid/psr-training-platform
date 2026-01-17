'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
          <h1 className="text-2xl font-semibold tracking-tight">Application error</h1>
          <p className="text-muted-foreground text-sm">Try reloading the page.</p>
          <Button onClick={reset}>Reload</Button>
        </div>
      </body>
    </html>
  );
}
