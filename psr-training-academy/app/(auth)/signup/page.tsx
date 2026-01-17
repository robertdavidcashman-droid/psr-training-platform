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
    
    // Read values directly from DOM inputs (works for both React state and E2E tests)
    // This ensures we get the actual values even if React state hasn't updated
    const form = e.currentTarget as HTMLFormElement;
    const nameInput = form.querySelector('input#name') as HTMLInputElement;
    const emailInput = form.querySelector('input#email') as HTMLInputElement;
    const passwordInput = form.querySelector('input#password') as HTMLInputElement;
    
    // Always prefer DOM values over React state (more reliable for E2E)
    const finalName = nameInput?.value?.trim() || '';
    const finalEmail = emailInput?.value?.trim() || '';
    const finalPassword = passwordInput?.value || '';
    
    // If DOM values are empty, fall back to React state
    const useName = finalName || name;
    const useEmail = finalEmail || email;
    const usePassword = finalPassword || password;
    
    // Debug logging
    console.log('Signup form submission:', { 
      domName: finalName, domEmail: finalEmail, domPassword: finalPassword ? '***' : '',
      stateName: name, stateEmail: email, statePassword: password ? '***' : '',
      useName, useEmail, usePassword: usePassword ? '***' : ''
    });
    
    // Validate with detailed error logging
    const parsed = schema.safeParse({ email: useEmail, password: usePassword, name: useName });
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const errorMsg = firstIssue?.message ?? 'Invalid input';
      console.error('Signup validation failed:', {
        issue: firstIssue,
        allIssues: parsed.error.issues,
        values: { 
          email: useEmail, 
          emailLength: useEmail.length,
          emailType: typeof useEmail,
          name: useName, 
          password: usePassword ? '***' : '',
          passwordLength: usePassword.length
        },
        zodError: parsed.error.format()
      });
      setError(errorMsg);
      return;
    }
    
    console.log('Signup validation passed, submitting to server...');

    setLoading(true);
    
    try {
      // Use server-side signup route to avoid CORS issues
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!data.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // If session was created, user is logged in - redirect to dashboard
      if (data.session) {
        // Session is set via cookies, refresh to get new session
        window.location.href = '/dashboard';
        return;
      }

      // Email confirmation required
      setMessage(data.message || 'Check your email to confirm your account, then log in.');
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
            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
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
              name="password"
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
