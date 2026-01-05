'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check if there's a hash fragment with tokens (implicit flow)
        const hash = window.location.hash;
        if (hash) {
          // Parse the hash fragment
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const type = params.get('type');

          if (accessToken && type === 'magiclink') {
            // Set the session using the tokens from the hash
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            if (error) {
              throw error;
            }

            setStatus('success');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
            return;
          }
        }

        // Check URL params for token_hash (email confirmation flow)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenHash = urlParams.get('token_hash');
        const type = urlParams.get('type');

        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as 'email' | 'magiclink',
          });

          if (error) {
            throw error;
          }

          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          return;
        }

        // Check if user is already authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          return;
        }

        // No valid auth parameters found
        setStatus('error');
        setErrorMessage('Invalid or expired authentication link.');
      } catch (error: any) {
        console.error('Auth confirm error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed. Please try again.');
      }
    };

    handleAuth();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <Card className="shadow-xl border-0 w-full max-w-md">
        <CardContent className="pt-8 pb-8 px-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
              <h2 className="text-2xl font-bold text-navy-800 mb-3">Signing you in...</h2>
              <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-800 mb-3">Success!</h2>
              <p className="text-muted-foreground">Redirecting you to your dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-navy-800 mb-3">Authentication Failed</h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>
              <Link href="/login">
                <Button variant="navy" size="lg" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


















