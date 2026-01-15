'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const WARNING_TIME = 2 * 60 * 1000; // Show warning 2 minutes before logout
const LAST_ACTIVITY_KEY = 'psr_last_activity';

export function InactivityTimeout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const supabaseRef = useRef(createClient());

  const logout = useCallback(async () => {
    console.log('🔒 Auto-logout due to inactivity');
    
    // Get session ID from localStorage (stored by Header component)
    const sessionId = typeof window !== 'undefined' 
      ? localStorage.getItem('psr_session_id') 
      : null;

    // Track logout time before signing out
    if (sessionId) {
      try {
        await fetch('/api/auth/logout-track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
      } catch (error) {
        console.warn('Error tracking logout:', error);
        // Don't block logout if tracking fails
      }
    }
    
    // Clear stored activity time and session ID
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LAST_ACTIVITY_KEY);
      localStorage.removeItem('psr_session_id');
    }

    if (isSupabaseConfigured()) {
      try {
        await supabaseRef.current.auth.signOut();
      } catch (error) {
        console.warn('Error signing out:', error);
      }
    }
    
    setShowWarning(false);
    router.push('/login?timeout=true');
    router.refresh();
  }, [router]);

  const showWarningDialog = useCallback(() => {
    console.log('⚠️ Showing inactivity warning');
    setShowWarning(true);
    setSecondsLeft(120);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store interval ref for cleanup
    return countdownInterval;
  }, []);

  const resetTimer = useCallback(() => {
    const now = Date.now();
    
    // Update last activity in localStorage for cross-tab sync
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if showing
    if (showWarning) {
      setShowWarning(false);
    }

    // Set warning timeout (8 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      const countdownInterval = showWarningDialog();
      
      // Final logout timeout (2 more minutes after warning)
      timeoutRef.current = setTimeout(() => {
        clearInterval(countdownInterval);
        logout();
      }, WARNING_TIME);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

  }, [logout, showWarning, showWarningDialog]);

  const stayLoggedIn = useCallback(() => {
    console.log('✅ User chose to stay logged in');
    setShowWarning(false);
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Check if user was previously active (for page refreshes)
    if (typeof window !== 'undefined') {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity, 10);
        
        // If inactive for more than timeout, logout immediately
        if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
          console.log('🔒 Session expired - logging out');
          logout();
          return;
        }
      }
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
      'keydown',
    ];

    // Throttle mousemove to avoid excessive resets
    let mouseMoveThrottle: NodeJS.Timeout | null = null;
    const throttledResetTimer = (e: Event) => {
      if (e.type === 'mousemove') {
        if (!mouseMoveThrottle) {
          resetTimer();
          mouseMoveThrottle = setTimeout(() => {
            mouseMoveThrottle = null;
          }, 1000); // Throttle to once per second
        }
      } else {
        resetTimer();
      }
    };

    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, throttledResetTimer, true);
    });

    // Also reset on focus (when user switches back to tab/window)
    window.addEventListener('focus', resetTimer);

    // Check for activity in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        const lastActivity = parseInt(e.newValue, 10);
        const timeSinceActivity = Date.now() - lastActivity;
        
        // If activity in another tab is recent, reset this tab's timer
        if (timeSinceActivity < 5000) {
          resetTimer();
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (mouseMoveThrottle) {
        clearTimeout(mouseMoveThrottle);
      }
      events.forEach((event) => {
        document.removeEventListener(event, throttledResetTimer, true);
      });
      window.removeEventListener('focus', resetTimer);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [resetTimer, logout]);

  // Warning dialog
  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-card border-2 border-border rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-slide-up">
        <div className="text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-2">Still there?</h2>
          <p className="text-muted-foreground mb-6">
            You'll be logged out in <span className="font-bold text-amber-600 dark:text-amber-400 text-xl">{secondsLeft}</span> seconds due to inactivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={stayLoggedIn}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Stay Logged In
            </button>
            <button
              onClick={logout}
              className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl transition-all"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

