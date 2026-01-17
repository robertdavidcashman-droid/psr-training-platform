'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Debug page - Development only
 * Shows client/server session status and health information
 */
export default function DebugPage() {
  const [clientSession, setClientSession] = useState<{ user: any; session: any } | null>(null);
  const [serverSession, setServerSession] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const supabase = createClient();

    // Get client-side session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setClientSession({
        user: session?.user || null,
        session: session || null,
      });
    });

    // Get server-side session info
    fetch('/api/debug/session')
      .then(res => res.json())
      .then(data => {
        setServerSession(data);
      })
      .catch(err => {
        setServerSession({ error: err.message });
      });

    // Get health status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setHealthStatus(data);
      })
      .catch(err => {
        setHealthStatus({ error: err.message });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Page</CardTitle>
            <CardDescription>Not available in production</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Page</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug Information</CardTitle>
          <CardDescription>Development-only diagnostics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Client-Side Session</h3>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(
                {
                  user: clientSession?.user
                    ? {
                        id: clientSession.user.id,
                        email: clientSession.user.email,
                      }
                    : null,
                  session: clientSession?.session
                    ? {
                        expires_at: clientSession.session.expires_at,
                        access_token: clientSession.session.access_token
                          ? `${clientSession.session.access_token.substring(0, 20)}...`
                          : null,
                      }
                    : null,
                },
                null,
                2
              )}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Server-Side Session</h3>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(serverSession, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Health Status</h3>
            <pre className="bg-muted p-4 rounded text-xs overflow-auto">
              {JSON.stringify(healthStatus, null, 2)}
            </pre>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Session Match</h3>
            <p className="text-sm">
              {clientSession?.user?.id === serverSession?.user?.id ? (
                <span className="text-green-600">✓ Client and server sessions match</span>
              ) : (
                <span className="text-red-600">✗ Client and server sessions do not match</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
