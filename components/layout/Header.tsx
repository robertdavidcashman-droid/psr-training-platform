"use client";

import { Menu, Flame, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getProgress, type UserProgress } from "@/lib/storage";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6" data-testid="header">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        data-testid="menu-button"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>

      <div className="flex-1" />

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-1.5" data-testid="streak-display">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-semibold text-sm">
            {progress?.currentStreak || 0}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1.5" data-testid="xp-display">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold text-sm">
            {progress?.totalXp || 0} XP
          </span>
        </div>

        {/* Level */}
        <Badge variant="secondary" className="gap-1" data-testid="level-display">
          <TrendingUp className="h-3 w-3" />
          Level {progress?.level || 1}
        </Badge>
      </div>
    </header>
  );
}
