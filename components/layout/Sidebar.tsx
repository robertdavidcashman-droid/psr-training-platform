"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Play,
  Clock,
  AlertTriangle,
  FileText,
  Library,
  X,
  GraduationCap,
  Grid3X3,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Syllabus Map", href: "/syllabus", icon: BookOpen },
  { name: "Coverage Matrix", href: "/coverage", icon: Grid3X3 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Practice", href: "/practice", icon: Play },
  { name: "Mock Exam", href: "/mock-exam", icon: Clock },
  { name: "Critical Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Portfolio", href: "/portfolio", icon: FileText },
  { name: "Resources", href: "/resources", icon: Library },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;

    // Focus the close button for keyboard users when opening on mobile/tablet.
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);

    // Escape to close.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "inset-y-0 left-0 z-50 w-64 flex-col border-r transition-transform duration-200",
          "bg-[hsl(var(--navy))] text-white border-white/10",
          open ? "fixed flex translate-x-0" : "hidden",
          "lg:static lg:z-auto lg:flex lg:translate-x-0"
        )}
        aria-label="Primary navigation"
        data-testid="sidebar"
      >
        {/* Logo */}
        <div className="flex h-18 items-center justify-between px-5 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--gold))]">
              <GraduationCap className="h-6 w-6 text-[hsl(var(--gold-foreground))]" />
            </div>
            <span className="font-semibold text-2xl">PSR Academy</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            data-testid="sidebar-close"
            ref={closeBtnRef}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto" data-testid="sidebar-nav">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-4 text-lg leading-6 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--navy))]",
                  isActive
                    ? "bg-white/10 text-white border-l-4 border-[hsl(var(--gold))] pl-2"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <item.icon className={cn("h-7 w-7", isActive ? "text-[hsl(var(--gold))]" : "text-white/70")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-lg leading-relaxed text-white/80">
              <strong className="text-white">Training purposes only.</strong>{" "}
              This platform provides educational content aligned to PSR accreditation standards. It does not provide legal advice.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
