"use client";

import { useEffect } from "react";

export function SessionPing() {
  useEffect(() => {
    // Ping immediately on mount
    const ping = async () => {
      try {
        await fetch("/api/auth/ping", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience
        console.error("Session ping failed:", error);
      }
    };

    ping();

    // Then ping every 60 seconds
    const interval = setInterval(ping, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  // This component renders nothing
  return null;
}
