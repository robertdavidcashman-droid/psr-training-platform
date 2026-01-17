'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80),
});

export default function SignupPage() {
  const supabase = React.useMemo(() => createClient(), []);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  // Check if Supabase is configured
  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Server configuration error: Supabase environment variables are not set. Please contact support.');
    }
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (!isSupabaseConfigured()) {
      setError('Server configuration error: Supabase environment variables are not set. Please contact support.');
      return;
    }
    
    const parsed = schema.safeParse({ email, password, name });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { name: parsed.data.name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        // Provide more helpful error messages
        if (signUpError.message.includes('fetch') || signUpError.message.includes('Failed to fetch')) {
          setError('Unable to connect to the authentication service. This may be a configuration issue. Please try again later or contact support.');
        } else {
          setError(signUpError.message);
        }
        return;
      }

      setMessage('Check your email to confirm your account, then log in.');
    } catch (err: any) {
      // Catch network errors
      if (err?.message?.includes('fetch') || err?.message?.includes('Failed to fetch') || err?.name === 'TypeError') {
        setError('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err?.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Start training with Duolingo-style practice</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-muted-foreground text-xs">Minimum 8 characters.</p>
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          {message ? <p className="text-foreground text-sm">{message}</p> : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
          <div className="text-sm">
            <Link className="underline underline-offset-4" href="/login">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
