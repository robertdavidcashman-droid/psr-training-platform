'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { formatErrorForUser } from '@/lib/utils/error-handler';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Mail, AlertCircle, User, Lock } from 'lucide-react';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Authentication service is not configured. Please contact support or check your environment settings.');
      return;
    }

    // Check for error from callback route
    const errorParam = searchParams.get('error');
    if (errorParam) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (errorParam === 'auth_callback_error') {
        errorMessage = 'Authentication failed. Please sign up again with email and password.';
      } else if (errorParam === 'connection_error') {
        errorMessage = 'Unable to connect to the authentication service. Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      
      // Clear the error from URL after displaying it
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.issues) {
          // Validation errors
          const firstIssue = data.issues[0];
          setError(firstIssue.message || 'Invalid input');
        } else {
          // Auth errors
          const errorMessage = data.error || 'Signup failed';
          setError(formatErrorForUser(new Error(errorMessage)));
        }
        return;
      }

      // Success - redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      const errorMessage = formatErrorForUser(error);
      setError(errorMessage || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
                <User className="w-16 h-16 text-white/90" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-navy-800 mb-2">Create Your Account</h1>
              <p className="text-muted-foreground">Sign up to get started</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold text-navy-800">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="pl-11 h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-navy-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-12"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-navy-800">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pl-11 h-12"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
              </div>
              <Button type="submit" variant="navy" size="lg" className="w-full h-12" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-border">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
