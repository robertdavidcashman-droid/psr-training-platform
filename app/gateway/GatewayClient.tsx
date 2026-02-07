"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GatewayClient() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const getSafeNextPath = () => {
    const next = searchParams.get("next");
    if (!next) return "/dashboard";
    // Only allow internal paths (avoid open redirect)
    if (!next.startsWith("/") || next.startsWith("//")) return "/dashboard";
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });

      const data = (await response.json().catch(() => null)) as null | { ok?: boolean; error?: string };
      if (!response.ok || !data?.ok) {
        setError(data?.error || "Access denied.");
        setLoading(false);
        return;
      }

      const redirectTo = getSafeNextPath();
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Gateway error:", err);
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Access Code</CardTitle>
          <CardDescription>
            This app is gated. Enter the access code to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Access code</Label>
              <Input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={loading}
                autoComplete="off"
                placeholder="Enter the code you were given"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

