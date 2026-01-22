"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { getUiScale } from "@/lib/storage";
import { SessionPing } from "@/components/SessionPing";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // SSR can't read localStorage. `app/layout.tsx` sets this before first paint to
    // avoid layout shift. This is a safety net for edge cases.
    if (!document.documentElement.dataset.uiScale) {
      document.documentElement.dataset.uiScale = getUiScale();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="app-shell">
      <SessionPing />
      <div className="flex flex-1 min-h-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1" data-testid="main-content">
            <div className="w-full p-4 md:p-6 lg:px-8 lg:py-6 xl:px-10">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
}
