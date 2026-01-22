import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ForceLogoutButton } from "./ForceLogoutButton";

interface SessionRow {
  id: string;
  user_id: string;
  email: string | null;
  ip_address: string | null;
  login_at: string;
  last_seen_at: string;
  logout_at: string | null;
  active: boolean;
  user_agent: string | null;
}

function getStatus(session: SessionRow): "ACTIVE" | "IDLE" | "LOGGED OUT" {
  if (!session.active || session.logout_at) {
    return "LOGGED OUT";
  }

  const lastSeen = new Date(session.last_seen_at);
  const now = new Date();
  const minutesSinceLastSeen = (now.getTime() - lastSeen.getTime()) / (1000 * 60);

  if (minutesSinceLastSeen <= 2) {
    return "ACTIVE";
  }

  return "IDLE";
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
}

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Check if user is admin
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminData || adminError) {
    redirect("/dashboard");
  }

  // Fetch all sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from("user_sessions")
    .select("*")
    .order("login_at", { ascending: false })
    .limit(100);

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
  }

  // Note: Email fetching from auth.users requires service role or admin API
  // For now, we'll show user_id. Admin can manually look up emails in Supabase dashboard if needed.
  // Alternatively, you can store email in user_sessions table on login if needed.
  const sessionsWithEmails: SessionRow[] = (sessions || []).map((session) => ({
    ...session,
    email: null, // Email would need to be fetched via admin API or stored in session table
  }));

  const activeSessions = sessionsWithEmails.filter(
    (s) => getStatus(s) === "ACTIVE"
  );
  const idleSessions = sessionsWithEmails.filter((s) => getStatus(s) === "IDLE");
  const loggedOutSessions = sessionsWithEmails.filter(
    (s) => getStatus(s) === "LOGGED OUT"
  );

  return (
    <div>
      <PageHeader
        title="Session Management"
        description="View and manage user sessions"
      />

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {activeSessions.length}
            </div>
            <div className="text-sm text-muted-foreground">Active Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {idleSessions.length}
            </div>
            <div className="text-sm text-muted-foreground">Idle Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              {loggedOutSessions.length}
            </div>
            <div className="text-sm text-muted-foreground">Logged Out</div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Email / User ID</th>
                  <th className="text-left p-2">IP Address</th>
                  <th className="text-left p-2">Login Time</th>
                  <th className="text-left p-2">Last Seen</th>
                  <th className="text-left p-2">Logout Time</th>
                  <th className="text-left p-2">User Agent</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessionsWithEmails.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-muted-foreground">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  sessionsWithEmails.map((session) => {
                    const status = getStatus(session);
                    return (
                      <tr key={session.id} className="border-b">
                        <td className="p-2">
                          {status === "ACTIVE" && (
                            <Badge variant="success" className="gap-1">
                              ACTIVE
                            </Badge>
                          )}
                          {status === "IDLE" && (
                            <Badge variant="warning" className="gap-1">
                              IDLE
                            </Badge>
                          )}
                          {status === "LOGGED OUT" && (
                            <Badge variant="secondary" className="gap-1">
                              LOGGED OUT
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 font-medium">
                          {session.email || session.user_id.slice(0, 8) + "..."}
                        </td>
                        <td className="p-2">{session.ip_address || "—"}</td>
                        <td className="p-2">{formatDate(session.login_at)}</td>
                        <td className="p-2">{formatDate(session.last_seen_at)}</td>
                        <td className="p-2">{formatDate(session.logout_at)}</td>
                        <td className="p-2 max-w-xs truncate" title={session.user_agent || ""}>
                          {session.user_agent || "—"}
                        </td>
                        <td className="p-2">
                          {status !== "LOGGED OUT" && (
                            <ForceLogoutButton sessionId={session.id} />
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
