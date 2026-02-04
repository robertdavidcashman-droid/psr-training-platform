/**
 * In-memory activity store for tracking user sessions.
 * 
 * This store persists only in memory on the server.
 * Data is lost when the server restarts.
 * 
 * For production, consider persisting to Supabase Postgres.
 */

export interface SessionRecord {
  sessionId: string;
  startedAt: Date;
  endedAt: Date | null;
  duration: number | null; // in seconds
  userAgent: string | null;
  ipAddress: string | null;
  device: DeviceInfo | null;
}

export interface DeviceInfo {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string; // "Desktop", "Mobile", "Tablet"
  isMobile: boolean;
}

export interface ActivityRecord {
  userId: string;
  email: string;
  name: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  firstSeenAt: Date;
  lastSeenAt: Date;
  lastLogoutAt: Date | null;
  userAgent: string | null;
  ipAddress: string | null;
  device: DeviceInfo | null;
  totalSessions: number;
  totalTimeSpent: number; // in seconds
  currentSessionStart: Date | null;
  sessions: SessionRecord[];
}

// In-memory store - persists across requests in the same server instance
const activityStore = new Map<string, ActivityRecord>();

/**
 * Parse user agent string to extract device info
 */
export function parseUserAgent(userAgent: string | null): DeviceInfo | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();
  
  // Detect browser
  let browser = "Unknown";
  let browserVersion = "";
  
  if (ua.includes("edg/")) {
    browser = "Edge";
    const match = userAgent.match(/Edg\/(\d+(?:\.\d+)?)/i);
    browserVersion = match?.[1] || "";
  } else if (ua.includes("chrome") && !ua.includes("edg")) {
    browser = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/i);
    browserVersion = match?.[1] || "";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/i);
    browserVersion = match?.[1] || "";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
    const match = userAgent.match(/Version\/(\d+(?:\.\d+)?)/i);
    browserVersion = match?.[1] || "";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
    const match = userAgent.match(/(?:Opera|OPR)\/(\d+(?:\.\d+)?)/i);
    browserVersion = match?.[1] || "";
  }

  // Detect OS
  let os = "Unknown";
  let osVersion = "";
  
  if (ua.includes("windows nt 10")) {
    os = "Windows";
    osVersion = "10/11";
  } else if (ua.includes("windows nt 6.3")) {
    os = "Windows";
    osVersion = "8.1";
  } else if (ua.includes("windows nt 6.2")) {
    os = "Windows";
    osVersion = "8";
  } else if (ua.includes("windows nt 6.1")) {
    os = "Windows";
    osVersion = "7";
  } else if (ua.includes("mac os x")) {
    os = "macOS";
    const match = userAgent.match(/Mac OS X (\d+[._]\d+(?:[._]\d+)?)/i);
    osVersion = match?.[1]?.replace(/_/g, ".") || "";
  } else if (ua.includes("android")) {
    os = "Android";
    const match = userAgent.match(/Android (\d+(?:\.\d+)?)/i);
    osVersion = match?.[1] || "";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
    const match = userAgent.match(/OS (\d+[._]\d+(?:[._]\d+)?)/i);
    osVersion = match?.[1]?.replace(/_/g, ".") || "";
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  // Detect device type
  let device = "Desktop";
  const isMobile = ua.includes("mobile") || ua.includes("android") || ua.includes("iphone");
  const isTablet = ua.includes("tablet") || ua.includes("ipad");
  
  if (isTablet) {
    device = "Tablet";
  } else if (isMobile) {
    device = "Mobile";
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    isMobile: isMobile || isTablet,
  };
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Upsert a user's activity record
 */
export function upsertActivity(data: {
  userId: string;
  email: string;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}): ActivityRecord {
  const existing = activityStore.get(data.userId);
  const now = new Date();
  const device = parseUserAgent(data.userAgent ?? null);

  if (existing) {
    // Update existing record
    const updated: ActivityRecord = {
      ...existing,
      email: data.email,
      name: data.name,
      firstName: data.firstName ?? existing.firstName,
      lastName: data.lastName ?? existing.lastName,
      avatarUrl: data.avatarUrl ?? existing.avatarUrl,
      lastSeenAt: now,
      userAgent: data.userAgent ?? existing.userAgent,
      ipAddress: data.ipAddress ?? existing.ipAddress,
      device: device ?? existing.device,
    };
    
    // Start a new session if there isn't one active or if more than 30 min since last activity
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    if (!existing.currentSessionStart || existing.lastSeenAt < thirtyMinutesAgo) {
      // End previous session if exists
      if (existing.currentSessionStart && existing.sessions.length > 0) {
        const lastSession = existing.sessions[existing.sessions.length - 1];
        if (!lastSession.endedAt) {
          lastSession.endedAt = existing.lastSeenAt;
          lastSession.duration = Math.floor((existing.lastSeenAt.getTime() - lastSession.startedAt.getTime()) / 1000);
          updated.totalTimeSpent += lastSession.duration;
        }
      }
      
      // Start new session
      updated.currentSessionStart = now;
      updated.totalSessions += 1;
      updated.sessions.push({
        sessionId: generateSessionId(),
        startedAt: now,
        endedAt: null,
        duration: null,
        userAgent: data.userAgent ?? null,
        ipAddress: data.ipAddress ?? null,
        device,
      });
    }
    
    activityStore.set(data.userId, updated);
    return updated;
  } else {
    // Create new record with first session
    const sessionId = generateSessionId();
    const record: ActivityRecord = {
      userId: data.userId,
      email: data.email,
      name: data.name,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      avatarUrl: data.avatarUrl ?? null,
      firstSeenAt: now,
      lastSeenAt: now,
      lastLogoutAt: null,
      userAgent: data.userAgent ?? null,
      ipAddress: data.ipAddress ?? null,
      device,
      totalSessions: 1,
      totalTimeSpent: 0,
      currentSessionStart: now,
      sessions: [{
        sessionId,
        startedAt: now,
        endedAt: null,
        duration: null,
        userAgent: data.userAgent ?? null,
        ipAddress: data.ipAddress ?? null,
        device,
      }],
    };
    activityStore.set(data.userId, record);
    return record;
  }
}

/**
 * Record a user logout
 */
export function recordLogout(userId: string): ActivityRecord | null {
  const existing = activityStore.get(userId);
  if (!existing) return null;

  const now = new Date();
  
  // End current session
  if (existing.sessions.length > 0) {
    const lastSession = existing.sessions[existing.sessions.length - 1];
    if (!lastSession.endedAt) {
      lastSession.endedAt = now;
      lastSession.duration = Math.floor((now.getTime() - lastSession.startedAt.getTime()) / 1000);
      existing.totalTimeSpent += lastSession.duration;
    }
  }

  const updated: ActivityRecord = {
    ...existing,
    lastLogoutAt: now,
    lastSeenAt: now,
    currentSessionStart: null,
  };
  activityStore.set(userId, updated);
  return updated;
}

/**
 * Get all activity records, sorted by lastSeenAt (descending)
 */
export function getAllActivity(): ActivityRecord[] {
  return Array.from(activityStore.values()).sort(
    (a, b) => b.lastSeenAt.getTime() - a.lastSeenAt.getTime()
  );
}

/**
 * Get activity for a specific user
 */
export function getActivity(userId: string): ActivityRecord | null {
  return activityStore.get(userId) ?? null;
}

/**
 * Check if a user is considered "active" (seen within last N minutes)
 */
export function isUserActive(userId: string, withinMinutes: number = 5): boolean {
  const record = activityStore.get(userId);
  if (!record) return false;
  
  const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000);
  return record.lastSeenAt > cutoff;
}

/**
 * Get the count of active users
 */
export function getActiveUserCount(withinMinutes: number = 5): number {
  const cutoff = new Date(Date.now() - withinMinutes * 60 * 1000);
  let count = 0;
  for (const record of activityStore.values()) {
    if (record.lastSeenAt > cutoff) count++;
  }
  return count;
}

/**
 * Get current session duration in seconds for a user
 */
export function getCurrentSessionDuration(userId: string): number | null {
  const record = activityStore.get(userId);
  if (!record || !record.currentSessionStart) return null;
  
  return Math.floor((Date.now() - record.currentSessionStart.getTime()) / 1000);
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get activity statistics
 */
export function getActivityStats(): {
  totalUsers: number;
  activeNow: number;
  totalSessions: number;
  avgSessionDuration: number;
} {
  const records = Array.from(activityStore.values());
  const cutoff = new Date(Date.now() - 5 * 60 * 1000);
  
  let totalSessions = 0;
  let totalDuration = 0;
  let completedSessions = 0;
  
  for (const record of records) {
    totalSessions += record.totalSessions;
    for (const session of record.sessions) {
      if (session.duration !== null) {
        totalDuration += session.duration;
        completedSessions++;
      }
    }
  }
  
  return {
    totalUsers: records.length,
    activeNow: records.filter(r => r.lastSeenAt > cutoff).length,
    totalSessions,
    avgSessionDuration: completedSessions > 0 ? Math.floor(totalDuration / completedSessions) : 0,
  };
}
