'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

/**
 * SessionBanner - Development-only debug component
 * Shows session info to help diagnose auth issues
 */
export function SessionBanner() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [serverSession, setServerSession] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return; // Only show in development
    }

    const supabase = createClient();

    // Get client-side session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Get server-side session info (via API)
    fetch('/api/debug/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setServerSession({ id: data.user.id, role: data.user.role || 'unknown' });
        }
      })
      .catch(() => {
        // API may not exist, that's OK
      })
      .finally(() => {
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-300 p-2 text-xs z-50">
        <div className="container mx-auto">Loading session info...</div>
      </div>
    );
  }

  const clientUserId = user?.id;
  const serverUserId = serverSession?.id;
  const sessionMatch = clientUserId === serverUserId;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 border-t p-2 text-xs z-50 ${
        sessionMatch
          ? 'bg-green-100 border-green-300'
          : 'bg-red-100 border-red-300'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <strong>DEV: Session Debug</strong>
            {clientUserId ? (
              <>
                {' | '}
                Client: {clientUserId.substring(0, 8)}...
                {serverSession ? (
                  <>
                    {' | '}
                    Server: {serverSession.id.substring(0, 8)}...
                    {' | '}
                    Role: {serverSession.role}
                  </>
                ) : (
                  ' | Server: Not available'
                )}
                {!sessionMatch && ' ⚠️ MISMATCH'}
              </>
            ) : (
              ' | Not authenticated'
            )}
          </div>
          <div>
            {session?.expires_at ? (
              <>
                Expires: {new Date(session.expires_at * 1000).toLocaleTimeString()}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
