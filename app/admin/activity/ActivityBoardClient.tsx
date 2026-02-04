"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Users, 
  RefreshCw, 
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Monitor,
  Smartphone,
  Tablet,
  Timer,
  History,
  ChevronDown,
  ChevronUp,
  Globe,
} from "lucide-react";

interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  isMobile: boolean;
}

interface SessionRecord {
  sessionId: string;
  startedAt: string;
  endedAt: string | null;
  duration: number | null;
  durationFormatted: string | null;
  device: DeviceInfo | null;
}

interface ActivityRecord {
  userId: string;
  email: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lastLogoutAt: string | null;
  userAgent: string | null;
  ipAddress: string | null;
  device: DeviceInfo | null;
  isActive: boolean;
  totalSessions: number;
  totalTimeSpent: number;
  totalTimeSpentFormatted: string;
  currentSessionDuration: number | null;
  currentSessionDurationFormatted: string | null;
  sessions: SessionRecord[];
}

interface ActivityStats {
  totalUsers: number;
  activeNow: number;
  totalSessions: number;
  avgSessionDuration: number;
  avgSessionDurationFormatted: string;
}

interface ActivityResponse {
  ok: boolean;
  records: ActivityRecord[];
  count: number;
  activeCount: number;
  stats: ActivityStats;
  error?: string;
}

function DeviceIcon({ device }: { device: DeviceInfo | null }) {
  if (!device) return <Monitor className="h-4 w-4 text-muted-foreground" />;
  
  switch (device.device) {
    case "Mobile":
      return <Smartphone className="h-4 w-4 text-blue-500" />;
    case "Tablet":
      return <Tablet className="h-4 w-4 text-purple-500" />;
    default:
      return <Monitor className="h-4 w-4 text-green-500" />;
  }
}

function UserRow({ record, isExpanded, onToggle }: { 
  record: ActivityRecord; 
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <tr className="border-b hover:bg-muted/50 cursor-pointer" onClick={onToggle}>
        <td className="py-3 px-2">
          <div className="flex items-center gap-2">
            {record.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={record.avatarUrl} 
                alt={record.name} 
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                {record.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <span className="font-medium text-sm">{record.name}</span>
              <span className="block font-mono text-xs text-muted-foreground">{record.email}</span>
            </div>
          </div>
        </td>
        <td className="py-3 px-2">
          <div className="flex items-center gap-2">
            <DeviceIcon device={record.device} />
            <div className="text-xs">
              {record.device ? (
                <>
                  <span>{record.device.browser}</span>
                  <span className="block text-muted-foreground">{record.device.os}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Unknown</span>
              )}
            </div>
          </div>
        </td>
        <td className="py-3 px-2">
          <span className="text-xs">{formatDate(record.firstSeenAt)}</span>
        </td>
        <td className="py-3 px-2">
          <div>
            <span className="text-xs font-medium">{formatRelativeTime(record.lastSeenAt)}</span>
            <span className="block text-xs text-muted-foreground">
              {formatDate(record.lastSeenAt)}
            </span>
          </div>
        </td>
        <td className="py-3 px-2">
          {record.isActive ? (
            <Badge variant="default" className="bg-green-500 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              ACTIVE
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              OFFLINE
            </Badge>
          )}
        </td>
        <td className="py-3 px-2">
          <div className="flex items-center gap-1 text-xs">
            <Timer className="h-3 w-3 text-muted-foreground" />
            {record.isActive && record.currentSessionDurationFormatted ? (
              <span className="text-green-600 font-medium">{record.currentSessionDurationFormatted}</span>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </td>
        <td className="py-3 px-2">
          <div className="text-xs">
            <span className="font-medium">{record.totalSessions}</span>
            <span className="text-muted-foreground ml-1">sessions</span>
          </div>
        </td>
        <td className="py-3 px-2">
          <span className="text-xs font-medium">{record.totalTimeSpentFormatted || "0s"}</span>
        </td>
        <td className="py-3 px-2">
          {record.lastLogoutAt ? (
            <span className="text-xs">{formatDate(record.lastLogoutAt)}</span>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </td>
        <td className="py-3 px-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </td>
      </tr>
      
      {/* Expanded Session History */}
      {isExpanded && (
        <tr className="bg-muted/30">
          <td colSpan={10} className="py-4 px-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Sessions (Last 10)
              </h4>
              {record.sessions.length > 0 ? (
                <div className="grid gap-2">
                  {record.sessions.slice().reverse().map((session) => (
                    <div 
                      key={session.sessionId} 
                      className="flex items-center justify-between p-3 rounded-lg bg-background border text-xs"
                    >
                      <div className="flex items-center gap-4">
                        <DeviceIcon device={session.device} />
                        <div>
                          <span className="font-medium">{formatDate(session.startedAt)}</span>
                          {session.device && (
                            <span className="ml-2 text-muted-foreground">
                              {session.device.browser} on {session.device.os}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {session.endedAt ? (
                          <>
                            <span className="text-muted-foreground">Ended: {formatDate(session.endedAt)}</span>
                            <Badge variant="outline" className="gap-1">
                              <Timer className="h-3 w-3" />
                              {session.durationFormatted || "0s"}
                            </Badge>
                          </>
                        ) : (
                          <Badge className="bg-green-500 gap-1">
                            <Activity className="h-3 w-3" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No session history available</p>
              )}
              
              {/* Additional user details */}
              <div className="pt-3 border-t mt-4">
                <h4 className="text-sm font-semibold mb-2">Connection Details</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="ml-2 font-mono">{record.ipAddress || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User Agent:</span>
                    <span className="ml-2 font-mono text-[10px] break-all">{record.userAgent || "Unknown"}</span>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function ActivityBoardClient() {
  const { isLoaded } = useUser();
  const [data, setData] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/activity", {
        credentials: "include",
      });
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || "Failed to load activity data");
        setData(null);
      } else {
        setData(result);
        setLastRefresh(new Date());
      }
    } catch {
      setError("Failed to connect to server");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      fetchActivity();
    }
  }, [isLoaded, fetchActivity]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  const toggleUserExpanded = (userId: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div data-testid="activity-board-page">
      <div className="flex items-center justify-between mb-6">
        <PageHeader
          title="Activity Board"
          description="Monitor user activity, sessions, and connection details"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={fetchActivity}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-destructive/50 bg-destructive/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">Access Denied</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.stats.totalUsers}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Active Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{data.stats.activeNow}</p>
              <p className="text-xs text-muted-foreground">Last 5 minutes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{data.stats.totalSessions}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Avg Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{data.stats.avgSessionDurationFormatted}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last Updated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">
                {lastRefresh ? formatRelativeTime(lastRefresh.toISOString()) : "-"}
              </p>
              <p className="text-xs text-muted-foreground">Auto-refreshes every 30s</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Table */}
      {data && data.records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold">User</th>
                    <th className="text-left py-3 px-2 font-semibold">Device</th>
                    <th className="text-left py-3 px-2 font-semibold">First Seen</th>
                    <th className="text-left py-3 px-2 font-semibold">Last Active</th>
                    <th className="text-left py-3 px-2 font-semibold">Status</th>
                    <th className="text-left py-3 px-2 font-semibold">Session</th>
                    <th className="text-left py-3 px-2 font-semibold">Sessions</th>
                    <th className="text-left py-3 px-2 font-semibold">Total Time</th>
                    <th className="text-left py-3 px-2 font-semibold">Last Logout</th>
                    <th className="text-left py-3 px-2 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((record) => (
                    <UserRow 
                      key={record.userId} 
                      record={record} 
                      isExpanded={expandedUsers.has(record.userId)}
                      onToggle={() => toggleUserExpanded(record.userId)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {data && data.records.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No activity recorded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              User activity will appear here as users sign in and use the app.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
