'use client';

import * as React from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name is too long'),
});

export default function SignupPage() {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    const parsed = schema.safeParse({ email, password, name });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || 'Invalid input');
      return;
    }

    setLoading(true);
    
    try {
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
        window.location.href = '/dashboard';
        return;
      }

      // Email confirmation required
      setMessage(data.message || 'Check your email to confirm your account, then log in.');
    } catch (err: any) {
      // Network errors - never show "Failed to fetch"
      if (err.name === 'TypeError' || err.message?.includes('fetch')) {
        setError('Network issue. Please check your connection and try again.');
      } else {
        setError('Service unavailable. Please try again shortly.');
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
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
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
              disabled={loading}
              required
            />
            <p className="text-muted-foreground text-xs">Minimum 8 characters.</p>
          </div>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="text-foreground text-sm" role="status">
              {message}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </Button>
          <div className="text-sm">
            <Link className="underline underline-offset-4 hover:text-primary" href="/login">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
