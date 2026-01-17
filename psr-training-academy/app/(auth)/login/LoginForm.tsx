'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const supabase = React.useMemo(() => createClient(), []);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    
    try {
      // Use server-side login route to avoid CORS issues
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Session is set via cookies, refresh to get new session
      const target = nextPath && nextPath.startsWith('/') ? nextPath : '/dashboard';
      window.location.assign(target);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Access PSR Training Academy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <Link className="underline underline-offset-4" href="/reset-password">
              Forgot password?
            </Link>
            <Link className="underline underline-offset-4" href="/signup">
              Create account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
