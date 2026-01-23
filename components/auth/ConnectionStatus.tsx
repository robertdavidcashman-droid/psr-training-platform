"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface ConnectionStatusProps {
  onStatusChange?: (healthy: boolean) => void;
  showWhenHealthy?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function ConnectionStatus({
  onStatusChange,
  showWhenHealthy = false,
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
}: ConnectionStatusProps) {
  const [status, setStatus] = useState<{
    healthy: boolean;
    checking: boolean;
    error?: string;
  }>({
    healthy: true,
    checking: true,
  });

  const checkHealth = async () => {
    setStatus((prev) => ({ ...prev, checking: true }));
    try {
      const response = await fetch("/api/auth/health");
      const data = await response.json();
      
      setStatus({
        healthy: data.healthy,
        checking: false,
        error: data.error?.message || (data.healthy ? undefined : "Connection check failed"),
      });
      onStatusChange?.(data.healthy);
    } catch (err) {
      setStatus({
        healthy: false,
        checking: false,
        error: err instanceof Error ? err.message : "Failed to check connection status",
      });
      onStatusChange?.(false);
    }
  };

  useEffect(() => {
    checkHealth();

    if (autoRefresh) {
      const interval = setInterval(checkHealth, refreshInterval);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, refreshInterval]);

  // Don't show when healthy unless explicitly requested
  if (status.healthy && !showWhenHealthy) {
    return null;
  }

  if (status.checking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span>Checking connection...</span>
      </div>
    );
  }

  if (status.healthy) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
        <CheckCircle2 className="h-4 w-4" />
        <span>Connection healthy</span>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-md text-destructive bg-destructive/10">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-4 w-4" />
        <div className="flex-1 space-y-2">
          <div className="font-medium text-sm">{status.error || "Connection error"}</div>
          <button
            onClick={checkHealth}
            className="mt-2 text-xs underline hover:no-underline flex items-center gap-1"
            type="button"
          >
            <RefreshCw className="h-3 w-3" />
            Check again
          </button>
        </div>
      </div>
    </div>
  );
}
