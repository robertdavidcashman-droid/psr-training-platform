"use client";

import { Menu, Flame, Star, TrendingUp, Search, HelpCircle, ChevronRight, Type, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getProgress, getUiScale, setUiScale, type UiScale, type UserProgress } from "@/lib/storage";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  onMenuClick: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/syllabus": "Syllabus Map",
  "/practice": "Practice",
  "/mock-exam": "Mock Exam",
  "/incidents": "Critical Incidents",
  "/portfolio": "Portfolio Workbook",
  "/resources": "Resources",
};

const NEXT_SCALE: Record<UiScale, UiScale> = {
  sm: "md",
  md: "lg",
  lg: "xl",
  xl: "xxl",
  xxl: "sm",
};

const SCALE_LABEL: Record<UiScale, string> = {
  sm: "A",
  md: "A+",
  lg: "A++",
  xl: "A+++",
  xxl: "MAX",
};

export function Header({ onMenuClick }: HeaderProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [uiScale, setUiScaleState] = useState<UiScale>("md");
  const pathname = usePathname();
  const router = useRouter();
  
  const getSupabaseClient = () => {
    try {
      return createClient();
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  useEffect(() => {
    // Keep initial render aligned with SSR to avoid hydration mismatch.
    // The HTML font size is set before first paint in `app/layout.tsx`.
    setUiScaleState(getUiScale());
  }, []);

  const cycleScale = () => {
    const next = NEXT_SCALE[uiScale];
    setUiScaleState(next);
    setUiScale(next);
    document.documentElement.dataset.uiScale = next;
  };

  const handleLogout = async () => {
    try {
      // Call logout API to end session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Sign out from Supabase client
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.auth.signOut();
      }

      // Redirect to home
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to redirect even if logout fails
      router.push("/");
    }
  };

  const title = ROUTE_TITLES[pathname] ?? "PSR Training Academy";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b",
        "bg-[hsl(var(--navy))] text-white border-white/10"
      )}
      data-testid="header"
    >
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-white hover:bg-white/10 hover:text-white"
        onClick={onMenuClick}
        data-testid="menu-button"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Title + breadcrumbs */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-lg text-white/70" data-testid="breadcrumbs">
          <span className="hidden sm:inline">Home</span>
          <ChevronRight className="hidden sm:inline h-5 w-5" />
          <span className="truncate">{title}</span>
        </div>
        <div className="truncate text-xl font-semibold leading-tight sm:text-2xl" data-testid="topbar-title">
          {title}
        </div>
      </div>

      {/* Search (placeholder) */}
      <div className="hidden lg:flex w-[320px]">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search topics (coming soon)…"
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-[hsl(var(--gold))] focus-visible:ring-offset-[hsl(var(--navy))]"
            aria-label="Search"
            disabled
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* UI scale */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white gap-2 text-lg"
          onClick={cycleScale}
          aria-label={`Text size: ${
            uiScale === "sm" ? "Standard" : uiScale === "md" ? "Large" : uiScale === "lg" ? "Extra large" : uiScale === "xl" ? "Extra extra large" : "Maximum"
          }. Click to change.`}
          data-testid="ui-scale-button"
          type="button"
        >
          <Type className="h-5 w-5" />
          <span className="font-semibold">{SCALE_LABEL[uiScale]}</span>
        </Button>

        {/* Streak */}
        <div className="flex items-center gap-2" data-testid="streak-display">
          <Flame className="h-6 w-6 text-[hsl(var(--gold))]" />
          <span className="font-semibold text-lg">
            {progress?.currentStreak || 0}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-2" data-testid="xp-display">
          <Star className="h-6 w-6 text-[hsl(var(--gold))]" />
          <span className="font-semibold text-lg">
            {progress?.totalXp || 0} XP
          </span>
        </div>

        {/* Level */}
        <Badge
          variant="secondary"
          className="gap-2 bg-white/10 text-white border-white/10 text-lg"
          data-testid="level-display"
        >
          <TrendingUp className="h-5 w-5" />
          Level {progress?.level || 1}
        </Badge>

        {/* Help (UI only) */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white"
          aria-label="Help"
          data-testid="help-button"
          type="button"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>

        {/* Logout */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 hover:text-white"
          aria-label="Logout"
          data-testid="logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </div>
      </div>
    </header>
  );
}
