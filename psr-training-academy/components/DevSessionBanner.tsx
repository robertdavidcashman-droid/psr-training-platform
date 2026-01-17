'use client';

import * as React from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * DevSessionBanner - Development-only component to debug session state
 * Shows both client-side and server-side session status
 */
export function DevSessionBanner() {
  const [clientSession, setClientSession] = React.useState<boolean | null>(null);
  const [serverSession, setServerSession] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    // Check client-side session
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setClientSession(!!session);
    });

    // Check server-side session
    fetch('/api/auth/health')
      .then((res) => res.json())
      .then((data) => {
        setServerSession(data.hasSession);
        setLoading(false);
      })
      .catch(() => {
        setServerSession(null);
        setLoading(false);
      });
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-xs text-yellow-800">
        DEV: Loading session status...
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-xs text-yellow-800">
      <strong>DEV: Session Debug</strong>
      {' | '}
      Client: {clientSession ? '✓' : '✗'} | Server: {serverSession ? '✓' : '✗'}
      {clientSession !== serverSession && (
        <span className="ml-2 text-red-600 font-semibold">
          ⚠ Mismatch! Cookies may not be syncing.
        </span>
      )}
    </div>
  );
}
