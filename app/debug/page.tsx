'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

export default function DebugPage() {
  const [clientSession, setClientSession] = useState<any>(null);
  const [serverHealth, setServerHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSessions() {
      // Authentication is disabled - no session to check
      setClientSession(null);

      // Check server health
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setServerHealth(data);
      } catch (error) {
        setServerHealth({ error: 'Failed to fetch health' });
      }

      setLoading(false);
    }

    checkSessions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading debug info...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">Debug Information</h1>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Client Session (Browser)</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              Authentication disabled - no session required
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Server Health</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {serverHealth ? JSON.stringify(serverHealth, null, 2) : 'No data'}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}
              </div>
              <div>
                <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
