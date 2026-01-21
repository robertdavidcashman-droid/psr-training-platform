"use client";

import { Menu, Flame, Star, TrendingUp, Search, HelpCircle, ChevronRight, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getProgress, getUiScale, setUiScale, type UiScale, type UserProgress } from "@/lib/storage";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  lg: "sm",
};

const SCALE_LABEL: Record<UiScale, string> = {
  sm: "A-",
  md: "A",
  lg: "A+",
};

export function Header({ onMenuClick }: HeaderProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [uiScale, setUiScaleState] = useState<UiScale>("md");
  const pathname = usePathname();

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  useEffect(() => {
    const scale = getUiScale();
    setUiScaleState(scale);
    document.documentElement.dataset.uiScale = scale;
  }, []);

  const cycleScale = () => {
    const next = NEXT_SCALE[uiScale];
    setUiScaleState(next);
    setUiScale(next);
    document.documentElement.dataset.uiScale = next;
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
        <div className="flex items-center gap-2 text-sm text-white/70" data-testid="breadcrumbs">
          <span className="hidden sm:inline">Home</span>
          <ChevronRight className="hidden sm:inline h-4 w-4" />
          <span className="truncate">{title}</span>
        </div>
        <div className="truncate text-lg font-semibold leading-tight sm:text-xl" data-testid="topbar-title">
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
      <div className="flex items-center gap-3 md:gap-4">
        {/* UI scale */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white gap-2"
          onClick={cycleScale}
          aria-label={`Text size: ${uiScale === "sm" ? "Small" : uiScale === "md" ? "Default" : "Large"}. Click to change.`}
          data-testid="ui-scale-button"
          type="button"
        >
          <Type className="h-4 w-4" />
          <span className="font-semibold">{SCALE_LABEL[uiScale]}</span>
        </Button>

        {/* Streak */}
        <div className="flex items-center gap-1.5" data-testid="streak-display">
          <Flame className="h-5 w-5 text-[hsl(var(--gold))]" />
          <span className="font-semibold text-sm">
            {progress?.currentStreak || 0}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5" data-testid="xp-display">
          <Star className="h-5 w-5 text-[hsl(var(--gold))]" />
          <span className="font-semibold text-sm">
            {progress?.totalXp || 0} XP
          </span>
        </div>

        {/* Level */}
        <Badge
          variant="secondary"
          className="gap-1 bg-white/10 text-white border-white/10"
          data-testid="level-display"
        >
          <TrendingUp className="h-4 w-4" />
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
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
      </div>
    </header>
  );
}
