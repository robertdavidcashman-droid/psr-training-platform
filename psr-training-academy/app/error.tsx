'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="text-muted-foreground text-sm">
        An unexpected error occurred. You can retry, or return to the dashboard.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/dashboard">
          <Button variant="outline">Go to dashboard</Button>
        </Link>
      </div>
      {process.env.NODE_ENV !== 'production' ? (
        <pre className="bg-muted max-h-[320px] overflow-auto rounded-md border p-3 text-xs">
          {String(error?.stack ?? error?.message ?? error)}
        </pre>
      ) : null}
    </div>
  );
}
