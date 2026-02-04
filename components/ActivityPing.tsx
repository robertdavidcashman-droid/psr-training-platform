"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

const PING_INTERVAL_MS = 60 * 1000; // 60 seconds

/**
 * ActivityPing component - sends periodic pings to track user activity.
 * Mount this in the app layout to track activity on all authenticated pages.
 */
export function ActivityPing() {
  const { isSignedIn, isLoaded } = useUser();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const ping = async () => {
      try {
        await fetch("/api/activity/ping", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        // Silently fail - activity tracking is non-critical
        console.debug("Activity ping failed:", error);
      }
    };

    // Send initial ping immediately
    ping();

    // Set up interval for subsequent pings
    intervalRef.current = setInterval(ping, PING_INTERVAL_MS);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoaded, isSignedIn]);

  // This component doesn't render anything visible
  return null;
}
