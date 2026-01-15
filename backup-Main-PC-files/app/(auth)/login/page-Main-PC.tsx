'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { getErrorMessage } from '@/lib/utils/error-handler';
import { Mail, AlertCircle, Check, Clock } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Check if redirected due to timeout
    if (searchParams.get('timeout') === 'true') {
      setShowTimeoutMessage(true);
      // Hide message after 10 seconds
      const timer = setTimeout(() => setShowTimeoutMessage(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setSuccess(true);
    } catch (error: any) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-8 pb-8 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-800 mb-3">Check Your Email</h2>
              <p className="text-muted-foreground mb-6">
                We&apos;ve sent a magic link to <strong className="text-navy-800">{email}</strong>. Click the link to sign in.
              </p>
              <Button 
                variant="navy" 
                size="lg" 
                className="w-full"
                onClick={() => setSuccess(false)}
              >
                Send Another Link
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="w-full max-w-md">
        {/* Timeout Message Banner */}
        {showTimeoutMessage && (
          <Card className="mb-4 shadow-lg border-amber-200 bg-amber-50 dark:bg-amber-900/20 animate-slide-down">
            <CardContent className="pt-4 pb-4 px-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                    Session Expired
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    You were logged out due to 10 minutes of inactivity for security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-xl border-0">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center shadow-lg overflow-hidden border-4 border-white">
                <svg className="w-16 h-16 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-navy-800 mb-2">Welcome to PSR Train</h1>
              <p className="text-muted-foreground">We&apos;ll send you a magic link to sign in</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
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
                  />
                </div>
                <p className="text-xs text-muted-foreground">We&apos;ll send a magic link to this email</p>
              </div>
              <Button type="submit" variant="navy" size="lg" className="w-full h-12" disabled={loading}>
                {loading ? 'Sending magic link...' : 'Send Magic Link'}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6 pt-6 border-t border-border">
              <span className="text-muted-foreground">Don&apos;t have an account? </span>
              <Link href="/signup" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
