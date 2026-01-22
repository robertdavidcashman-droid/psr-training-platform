"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ForceLogoutButtonProps {
  sessionId: string;
}

export function ForceLogoutButton({ sessionId }: ForceLogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForceLogout = async () => {
    if (!confirm("Are you sure you want to force logout this session?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/force-logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to force logout");
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error("Error forcing logout:", error);
      alert("Failed to force logout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleForceLogout}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Force Logout"}
    </Button>
  );
}
